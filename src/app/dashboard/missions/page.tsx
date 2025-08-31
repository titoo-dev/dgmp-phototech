'use client';

import { useState } from 'react';
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
import { ReportList } from '@/components/missions/report-list';

const kanbanColumns = [
	{
		id: 'DRAFT',
		name: 'Brouillons',
		count: 0,
		color: 'text-blue-600',
		bgColor: 'bg-blue-50',
		borderColor: 'border-blue-200',
	},
	{
		id: 'PENDING',
		name: 'En attente',
		count: 0,
		color: 'text-yellow-600',
		bgColor: 'bg-yellow-50',
		borderColor: 'border-yellow-200',
	},
	{
		id: 'COMPLETED',
		name: 'Validés',
		count: 0,
		color: 'text-green-600',
		bgColor: 'bg-green-50',
		borderColor: 'border-green-200',
	},
	{
		id: 'REJECTED',
		name: 'Refusés',
		count: 0,
		color: 'text-red-600',
		bgColor: 'bg-red-50',
		borderColor: 'border-red-200',
	},
];


// Sample mission data
const mockMissions: MissionModel[] = [
	{
		id: 'cm1abc123def456ghi789jkl',
		missionNumber: '123456',
		teamLeader: {
			id: 'user_1abc123def456ghi789jkl',
			name: 'Jean Mvé',
			email: 'jean.mve@example.com',
			emailVerified: true,
			image: 'https://via.placeholder.com/150',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01'),
			role: 'MISSIONARY',
		},
		teamLeaderId: 'user_1abc123def456ghi789jkl',
		members: [],
		startDate: new Date('2024-01-15'),
		endDate: new Date('2024-01-16'),
		location: 'Libreville',
		agentCount: 10,
		marketCount: 5,
		status: 'COMPLETED',
	},
	{
		id: 'cm2abc123def456ghi789jkl',
		missionNumber: '123457',
		teamLeader: {
			id: 'user_2abc123def456ghi789jkl',
			name: 'Marie Nkomo',
			email: 'marie.nkomo@example.com',
			emailVerified: true,
			image: 'https://via.placeholder.com/150',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01'),
			role: 'MISSIONARY',
		},
		teamLeaderId: 'user_2abc123def456ghi789jkl',
		members: [],
		startDate: new Date('2024-01-14'),
		endDate: new Date('2024-01-14'),
		location: 'Port-Gentil',
		agentCount: 8,
		marketCount: 3,
		status: 'PENDING',
	},
	{
		id: 'cm3abc123def456ghi789jkl',
		missionNumber: '123458',
		teamLeader: {
			id: 'user_3abc123def456ghi789jkl',
			name: 'Paul Obame',
			email: 'paul.obame@example.com',
			emailVerified: true,
			image: 'https://via.placeholder.com/150',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01'),
			role: 'MISSIONARY',
		},
		teamLeaderId: 'user_3abc123def456ghi789jkl',
		members: [],
		startDate: new Date('2024-01-12'),
		endDate: new Date('2024-01-13'),
		location: 'Franceville',
		agentCount: 6,
		marketCount: 2,
		status: 'DRAFT',
	},
	{
		id: 'cm4abc123def456ghi789jkl',
		missionNumber: '123459',
		teamLeader: {
			id: 'user_4abc123def456ghi789jkl',
			name: 'Sophie Ngouabi',
			email: 'sophie.ngouabi@example.com',
			emailVerified: true,
			image: 'https://via.placeholder.com/150',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01'),
			role: 'MISSIONARY',
		},
		teamLeaderId: 'user_4abc123def456ghi789jkl',
		members: [],
		startDate: new Date('2024-01-11'),
		endDate: new Date('2024-01-12'),
		location: 'Oyem',
		agentCount: 12,
		marketCount: 7,
		status: 'REJECTED',
	},
	{
		id: 'cm5abc123def456ghi789jkl',
		missionNumber: '123460',
		teamLeader: {
			id: 'user_5abc123def456ghi789jkl',
			name: 'Thomas Bouyou',
			email: 'thomas.bouyou@example.com',
			emailVerified: true,
			image: 'https://via.placeholder.com/150',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01'),
			role: 'MISSIONARY',
		},
		teamLeaderId: 'user_5abc123def456ghi789jkl',
		members: [],
		startDate: new Date('2024-01-10'),
		endDate: new Date('2024-01-11'),
		location: 'Lambaréné',
		agentCount: 9,
		marketCount: 4,
		status: 'DRAFT',
	},
];

export default function ReportPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
	const [missions, setMissions] = useState<
		Array<{
			id: string;
			name: string;
			column: string;
			data: MissionModel;
		}>
	>(
		mockMissions.map((mission) => ({
			id: mission.id,
			name: `Mission #${mission.missionNumber}`,
			column: mission.status as string,
			data: mission,
		}))
	);

	const filteredMissions = missions.filter((mission) => {
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

	// Update kanban columns with actual counts
	const updatedKanbanColumns = kanbanColumns.map((column) => ({
		...column,
		count: missions.filter((mission) => mission.column === column.id)
			.length,
	}));

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'completed':
				return (
					<Badge className="bg-green-100 text-green-800 hover:bg-green-100">
						<CheckCircle className="w-3 h-3 mr-1" />
						Validé
					</Badge>
				);
			case 'pending':
				return (
					<Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
						<Clock className="w-3 h-3 mr-1" />
						En attente
					</Badge>
				);
			case 'draft':
				return (
					<Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
						<AlertCircle className="w-3 h-3 mr-1" />
						Brouillon
					</Badge>
				);
			case 'rejected':
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
					<MissionKanbanView
						columns={updatedKanbanColumns}
						missions={filteredMissions}
						onMissionsChange={setMissions}
					/>
				) : (
					<ReportList missions={filteredMissions} getStatusBadge={getStatusBadge} />
				)}
			</div>
	);
}
