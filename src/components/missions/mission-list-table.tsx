import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
import { Calendar, MoreHorizontal, Eye, Edit, Trash2, Users, Plus, MapPin, Send, Loader2, CheckCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { MissionModel } from '@/models/mission-schema';
import { DeleteMissionDialog } from './delete-mission-dialog';
import { MissionDetailsSheet } from './mission-details-sheet';
import { MissionStatus } from '@/lib/generated/prisma';
import { getStatusDisplayName, getStatusBadgeVariant, getStatusBadgeClasses } from '@/lib/helpers/mission-status-helper';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { sendMissionReportAction } from '@/actions/mission/send-mission-report-action';
import { validateMissionAction } from '@/actions/mission/validate-mission-action';
import { ReviewMissionDialog } from './review-mission-dialog';
import { AuthUser, UserRole } from '@/lib/auth-utils';

type MissionTableItem = {
	id: string;
	name: string;
	data: MissionModel;
};

interface MissionListTableProps {
	missions: MissionTableItem[];
	searchQuery: string;
	getStatusBadge: (status: string) => React.ReactNode;
	onMissionDeleted?: () => void;
	onMissionSent?: () => void;
	user: AuthUser;
	userRole: UserRole;
}

export function MissionListTable({ missions, searchQuery, getStatusBadge, onMissionDeleted, onMissionSent, user, userRole }: MissionListTableProps) {
	const [openSheetId, setOpenSheetId] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const [sendingMissionId, setSendingMissionId] = useState<string | null>(null);
	const [validatingMissionId, setValidatingMissionId] = useState<string | null>(null);

	const handleSendMission = (missionId: string, missionNumber: string) => {
		setSendingMissionId(missionId);
		startTransition(async () => {
			const result = await sendMissionReportAction(missionId);

			if (result.success) {
				toast.success('Mission envoyée', {
					description: result.message,
					duration: 3000,
				});
				onMissionSent?.();
			} else {
				toast.error('Erreur', {
					description: result.errors?._form?.[0] || 'Impossible d\'envoyer la mission',
					duration: 5000,
				});
			}
			setSendingMissionId(null);
		});
	};

	const handleValidateMission = (missionId: string, missionNumber: string) => {
		setValidatingMissionId(missionId);
		startTransition(async () => {
			const result = await validateMissionAction(missionId);

			if (result.success) {
				toast.success('Mission validée', {
					description: result.message,
					duration: 3000,
				});
				onMissionSent?.(); // Refresh missions
			} else {
				toast.error('Erreur', {
					description: result.errors?._form?.[0] || 'Impossible de valider la mission',
					duration: 5000,
				});
			}
			setValidatingMissionId(null);
		});
	};

	return (
		<>
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
								{(userRole === 'u1' || userRole === 'u2') && <TableHead className="w-[200px]">Actions</TableHead>}
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
											<Badge 
												variant="outline" 
												className={getStatusBadgeClasses(missionData.status as MissionStatus)}
											>
												{getStatusDisplayName(missionData.status as MissionStatus)}
											</Badge>
										</TableCell>
										{(userRole === 'u1' || userRole === 'u2') && (
											<TableCell>
												<div className="flex items-center gap-2">
													{/* u1 actions */}
													{userRole === 'u1' && missionData.status === MissionStatus.DRAFT && (
														<Button
															size="sm"
															variant="outline"
															onClick={() => handleSendMission(missionData.id, missionData.missionNumber)}
															disabled={sendingMissionId === missionData.id}
															className="h-7 px-3 text-xs"
														>
															{sendingMissionId === missionData.id ? (
																<Loader2 className="w-3 h-3 animate-spin mr-1" />
															) : (
																<Send className="w-3 h-3 mr-1" />
															)}
															Envoyer
														</Button>
													)}

													{/* u2 actions */}
													{userRole === 'u2' && missionData.status === MissionStatus.PENDING && (
														<>
															<Button
																size="sm"
																variant="outline"
																onClick={() => handleValidateMission(missionData.id, missionData.missionNumber)}
																disabled={validatingMissionId === missionData.id}
																className="h-7 px-3 text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
															>
																{validatingMissionId === missionData.id ? (
																	<Loader2 className="w-3 h-3 animate-spin mr-1" />
																) : (
																	<CheckCircle className="w-3 h-3 mr-1" />
																)}
																Valider
															</Button>

															<ReviewMissionDialog
																missionId={missionData.id}
																missionNumber={missionData.missionNumber}
																onReviewSuccess={() => onMissionSent?.()}
																trigger={
																	<Button
																		size="sm"
																		variant="outline"
																		className="h-7 px-3 text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
																	>
																		<MessageSquare className="w-3 h-3 mr-1" />
																		Réviser
																	</Button>
																}
															/>
														</>
													)}
												</div>
											</TableCell>
										)}
										<TableCell>
											{userRole === 'u2' || missionData.status !== MissionStatus.DRAFT ? (
												<Button
													variant="ghost"
													className="h-8 w-8 p-0"
													onClick={() => setOpenSheetId(missionData.id)}
												>
													<Eye className="h-4 w-4" />
												</Button>
											) : (
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="h-8 w-8 p-0">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem onClick={() => setOpenSheetId(missionData.id)}>
															<Eye className="w-4 h-4 mr-2" />
															Voir
														</DropdownMenuItem>
														<DropdownMenuItem asChild>
															<Link href={`/dashboard/missions/${missionData.id}/modifier`}>
																<Edit className="w-4 h-4 mr-2" />
																Modifier
															</Link>
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DeleteMissionDialog
															missionId={missionData.id}
															missionNumber={missionData.missionNumber}
															onDeleteSuccess={onMissionDeleted}
															trigger={
																<DropdownMenuItem
																	className="text-red-600 focus:text-red-600 focus:bg-red-50"
																	onSelect={(e) => e.preventDefault()}
																>
																	<Trash2 className="w-4 h-4 mr-2" />
																	Supprimer
																</DropdownMenuItem>
															}
														/>
													</DropdownMenuContent>
												</DropdownMenu>
											)}
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

			{/* Mission Details Sheets */}
			{missions.map((mission) => (
				<MissionDetailsSheet
					key={mission.id}
					missionId={mission.id}
					isOpen={openSheetId === mission.id}
					onClose={() => setOpenSheetId(null)}
					user={user}
					userRole={userRole}
					onMissionUpdated={() => onMissionSent?.()}
				/>
			))}
		</>
	);
}
