import React from 'react';
import { MissionHeader } from '@/components/missions/missions-header';

interface ReportHeaderProps {
  viewMode: 'kanban' | 'list';
  onViewModeChange: (mode: 'kanban' | 'list') => void;
}

export function ReportHeader({ viewMode, onViewModeChange }: ReportHeaderProps) {
  return (
    <div>
      <MissionHeader viewMode={viewMode} onViewModeChange={onViewModeChange} />
    </div>
  );
}
