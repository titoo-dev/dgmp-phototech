import React from 'react';
import { MissionSearch } from '@/components/missions/missions-search';
import { UserRole } from '@/lib/auth-utils';

interface ReportSearchProps {
  searchQuery: string;
  onSearchChange: (s: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  userRole: UserRole;
}

export function ReportSearch({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  userRole,
}: ReportSearchProps) {
  return (
    <div>
      <MissionSearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        userRole={userRole}
      />
    </div>
  );
}
