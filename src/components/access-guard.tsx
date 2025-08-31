"use client";

import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/lib/auth-utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AccessGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: keyof typeof import("@/lib/auth-utils").rolePermissions.user;
  fallback?: React.ReactNode;
}

export function AccessGuard({
  children,
  requiredRole,
  requiredPermission,
  fallback = <div>Access denied. You don't have permission to view this content.</div>
}: AccessGuardProps) {
  const { user, hasRole, hasPermission, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <>{fallback}</>;
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
