import React from 'react';
import { MissionSearch } from '@/components/missions/missions-search';

interface ReportSearchProps {
  searchQuery: string;
  onSearchChange: (s: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
}

export function ReportSearch({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ReportSearchProps) {
  return (
    <div>
      <MissionSearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
      />
    </div>
  );
}
