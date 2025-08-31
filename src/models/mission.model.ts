import { PublicUser } from './user-schema';
import { Contact } from './contact-schema';

export interface Mission {
  id: string;
  missionNumber: string;
  teamLeader: PublicUser;
  teamLeaderId: string;
  members: Contact[];
  startDate: Date;
  endDate: Date;
  location: string;
  agentCount: number;
  marketCount: number;
  status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED';
}

export interface CreateMissionData {
  teamLeaderId: string;
  members: Contact[];
  startDate: Date;
  endDate: Date;
  location: string;
  agentCount: number;
  marketCount: number;
  status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED';
}

export interface UpdateMissionData {
  id: string;
  missionNumber?: string;
  teamLeaderId?: string;
  members?: Contact[];
  startDate?: Date;
  endDate?: Date;
  location?: string;
  agentCount?: number;
  marketCount?: number;
  status?: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED';
}

export type MissionStatus = 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED';

// Re-export types from the schema for consistency
export type {
  MissionModel,
  CreateMission,
  UpdateMission
} from './mission-schema';
