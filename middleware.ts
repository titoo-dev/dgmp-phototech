import { NextRequest, NextResponse } from "next/server";
import { getSessionAction } from "@/actions/get-session";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Define route permissions for different user roles
const routePermissions = {
  // Admin routes (u4 only)
  "/dashboard/users": ["u4"],
  "/dashboard/companies/*/modifier": ["u4"],
  
  // Management routes (u3, u4)
  "/dashboard/companies": ["u3", "u4"],
  "/dashboard/projects": ["u2", "u3", "u4"],
  
  // Basic mission access (u1, u2, u3, u4)
  "/dashboard/missions": ["u1", "u2", "u3", "u4"],
  "/dashboard/missions/new": ["u1", "u2", "u3", "u4"],
  
  // Gallery access (all authenticated users)
  "/dashboard/gallery": ["user", "u1", "u2", "u3", "u4"],
  
  // Dashboard home (all authenticated users)
  "/dashboard": ["user", "u1", "u2", "u3", "u4"],
} as const;

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/auth/verify-email",
  "/api/auth",
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
}

function matchRoute(pathname: string): string | null {
  const routes = Object.keys(routePermissions);
  
  // Check for exact match first
  if (routes.includes(pathname)) {
    return pathname;
  }
  
  // Check for pattern matches (e.g., /dashboard/companies/*/modifier)
  for (const route of routes) {
    if (route.includes("*")) {
      const pattern = route.replace("*", "[^/]+");
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(pathname)) {
        return route;
      }
    }
  }
  
  return null;
}

function hasPermission(userRole: string | null, requiredRoles: readonly string[]): boolean {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and public assets
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  
  try {
    // Get session using better-auth
    const session = await auth.api.getSession({
      headers: await headers()
    })

    // Redirect to signin if no session
    if (!session) {
      const url = new URL("/auth/signin", request.url);
      return NextResponse.redirect(url);
    }
    
    // Check if user's email is verified
    if (!session.user.emailVerified) {
      const url = new URL("/auth/verify-email", request.url);
      return NextResponse.redirect(url);
    }
    
    // Check route permissions
    const matchedRoute = matchRoute(pathname);
    if (matchedRoute) {
      const requiredRoles = routePermissions[matchedRoute as keyof typeof routePermissions];
      const userRole = session.user.role || "user";
      
      if (!hasPermission(userRole, requiredRoles)) {
        // Redirect to dashboard with error
        const url = new URL("/dashboard", request.url);
        url.searchParams.set("error", "insufficient-permissions");
        return NextResponse.redirect(url);
      }
    }
    
    return NextResponse.next();
    
  } catch (error) {
    console.error("Middleware auth error:", error);
    
    // Redirect to signin on auth error
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  runtime: "nodejs",
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
