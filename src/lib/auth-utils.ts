import { User } from "better-auth";

export type UserRole = "user" | "u1" | "u2" | "u3" | "u4";

export interface AuthUser extends User {
  role?: UserRole;
}

export const roleHierarchy: Record<UserRole, number> = {
  user: 0,
  u1: 1,
  u2: 2,
  u3: 3,
  u4: 4,
};

export const rolePermissions = {
  user: {
    canViewDashboard: true,
    canViewGallery: true,
    canViewMissions: false,
    canCreateMissions: false,
    canViewProjects: false,
    canViewCompanies: false,
    canManageUsers: false,
  },
  u1: {
    canViewDashboard: true,
    canViewGallery: true,
    canViewMissions: true,
    canCreateMissions: true,
    canViewProjects: false,
    canViewCompanies: false,
    canManageUsers: false,
  },
  u2: {
    canViewDashboard: true,
    canViewGallery: true,
    canViewMissions: true,
    canCreateMissions: true,
    canEditMissions: true,
    canViewProjects: true,
    canViewCompanies: false,
    canManageUsers: false,
  },
  u3: {
    canViewDashboard: true,
    canViewGallery: true,
    canViewMissions: true,
    canCreateMissions: true,
    canEditMissions: true,
    canViewProjects: true,
    canViewCompanies: true,
    canManageUsers: false,
  },
  u4: {
    canViewDashboard: true,
    canViewGallery: true,
    canViewMissions: true,
    canCreateMissions: true,
    canEditMissions: true,
    canViewProjects: true,
    canViewCompanies: true,
    canEditCompanies: true,
    canManageUsers: true,
  },
} as const;

export function getUserRole(user: AuthUser | null): UserRole {
  return (user?.role as UserRole) || "user";
}

export function hasRole(user: AuthUser | null, requiredRole: UserRole): boolean {
  const userRole = getUserRole(user);
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function hasPermission(
  user: AuthUser | null,
  permission: keyof typeof rolePermissions.user
): boolean {
  const userRole = getUserRole(user);
  const permissions = rolePermissions[userRole];
  return permissions?.[permission] || false;
}

export function canAccessRoute(user: AuthUser | null, routePath: string): boolean {
  const userRole = getUserRole(user);
  
  // Route-specific access control
  const routeAccess: Record<string, UserRole[]> = {
    "/dashboard": ["user", "u1", "u2", "u3", "u4"],
    "/dashboard/gallery": ["user", "u1", "u2", "u3", "u4"],
    "/dashboard/missions": ["u1", "u2", "u3", "u4"],
    "/dashboard/missions/new": ["u1", "u2", "u3", "u4"],
    "/dashboard/projects": ["u2", "u3", "u4"],
    "/dashboard/projects/new": ["u2", "u3", "u4"],
    "/dashboard/companies": ["u3", "u4"],
    "/dashboard/companies/new": ["u3", "u4"],
    "/dashboard/users": ["u4"],
    "/dashboard/users/new": ["u4"],
  };
  
  // Check for pattern matches (e.g., company modifier routes)
  if (routePath.includes("/companies/") && routePath.includes("/modifier")) {
    return hasRole(user, "u4");
  }
  
  const allowedRoles = routeAccess[routePath];
  if (!allowedRoles) {
    return true; // Allow access to routes not explicitly restricted
  }
  
  return allowedRoles.includes(userRole);
}

export function getRedirectPath(user: AuthUser | null): string {
  const userRole = getUserRole(user);
  
  // Redirect based on user role
  switch (userRole) {
    case "u4":
      return "/dashboard/users";
    case "u3":
      return "/dashboard/companies";
    case "u2":
      return "/dashboard/projects";
    case "u1":
      return "/dashboard/missions";
    default:
      return "/dashboard/gallery";
  }
}
