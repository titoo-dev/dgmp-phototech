import React from 'react';
import { MissionHeader } from '@/components/missions/missions-header';
import { UserRole } from '@/lib/auth-utils';

interface ReportHeaderProps {
  userRole?: UserRole;
}

export function ReportHeader({ userRole }: ReportHeaderProps) {
  return (
    <div>
      <MissionHeader userRole={userRole} />
    </div>
  );
}
