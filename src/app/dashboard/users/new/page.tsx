'use client';

import * as React from 'react';
import { useTransition, useActionState } from 'react';
import { useRouter } from 'next/navigation';
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
	Lock,
	Eye,
	EyeOff,
} from 'lucide-react';
import { createUserAction, type CreateUserFormState } from '@/actions/user/create-user';


export default function NewUserPage() {
	const [state, formAction] = useActionState(createUserAction, {});
	const [isPending, startTransition] = useTransition();
	const [selectedRole, setSelectedRole] = React.useState<string>('');
	const [showPassword, setShowPassword] = React.useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
	const router = useRouter();

	const handleSubmit = (formData: FormData) => {
		startTransition(() => {
			formAction(formData);
		});
	};

	// Redirect on success
	React.useEffect(() => {
		if (state.success) {
			const timer = setTimeout(() => {
				router.push('/dashboard/users');
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [state.success, router]);

	const getRoleDescription = (role: string) => {
		switch (role) {
			case 'u1':
				return 'Utilisateur chargé d\'exécuter les missions (Web et Mobile)';
			case 'u2':
				return 'Responsable ayant accès aux missions de mission (Web)';
			case 'u3':
				return 'Responsable de la rédaction du magazine (Web)';
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
										L'utilisateur {state.user?.name} a été créé avec succès. Redirection en cours...
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Error Message */}
				{state.error && (
					<div className="mb-8">
						<div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-6 shadow-sm">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
									<AlertCircle className="w-4 h-4 text-white" />
								</div>
								<div>
									<h3 className="font-semibold text-red-900 dark:text-red-100">
										Erreur lors de la création
									</h3>
									<p className="text-sm text-red-700 dark:text-red-300">
										{state.error}
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
													!!state.fieldErrors?.name
												}
											/>
										</div>
										{state.fieldErrors?.name && (
											<p className="text-sm text-destructive flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{state.fieldErrors.name[0]}
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
													!!state.fieldErrors?.email
												}
											/>
										</div>
										{state.fieldErrors?.email && (
											<p className="text-sm text-destructive flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{state.fieldErrors.email[0]}
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

									{/* Password */}
									<div className="space-y-2">
										<Label
											htmlFor="password"
											className="text-sm font-medium text-foreground"
										>
											Mot de passe
											<span className="text-destructive ml-1">
												*
											</span>
										</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
											<Input
												id="password"
												name="password"
												type={showPassword ? "text" : "password"}
												placeholder="Minimum 8 caractères"
												className="pl-10 pr-10 h-12"
												aria-invalid={
													!!state.fieldErrors?.password
												}
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() => setShowPassword(!showPassword)}
											>
												{showPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
										{state.fieldErrors?.password && (
											<p className="text-sm text-destructive flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{state.fieldErrors.password[0]}
											</p>
										)}
									</div>

									{/* Confirm Password */}
									<div className="space-y-2">
										<Label
											htmlFor="confirmPassword"
											className="text-sm font-medium text-foreground"
										>
											Confirmer le mot de passe
											<span className="text-destructive ml-1">
												*
											</span>
										</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
											<Input
												id="confirmPassword"
												name="confirmPassword"
												type={showConfirmPassword ? "text" : "password"}
												placeholder="Répétez le mot de passe"
												className="pl-10 pr-10 h-12"
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() => setShowConfirmPassword(!showConfirmPassword)}
											>
												{showConfirmPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
										{state.fieldErrors?.confirmPassword && (
											<p className="text-sm text-destructive flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{state.fieldErrors.confirmPassword[0]}
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
