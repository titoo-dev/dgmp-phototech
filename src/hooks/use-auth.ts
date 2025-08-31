import { authClient } from "@/lib/auth-client";
import { AuthUser, UserRole, hasRole, hasPermission, canAccessRoute, getUserRole } from "@/lib/auth-utils";
import { rolePermissions } from "@/lib/auth-utils";

export function useAuth() {
  const { data: session, isPending } = authClient.useSession();
  
  const user = session?.user as AuthUser | null;
  const isAuthenticated = !!session;
  const isLoading = isPending;
  const userRole = getUserRole(user);
  
  return {
    user,
    isAuthenticated,
    isLoading,
    userRole,
    hasRole: (role: UserRole) => hasRole(user, role),
    hasPermission: (permission: keyof typeof rolePermissions[UserRole]) => 
      hasPermission(user, permission),
    canAccessRoute: (routePath: string) => canAccessRoute(user, routePath),
  };
}
