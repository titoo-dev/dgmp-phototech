"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
	Search,
	Filter,
	Phone,
	Mail,
	Eye,
	Edit,
	Trash2,
	MoreHorizontal,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { CompanyModel } from '@/models/company-schema';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { deleteCompanyAction } from '@/actions/company/delete-company-action';

interface Props {
	companies: CompanyModel[];
}

export default function CompaniesList({ companies }: Props) {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [isPending, startTransition] = React.useTransition();

	const filtered = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		return companies.filter((c) => {
			if (q) {
				if (
					!(
						c.name.toLowerCase().includes(q) ||
						c.email.toLowerCase().includes(q) ||
						c.phoneNumber.toLowerCase().includes(q) ||
						c.nif.toLowerCase().includes(q)
					)
				) {
					return false;
				}
			}

			if (statusFilter === 'active') return c.projectsCount > 0;
			if (statusFilter === 'inactive') return c.projectsCount === 0;
			return true;
		});
	}, [companies, searchQuery, statusFilter]);

	const handleDeleteCompany = (companyId: string) => {
		startTransition(async () => {
			try {
				const result = await deleteCompanyAction(companyId);
				
				if (result.success) {
					// Success feedback could be added here (toast notification)
					console.log(result.message);
				} else {
					// Error feedback could be added here (toast notification)
					console.error(result.error);
				}
			} catch (error) {
				console.error('Erreur lors de la suppression:', error);
			} finally {
				setOpenDialog(false);
			}
		});
	};


	return (
		<>
			<Card className="shadow-none">
				<CardHeader>
					<div className="flex items-center gap-4">
						<div className="relative flex-1 max-w-sm">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input placeholder="Rechercher une entreprise..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8" />
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">
									<Filter className="w-4 h-4 mr-2" />
									Statut
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => setStatusFilter('all')}>Tous les statuts</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setStatusFilter('active')}>Active</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setStatusFilter('inactive')}>Inactive</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Dénomination</TableHead>
								<TableHead>Contact</TableHead>
								<TableHead>NIF</TableHead>
								<TableHead>Nombre de projets</TableHead>
								<TableHead>Nombre d employes</TableHead>
								<TableHead className="w-[70px]"></TableHead>
							</TableRow>
							</TableHeader>
						<TableBody>
							{filtered.map((entreprise) => (
								<TableRow key={entreprise.id}>
									<TableCell>
										<div className="space-y-1">
											<p className="font-medium">{entreprise.name}</p>
																							<p className="text-sm text-muted-foreground">#{entreprise.id.slice(-8)}</p>
										</div>
									</TableCell>
									<TableCell>
										<div className="space-y-1">
											<div className="flex items-center">
												<Phone className="w-3 h-3 mr-1 text-muted-foreground" />
												<span className="text-xs text-muted-foreground">{entreprise.phoneNumber}</span>
											</div>
											<div className="flex items-center">
											<Mail className="w-3 h-3 mr-1 text-muted-foreground" />
											<span className="text-xs text-muted-foreground">{entreprise.email}</span>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<span className="text-sm font-mono">{entreprise.nif}</span>
									</TableCell>
									<TableCell>
										<span className="text-sm font-mono">{entreprise.projectsCount}</span>
									</TableCell>
									<TableCell>
										<span className="text-sm font-mono">{entreprise.employeeCount}</span>
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
													<Link href={`/dashboard/companies/${entreprise.id}`}><Eye className="w-4 h-4 mr-2" />Voir</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link href={`/dashboard/companies/${entreprise.id}/modifier`}><Edit className="w-4 h-4 mr-2" />Modifier</Link>
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
													<AlertDialogTrigger asChild>
														<DropdownMenuItem 
															className="text-red-600" 
															onSelect={(e) => {
																e.preventDefault();
																setOpenDialog(true);
															}}
															disabled={isPending}
														>
															<Trash2 className="w-4 h-4 mr-2" />
															Supprimer
														</DropdownMenuItem>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
															<AlertDialogDescription>
																Êtes-vous sûr de vouloir supprimer l'entreprise "{entreprise.name}" ? Cette action est irréversible.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
															<AlertDialogAction 
																onClick={() => handleDeleteCompany(entreprise.id)}
																disabled={isPending}
																className="bg-red-600 hover:bg-red-700"
															>
																{isPending ? "Suppression..." : "Supprimer"}
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</>
	);
}
