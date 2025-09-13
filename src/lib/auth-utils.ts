import { User } from "better-auth";

export type UserRole = "u1" | "u2" | "u3" | "u4";

export interface AuthUser extends User {
  role?: UserRole;
}

export const roleHierarchy: Record<UserRole, number> = {
  u1: 1,
  u2: 2,
  u3: 3,
  u4: 4,
};

export type RolePermissions = {
  canViewDashboard?: boolean;
  canViewGallery?: boolean;
  canViewMissions: boolean;
  canCreateMissions?: boolean;
  canValidateMissions?: boolean;
  canEditMissions?: boolean;
  canViewProjects?: boolean;
  canViewCompanies?: boolean;
  canCreateCompanies?: boolean;
  canEditCompanies?: boolean;
  canManageUsers?: boolean;
  canCreateProjects?: boolean;
  canEditProjects?: boolean;
  canDeleteProjects?: boolean;
  canDeleteCompanies?: boolean;
};

export const rolePermissions: Record<UserRole, RolePermissions> = {
  u1: {
    canViewDashboard: false,
    canViewMissions: true,
    canCreateMissions: true,
    canViewProjects: true,
    canViewGallery: true,
    canViewCompanies: false,
  },
  u2: {
    canViewMissions: true,
    canValidateMissions: true,
    canViewDashboard: false,
    canViewProjects: true,
    canCreateProjects: true,
    canEditProjects: true,
    canDeleteProjects: true,
    canViewCompanies: true,
    canCreateCompanies: true,
    canEditCompanies: true,
    canDeleteCompanies: true,
    canManageUsers: true,
    canViewGallery: true,
  },
  u3: {
    canViewMissions: true,
    canViewGallery: true,
    canViewProjects: true,
  },
  u4: {
    canViewMissions: true,
    canEditMissions: true,
    canViewGallery: true,
    canViewProjects: true,
    canEditProjects: true,
    canDeleteProjects: true,
    canViewCompanies: true,
    canEditCompanies: true,
    canCreateCompanies: true,
    canDeleteCompanies: true,
    canManageUsers: true,
  },
};

export function getUserRole(user: AuthUser | null): UserRole {
  return (user?.role as UserRole) || "u1";
}

export function hasRole(user: AuthUser | null, requiredRole: UserRole): boolean {
  const userRole = getUserRole(user);
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function hasPermission(
  user: AuthUser | null,
  permission: keyof typeof rolePermissions[UserRole]
): boolean {
  const userRole = getUserRole(user);
  const permissions = rolePermissions[userRole];
  return permissions?.[permission] || false;
}

export function canAccessRoute(user: AuthUser | null, routePath: string): boolean {
  const userRole = getUserRole(user);
  
  // Route-specific access control
  const routeAccess: Record<string, UserRole[]> = {
    "/dashboard": ["u1", "u2", "u3", "u4"],
    "/dashboard/gallery": ["u1", "u2", "u3", "u4"],
    "/dashboard/missions": ["u1", "u2", "u3", "u4"],
    "/dashboard/missions/new": ["u1", "u2", "u3", "u4"],
    "/dashboard/projects": ["u2", "u3", "u4"],
    "/dashboard/projects/new": ["u2", "u3", "u4"],
    "/dashboard/companies": ["u3", "u4"],
    "/dashboard/companies/new": ["u3", "u4"],
    "/dashboard/users": ["u4"],
    "/dashboard/users/new": ["u4"],
    "/dashboard/profile": ["u1", "u2", "u3", "u4"],
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

export function getRoleDisplayName(userRole: UserRole): string {
  switch (userRole) {
    case "u1":
      return "Photographe";
    case "u2":
      return "Chef d'équipe";
    case "u3":
      return "Manager";
    case "u4":
      return "Administrateur";
    default:
      return "Utilisateur";
  }
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
