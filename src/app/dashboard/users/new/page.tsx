'use client';

import * as React from 'react';
import { useTransition, useActionState } from 'react';
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
	User,
	Mail,
	Shield,
	AlertCircle,
	CheckCircle,
	Save,
	UserPlus,
	Edit,
} from 'lucide-react';

interface FormState {
	success?: boolean;
	errors?: {
		name?: string[];
		email?: string[];
		role?: string[];
		password?: string[];
		confirmPassword?: string[];
	};
	message?: string;
}

async function createUser(
	prevState: FormState,
	formData: FormData
): Promise<FormState> {
	// Simulate API call
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const name = formData.get('name') as string;
	const email = formData.get('email') as string;
	const role = formData.get('role') as string;
	const password = formData.get('password') as string;
	const confirmPassword = formData.get('confirmPassword') as string;

	// Basic validation
	const errors: FormState['errors'] = {};

	if (!name || name.trim().length < 2) {
		errors.name = [
			'Le nom complet doit contenir au moins 2 caractères',
		];
	}

	if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		errors.email = ['Veuillez saisir une adresse email valide'];
	}

	if (!role || !['u1', 'u2', 'u3', 'u4'].includes(role)) {
		errors.role = ['Veuillez sélectionner un rôle valide'];
	}

	if (!password || password.length < 8) {
		errors.password = [
			'Le mot de passe doit contenir au moins 8 caractères',
		];
	}

	if (password !== confirmPassword) {
		errors.confirmPassword = [
			'Les mots de passe ne correspondent pas',
		];
	}

	if (Object.keys(errors).length > 0) {
		return { errors };
	}

	return {
		success: true,
		message: 'L\'utilisateur a été créé avec succès',
	};
}

export default function NewUserPage() {
	const [state, formAction] = useActionState(createUser, {});
	const [isPending, startTransition] = useTransition();
	const [selectedRole, setSelectedRole] = React.useState<string>('');

	const handleSubmit = (formData: FormData) => {
		startTransition(() => {
			formAction(formData);
		});
	};

	const getRoleDescription = (role: string) => {
		switch (role) {
			case 'u1':
				return 'Utilisateur chargé d\'exécuter les missions (Web et Mobile)';
			case 'u2':
				return 'Responsable ayant accès aux missions de mission (Web)';
			case 'u3':
				return 'Responsable de la rédaction du magazine (Web)';
			case 'u4':
				return 'Administrateur du système (Web)';
			default:
				return 'Sélectionnez un rôle pour voir sa description';
		}
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="border-b bg-card/50 backdrop-blur">
				<div className="mx-auto max-w-7xl px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<UserPlus className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-foreground">
									Nouvel utilisateur
								</h1>
								<p className="text-sm text-muted-foreground">
									Créer un nouveau compte utilisateur
								</p>
							</div>
						</div>
						<Button
							type="submit"
							form="user-form"
							disabled={isPending}
							className="gap-2"
						>
							<Save className="h-4 w-4" />
							{isPending
								? 'Création...'
								: 'Créer l\'utilisateur'}
						</Button>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-6 py-8">
				{/* Success Message */}
				{state.success && (
					<div className="mb-8">
						<div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-6 shadow-sm">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
									<CheckCircle className="w-4 h-4 text-white" />
								</div>
								<div>
									<h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
										Utilisateur créé avec succès
									</h3>
									<p className="text-sm text-emerald-700 dark:text-emerald-300">
										{state.message}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				<form id="user-form" action={handleSubmit}>
					<div className="mx-auto max-w-2xl">
						{/* Centered Left Section - User Information */}
						<div className="space-y-6">
							<Card className="border-border/50 shadow-sm">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-lg">
										<User className="h-5 w-5 text-primary" />
										Informations personnelles
									</CardTitle>
									<CardDescription>
										Renseignez les informations de base de l&apos;utilisateur
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Full Name */}
									<div className="space-y-2">
										<Label
											htmlFor="name"
											className="text-sm font-medium text-foreground"
										>
											Nom complet
											<span className="text-destructive ml-1">
												*
											</span>
										</Label>
										<div className="relative">
											<User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
											<Input
												id="name"
												name="name"
												type="text"
												placeholder="ex: Jean Mvé"
												className="pl-10 h-12"
												aria-invalid={
													!!state.errors?.name
												}
											/>
										</div>
										{state.errors?.name && (
											<p className="text-sm text-destructive flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{state.errors.name[0]}
											</p>
										)}
									</div>

									{/* Email */}
									<div className="space-y-2">
										<Label
											htmlFor="email"
											className="text-sm font-medium text-foreground"
										>
											Adresse email
											<span className="text-destructive ml-1">
												*
											</span>
										</Label>
										<div className="relative">
											<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
											<Input
												id="email"
												name="email"
												type="email"
												placeholder="jean.mve@dgmp.ga"
												className="pl-10 h-12"
												aria-invalid={
													!!state.errors?.email
												}
											/>
										</div>
										{state.errors?.email && (
											<p className="text-sm text-destructive flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{state.errors.email[0]}
											</p>
										)}
									</div>

									{/* Role */}
									<div className="space-y-2">
										<Label
											htmlFor="role"
											className="text-sm font-medium text-foreground"
										>
											Rôle dans le système
											<span className="text-destructive ml-1">
												*
											</span>
										</Label>
										<div className="relative">
											<Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
											<Select 
												name="role" 
												onValueChange={setSelectedRole}
											>
												<SelectTrigger className="pl-10 h-12">
													<SelectValue placeholder="Sélectionner un rôle" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="u1">
														<div className="flex items-center gap-2">
															<User className="w-4 h-4 text-blue-600" />
															Agent terrain
														</div>
													</SelectItem>
													<SelectItem value="u2">
														<div className="flex items-center gap-2">
															<Shield className="w-4 h-4 text-purple-600" />
															Responsable
														</div>
													</SelectItem>
													<SelectItem value="u3">
														<div className="flex items-center gap-2">
															<Edit className="w-4 h-4 text-green-600" />
															Rédacteur
														</div>
													</SelectItem>
													<SelectItem value="u4">
														<div className="flex items-center gap-2">
															<Shield className="w-4 h-4 text-red-600" />
															Administrateur
														</div>
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
										{selectedRole && (
											<p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
												{getRoleDescription(selectedRole)}
											</p>
										)}
										{state.errors?.role && (
											<p className="text-sm text-destructive flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{state.errors.role[0]}
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
