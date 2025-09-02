'use client';

import { useState, useMemo, useTransition } from 'react';
import { MissionModel } from '@/models/mission-schema';
import {
	Clock,
	CheckCircle,
	AlertCircle,
} from 'lucide-react';
import { MissionKanbanView } from '@/components/missions/missions-kanban-view';
import { Badge } from '@/components/ui/badge';
import { ReportHeader } from '@/components/missions/report-header';
import { ReportSearch } from '@/components/missions/report-search';
import { MissionListTable } from '@/components/missions/mission-list-table';
import type { MissionWithRelations } from '../../actions/mission/get-missions-action';
import { updateMissionStatusAction } from '@/actions/mission/update-mission-status-action';
import { MissionStatus } from '@/lib/generated/prisma';
import { toast } from 'sonner';

interface MissionsClientProps {
  missions: MissionWithRelations[];
}

type MissionKanbanItem = {
  id: string;
  name: string;
  column: string;
  data: MissionModel;
};

export function MissionsClient({ missions }: MissionsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [, startTransition] = useTransition();

  // Transform database missions to the format expected by components
  const missionsData = useMemo(() => {
    return missions.map((mission): MissionKanbanItem => ({
      id: mission.id,
      name: `Mission #${mission.missionNumber}`,
      column: mission.status,
      data: {
        id: mission.id,
        missionNumber: mission.missionNumber,
        teamLeader: {
          id: mission.teamLeader.id,
          name: mission.teamLeader.name,
          email: mission.teamLeader.email,
          emailVerified: mission.teamLeader.emailVerified,
          image: mission.teamLeader.image,
          createdAt: mission.teamLeader.createdAt,
          updatedAt: mission.teamLeader.updatedAt,
          role: mission.teamLeader.role,
        },
        teamLeaderId: mission.teamLeaderId,
        members: mission.members,
        startDate: mission.startDate,
        endDate: mission.endDate,
        location: mission.location,
        agentCount: mission.agentCount,
        marketCount: mission.marketCount,
        status: mission.status,
      },
    }));
  }, [missions]);

  // Calculate kanban columns with dynamic counts
  const kanbanColumns = useMemo(() => [
    {
      id: 'DRAFT',
      name: 'Brouillons',
      count: missionsData.filter((m) => m.column === 'DRAFT').length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 'PENDING',
      name: 'En attente',
      count: missionsData.filter((m) => m.column === 'PENDING').length,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      id: 'COMPLETED',
      name: 'Validés',
      count: missionsData.filter((m) => m.column === 'COMPLETED').length,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      id: 'REJECTED',
      name: 'Refusés',
      count: missionsData.filter((m) => m.column === 'REJECTED').length,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  ], [missionsData]);

  const [currentMissionsData, setCurrentMissionsData] = useState<MissionKanbanItem[]>(missionsData);

  const handleMissionsChange = (newMissions: MissionKanbanItem[]) => {
    const changedMissions = newMissions.filter((newMission) => {
      const originalMission = missions.filter(m => m.id === newMission.id)[0];
      return originalMission.status !== newMission.column;
    });

    // Update UI immediately for better UX
    setCurrentMissionsData(newMissions);

    // Process status updates
    if (changedMissions.length > 0) {
      startTransition(async () => {
        for (const changedMission of changedMissions) {
          try {
            const newStatus = changedMission.column as MissionStatus;
            const result = await updateMissionStatusAction(changedMission.id, newStatus);
            if (!result.success) {
              toast.error('Erreur', {
                description: result.errors?._form?.[0] || 'Une erreur inattendue est survenue',
                duration: 5000,
              });
            }
          } catch (error) {
            toast.error('Erreur', {
              description: 'Une erreur inattendue est survenue',
              duration: 5000,
            });
          }
        }
      });
    }
  };

  const filteredMissions = currentMissionsData.filter((mission) => {
    const missionData = mission.data as MissionModel;
    const matchesSearch =
      missionData.missionNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      missionData.teamLeader.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      missionData.location
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || missionData.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Validé
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case 'DRAFT':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Brouillon
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Refusé
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <ReportHeader viewMode={viewMode} onViewModeChange={setViewMode} />

      <ReportSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {viewMode === 'kanban' ? (
        <div className="relative">
          <MissionKanbanView
            columns={kanbanColumns}
            missions={filteredMissions}
            onMissionsChange={handleMissionsChange}
          />
        </div>
      ) : (
        <MissionListTable 
          missions={filteredMissions} 
          searchQuery={searchQuery}
          getStatusBadge={getStatusBadge} 
        />
      )}
    </div>
  );
}
