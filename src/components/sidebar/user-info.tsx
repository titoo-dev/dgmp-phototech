"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AuthUser, UserRole, getRoleDisplayName } from "@/lib/auth-utils";

interface UserInfoProps {
  user: AuthUser | null;
  userRole: UserRole;
}

export function UserInfo({ user, userRole }: UserInfoProps) {
  if (!user) {
    return null;
  }

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const roleDisplayName = getRoleDisplayName(userRole);
  const initials = getInitials(user.name || user.email || "U");

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {user.name || user.email}
        </p>
        <Badge variant="outline" className="text-xs mt-1 text-muted-foreground border-muted-foreground/30">
          {roleDisplayName}
        </Badge>
      </div>
    </div>
  );
}
