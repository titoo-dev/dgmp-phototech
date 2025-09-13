'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { MissionModel } from '@/models/mission-schema';
import {
	Clock,
	CheckCircle,
	AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ReportHeader } from '@/components/missions/report-header';
import { ReportSearch } from '@/components/missions/report-search';
import { MissionListTable } from '@/components/missions/mission-list-table';
import type { MissionWithRelations } from '../../actions/mission/get-missions-action';
import { AuthUser, UserRole } from '@/lib/auth-utils';

interface MissionsClientProps {
  missions: MissionWithRelations[];
  user: AuthUser;
  userRole: UserRole;
}

type MissionTableItem = {
  id: string;
  name: string;
  data: MissionModel;
};

export function MissionsClient({ missions, user, userRole }: MissionsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentMissions, setCurrentMissions] = useState<MissionWithRelations[]>(missions);

  // Transform database missions to the format expected by components
  const missionsData = useMemo(() => {
    return currentMissions.map((mission): MissionTableItem => ({
      id: mission.id,
      name: `Mission #${mission.missionNumber}`,
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
  }, [currentMissions]);

  const [currentMissionsData, setCurrentMissionsData] = useState<MissionTableItem[]>(missionsData);

  // Update currentMissionsData when missionsData changes
  useEffect(() => {
    setCurrentMissionsData(missionsData);
  }, [missionsData]);

  // Refresh missions data
  const refreshMissions = useCallback(async () => {
    try {
      const response = await fetch('/api/missions');
      if (response.ok) {
        const data = await response.json();
        setCurrentMissions(data.missions);
      }
    } catch (error) {
      console.error('Failed to refresh missions:', error);
    }
  }, []);


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
      <ReportHeader />

      <ReportSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        userRole={userRole}
      />

      <MissionListTable 
        missions={filteredMissions} 
        searchQuery={searchQuery}
        getStatusBadge={getStatusBadge}
        onMissionDeleted={refreshMissions}
        onMissionSent={refreshMissions}
        user={user}
        userRole={userRole}
      />
    </div>
  );
}
