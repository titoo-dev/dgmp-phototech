"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AuthUser, UserRole, hasRole, hasPermission, canAccessRoute, getUserRole } from "@/lib/auth-utils";
import { rolePermissions } from "@/lib/auth-utils";

export async function getAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  const user = session?.user as AuthUser | null;
  const isAuthenticated = !!session;
  const userRole = getUserRole(user);
  
  return {
    user,
    isAuthenticated,
    userRole,
    hasRole: (role: UserRole) => hasRole(user, role),
    hasPermission: (permission: keyof typeof rolePermissions[UserRole]) => 
      hasPermission(user, permission),
    canAccessRoute: (routePath: string) => canAccessRoute(user, routePath),
  };
}
