'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Mail,
	Shield,
	AlertCircle,
	UserPlus,
	Edit,
	Users,
	Loader2,
} from 'lucide-react';
import { createUserAction } from '@/actions/user/create-user';
import { UserRole } from '@/lib/auth-utils';

interface NewUserClientProps {
	organizationId: string;
	userRole: UserRole;
}

export default function NewUserClient({ organizationId, userRole }: NewUserClientProps) {
	const router = useRouter();
	const [inviteEmail, setInviteEmail] = React.useState('');
	const [selectedRole, setSelectedRole] = React.useState<string>('u1');

	const initialState = { success: false };
	const [state, formAction, isPending] = useActionState(createUserAction, initialState);

	React.useEffect(() => {
		if (state.success) {
			toast.success('Invitation envoyée avec succès', {
				description: state.message,
			});
			const timer = setTimeout(() => {
				router.push('/dashboard/users');
			}, 2000);
			return () => clearTimeout(timer);
		}
		
		if (state.error) {
			toast.error('Erreur lors de l\'invitation', {
				description: state.error,
			});
		}
	}, [state.success, state.error, state.message, router]);

	const getRoleDescription = (role: string) => {
		switch (role) {
			case 'u1':
				return 'Agent de terrain - Utilisateur chargé d\'exécuter les missions (Web et Mobile)';
			case 'u2':
				return 'Responsable missions - Accès aux rapports et validation des missions';
			case 'u3':
				return 'Rédacteur magazine - Responsable de la rédaction du magazine';
			case 'u4':
				return 'Administrateur système - Gestion complète du système';
			default:
				return 'Sélectionnez un rôle pour voir sa description';
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="border-b bg-card/50 backdrop-blur">
				<div className="mx-auto max-w-7xl px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<UserPlus className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-foreground">
									Inviter un utilisateur
								</h1>
								<p className="text-sm text-muted-foreground">
									Envoyer une invitation pour rejoindre votre organisation
								</p>
							</div>
						</div>
						<Button
							type="submit"
							form="user-form"
							disabled={isPending}
							className="gap-2"
						>
							{isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Mail className="h-4 w-4" />
							)}
							{isPending ? 'Envoi...' : 'Envoyer l\'invitation'}
						</Button>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-6 py-8">
				<form id="user-form" action={formAction}>
					<input type="hidden" name="organizationId" value={organizationId} />
					<div className="mx-auto max-w-2xl">
						<div className="space-y-6">
							<Card className="border-border/50 shadow-sm">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-lg">
										<UserPlus className="h-5 w-5 text-primary" />
										Informations de l&apos;invitation
									</CardTitle>
									<CardDescription>
										L&apos;utilisateur recevra un email d&apos;invitation pour rejoindre votre organisation
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="space-y-2">
										<Label
											htmlFor="email"
											className="text-sm font-medium text-foreground"
										>
											Adresse email
											<span className="text-destructive ml-1">*</span>
										</Label>
										<div className="relative">
											<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
											<Input
												id="email"
												name="email"
												type="email"
												placeholder="jean.mve@dgmp.ga"
												value={inviteEmail}
												onChange={(e) => setInviteEmail(e.target.value)}
												className="pl-10 h-12"
												aria-invalid={!!state.fieldErrors?.email}
												required
											/>
										</div>
										{state.fieldErrors?.email && (
											<p className="text-sm text-destructive flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{state.fieldErrors.email[0]}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label
											htmlFor="role"
											className="text-sm font-medium text-foreground"
										>
											Rôle dans le système
											<span className="text-destructive ml-1">*</span>
										</Label>
										<div className="relative">
											<Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
											<Select
												name="role"
												value={selectedRole}
												onValueChange={setSelectedRole}
											>
												<SelectTrigger className="pl-10 h-12">
													<SelectValue placeholder="Sélectionner un rôle" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="u1">
														<div className="flex items-center gap-2">
															<Users className="w-4 h-4 text-blue-600" />
															Agent de terrain
														</div>
													</SelectItem>
													{userRole === 'u4' && (
														<>
															<SelectItem value="u2">
																<div className="flex items-center gap-2">
																	<Shield className="w-4 h-4 text-purple-600" />
																	Responsable missions
																</div>
															</SelectItem>
															<SelectItem value="u3">
																<div className="flex items-center gap-2">
																	<Edit className="w-4 h-4 text-green-600" />
																	Rédacteur magazine
																</div>
															</SelectItem>
															<SelectItem value="u4">
																<div className="flex items-center gap-2">
																	<Shield className="w-4 h-4 text-yellow-600" />
																	Administrateur système
																</div>
															</SelectItem>
														</>
													)}
												</SelectContent>
											</Select>
										</div>
										{selectedRole && (
											<p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
												{getRoleDescription(selectedRole)}
											</p>
										)}
										{state.fieldErrors?.role && (
											<p className="text-sm text-destructive flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{state.fieldErrors.role[0]}
											</p>
										)}
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
