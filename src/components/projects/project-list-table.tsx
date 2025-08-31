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
import { Calendar, MoreHorizontal, Eye, Edit, Trash2, Building2, Plus } from 'lucide-react';
import Link from 'next/link';
import { ProjectModel } from '@/models/project-schema';
import { ProjectStatusBadge } from './project-status-badge';

type ProjectKanbanItem = {
	id: string;
	name: string;
	column: ProjectModel['status'];
	data: ProjectModel;
};

interface ProjectListTableProps {
	projects: ProjectKanbanItem[];
	searchQuery: string;
}

export function ProjectListTable({ projects, searchQuery }: ProjectListTableProps) {
	return (
		<Card className="shadow-none">
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Projet</TableHead>
							<TableHead>Entreprise</TableHead>
							<TableHead>Nature</TableHead>
							<TableHead>Dates</TableHead>
							<TableHead>Statut</TableHead>
							<TableHead className="w-[70px]"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{projects.map((project) => {
							const projet = project.data as ProjectModel;
							return (
								<TableRow key={project.id}>
									<TableCell>
										<div className="space-y-1">
											<p className="font-medium">{projet.title}</p>
											<p className="text-sm text-muted-foreground">
												#{projet.id.toString().padStart(3, '0')}
											</p>
										</div>
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											<p className="font-medium">{projet.company.name}</p>
											<p className="text-sm text-muted-foreground">{projet.company.email}</p>
										</div>
									</TableCell>
									<TableCell>
										<Badge variant="outline" className="capitalize">
											{projet.nature.replace('_', ' ')}
										</Badge>
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											<div className="flex items-center text-sm">
												<Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
												{new Date(projet.startDate).toLocaleDateString('fr-FR')}
											</div>
											<div className="text-xs text-muted-foreground">
												au {new Date(projet.endDate).toLocaleDateString('fr-FR')}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<ProjectStatusBadge status={projet.status} />
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
													<Link href={`/projects/${projet.id}`}>
														<Eye className="w-4 h-4 mr-2" />
														Voir
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link href={`/projects/${projet.id}/modifier`}>
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
				
				{projects.length === 0 && (
					<div className="text-center py-8">
						<Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold mb-2">Aucun projet trouvé</h3>
						<p className="text-muted-foreground mb-4">
							{searchQuery 
								? "Essayez de modifier vos critères de recherche"
								: "Commencez par créer votre premier projet"
							}
						</p>
						{!searchQuery && (
							<Button asChild>
								<Link href="/projects/nouveau">
									<Plus className="w-4 h-4 mr-2" />
									Créer un projet
								</Link>
							</Button>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
