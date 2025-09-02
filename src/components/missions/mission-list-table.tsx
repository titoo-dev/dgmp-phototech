import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, MoreHorizontal, Eye, Edit, Trash2, Users, Plus, MapPin } from 'lucide-react';
import Link from 'next/link';
import { MissionModel } from '@/models/mission-schema';

type MissionKanbanItem = {
	id: string;
	name: string;
	column: string;
	data: MissionModel;
};

interface MissionListTableProps {
	missions: MissionKanbanItem[];
	searchQuery: string;
	getStatusBadge: (status: string) => React.ReactNode;
}

export function MissionListTable({ missions, searchQuery, getStatusBadge }: MissionListTableProps) {
	return (
		<Card className="shadow-none">
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Mission</TableHead>
							<TableHead>Chef d'équipe</TableHead>
							<TableHead>Lieu</TableHead>
							<TableHead>Dates</TableHead>
							<TableHead>Équipe</TableHead>
							<TableHead>Statut</TableHead>
							<TableHead className="w-[70px]"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{missions.map((mission) => {
							const missionData = mission.data as MissionModel;
							return (
								<TableRow key={mission.id}>
									<TableCell>
										<div className="space-y-1">
											<p className="font-medium">Mission #{missionData.missionNumber}</p>
											<p className="text-sm text-muted-foreground">
												{missionData.marketCount} marchés contrôlés
											</p>
										</div>
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											<p className="font-medium">{missionData.teamLeader.name}</p>
											<p className="text-sm text-muted-foreground">{missionData.teamLeader.email}</p>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<MapPin className="w-3 h-3 text-muted-foreground" />
											<span className="text-sm">{missionData.location}</span>
										</div>
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											<div className="flex items-center text-sm">
												<Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
												{new Date(missionData.startDate).toLocaleDateString('fr-FR')}
											</div>
											<div className="text-xs text-muted-foreground">
												au {new Date(missionData.endDate).toLocaleDateString('fr-FR')}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<Users className="w-3 h-3 text-muted-foreground" />
											<span className="text-sm">{missionData.agentCount} agents</span>
										</div>
									</TableCell>
									<TableCell>
										{getStatusBadge(missionData.status.toLowerCase())}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" className="h-8 w-8 p-0">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem asChild>
													<Link href={`/dashboard/missions/${missionData.id}`}>
														<Eye className="w-4 h-4 mr-2" />
														Voir
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link href={`/dashboard/missions/${missionData.id}/modifier`}>
														<Edit className="w-4 h-4 mr-2" />
														Modifier
													</Link>
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem className="text-red-600">
													<Trash2 className="w-4 h-4 mr-2" />
													Supprimer
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
				
				{missions.length === 0 && (
					<div className="text-center py-8">
						<Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold mb-2">Aucune mission trouvée</h3>
						<p className="text-muted-foreground mb-4">
							{searchQuery 
								? "Essayez de modifier vos critères de recherche"
								: "Commencez par créer votre première mission"
							}
						</p>
						{!searchQuery && (
							<Button asChild>
								<Link href="/dashboard/missions/new">
									<Plus className="w-4 h-4 mr-2" />
									Créer une mission
								</Link>
							</Button>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
