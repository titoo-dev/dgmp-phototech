"use client";

import { useState } from "react";
import { BookOpenIcon, CheckCircleIcon, FileTextIcon, ImageIcon, BuildingIcon, UsersIcon, SendIcon, ClipboardCheckIcon, UserPlusIcon, BanIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { UserRole, getRoleDisplayName } from "@/lib/auth-utils";

type UserGuideSheetProps = {
	userRole: UserRole;
};

const roleGuideContent: Record<UserRole, {
	title: string;
	description: string;
	access: { icon: React.ElementType; text: string }[];
	functionalities?: { title: string; steps: string[] }[];
}> = {
	u1: {
		title: "U1 : Agent de terrain",
		description: "Utilisateur chargé d'exécuter les missions",
		access: [
			{ icon: FileTextIcon, text: "Vue des missions créées par l'agent" },
			{ icon: ImageIcon, text: "Vue des galeries d'images importées par l'agent" },
			{ icon: BuildingIcon, text: "Vue de tous les marchés" },
			{ icon: FileTextIcon, text: "Création, modification et suppression de rapports de mission" },
			{ icon: BuildingIcon, text: "Création, modification et suppression de marchés" },
			{ icon: BuildingIcon, text: "Création, modification et suppression d'entreprises" },
		],
		functionalities: [
			{
				title: "4.1 Rédaction d'un rapport de mission",
				steps: [
					"L'utilisateur U1 (Agent de terrain) est chargé de rédiger le rapport de mission.",
					"Il doit remplir les champs suivants :",
					"  Membres de l'équipe : les personnes que l'agent de terrain gère lors de la mission.",
					"  - Pour en ajouter, cliquer sur le bouton Ajouter un membre et sélectionner un contact existant.",
					"  - Pour créer une nouvelle équipe, cliquer sur le bouton Créer un contact.",
					"  Date de début",
					"  Date de fin",
					"  Lieu de la mission",
					"  Marchés contrôlés",
					"Concernant les marchés contrôlés, il est possible d'ajouter plusieurs marchés dans un même rapport de mission.",
					"Pour ajouter un marché, cliquer sur le bouton Ajouter un marché.",
					"Pour chaque marché ajouté, les champs suivants doivent être remplis :",
					"  Marché à contrôler",
					"  Photos du marché : photos prises lors de la mission",
					"  Remarques et observations : commentaires et rédaction du rapport relatif au marché",
				],
			},
			{
				title: "4.2 Envoi d'un rapport de mission",
				steps: [
					"Après sa création, le statut d'un rapport est défini comme Brouillon.",
					"L'utilisateur U1 (Agent de terrain) peut alors le modifier ou le supprimer.",
					"Lorsqu'il clique sur le bouton Envoyer, le statut du rapport passe à En attente, ce qui signifie qu'il est en attente de validation par le Responsable (U2).",
					"À ce stade, le rapport apparaît automatiquement dans l'espace de gestion de l'utilisateur U2.",
				],
			},
		],
	},
	u2: {
		title: "U2 : Responsable",
		description: "Responsable ayant accès aux rapports de mission",
		access: [
			{ icon: FileTextIcon, text: "Vue des missions envoyées par les agents de terrain" },
			{ icon: ImageIcon, text: "Vue de toutes les galeries d'images" },
			{ icon: BuildingIcon, text: "Vue de tous les marchés" },
			{ icon: BuildingIcon, text: "Vue des entreprises" },
			{ icon: BuildingIcon, text: "Création, modification et suppression de marchés" },
			{ icon: BuildingIcon, text: "Création, modification et suppression d'entreprises" },
			{ icon: UsersIcon, text: "Gestion des utilisateurs de type U1 : création d'invitations, blocage" },
		],
		functionalities: [
			{
				title: "4.3 Validation d'une mission",
				steps: [
					"L'utilisateur U2 (Responsable) est chargé d'accepter ou de refuser un rapport de mission.",
					"  Validation : dans le tableau des missions, sur la ligne correspondant à la mission, cliquer sur le bouton Valider.",
					"  Refus : cliquer sur le bouton Refuser et saisir un commentaire de révision.",
					"Après le refus, l'utilisateur U1 (Agent de terrain) reçoit un email contenant le commentaire du responsable.",
				],
			},
			{
				title: "4.4 Gestion des utilisateurs",
				steps: [
					"Les utilisateurs U2 (Responsable) sont chargés de gérer les utilisateurs de la plateforme.",
					"",
					"Création d'un utilisateur :",
					"Dans le menu Utilisateurs :",
					"1. Cliquer sur le bouton Nouvel utilisateur.",
					"2. Remplir les champs suivants :",
					"   Nom complet",
					"   Adresse email",
					"   Rôle dans le système",
					"   Mot de passe",
					"Après la création, l'adresse email ajoutée reçoit un message d'activation permettant à l'utilisateur d'accéder à son compte.",
					"",
					"Remarque : il n'existe pas de formulaire d'inscription libre sur la plateforme. L'accès est uniquement accordé par un Administrateur ou un Responsable.",
					"",
					"Bannir un utilisateur :",
					"1. Repérer la ligne correspondant à l'utilisateur concerné dans la liste.",
					"2. Cliquer sur les trois points à droite.",
					"3. Sélectionner l'option Bannir.",
					"Après cette action, l'utilisateur banni ne pourra plus accéder à la plateforme.",
				],
			},
		],
	},
	u3: {
		title: "U3 : Rédacteur",
		description: "Responsable de la rédaction du magazine",
		access: [
			{ icon: FileTextIcon, text: "Vue des missions validées par le Responsable" },
			{ icon: ImageIcon, text: "Vue des galeries d'images liées aux missions validées par le Responsable" },
		],
		functionalities: [
			{
				title: "Utilisation de la plateforme",
				steps: [
					"En tant que Rédacteur, vous avez accès uniquement aux missions qui ont été validées par le Responsable (U2).",
					"Cela vous permet de consulter les rapports finalisés et d'extraire les contenus (photos, descriptions) pour alimenter le magazine hebdomadaire de la DGMP.",
					"Vous pouvez naviguer dans la galerie pour voir toutes les images associées aux missions validées.",
				],
			},
		],
	},
	u4: {
		title: "U4 : Administrateur",
		description: "Administrateur du système",
		access: [
			{ icon: FileTextIcon, text: "Vue de toutes les missions" },
			{ icon: ImageIcon, text: "Vue de toutes les galeries d'images" },
			{ icon: BuildingIcon, text: "Vue de tous les marchés" },
			{ icon: BuildingIcon, text: "Vue des entreprises" },
			{ icon: FileTextIcon, text: "Création de rapports de mission" },
			{ icon: BuildingIcon, text: "Création, modification et suppression de marchés" },
			{ icon: BuildingIcon, text: "Création, modification et suppression d'entreprises" },
			{ icon: UsersIcon, text: "Gestion des utilisateurs (U1, U2, U3)" },
		],
		functionalities: [
			{
				title: "4.4 Gestion des utilisateurs",
				steps: [
					"L'utilisateur U4 (Administrateur) est chargé de gérer tous les utilisateurs de la plateforme.",
					"",
					"Création d'un utilisateur :",
					"Dans le menu Utilisateurs :",
					"1. Cliquer sur le bouton Nouvel utilisateur.",
					"2. Remplir les champs suivants :",
					"   Nom complet",
					"   Adresse email",
					"   Rôle dans le système",
					"   Mot de passe",
					"Après la création, l'adresse email ajoutée reçoit un message d'activation permettant à l'utilisateur d'accéder à son compte.",
					"",
					"Remarque : il n'existe pas de formulaire d'inscription libre sur la plateforme. L'accès est uniquement accordé par un Administrateur ou un Responsable.",
					"",
					"Bannir un utilisateur :",
					"1. Repérer la ligne correspondant à l'utilisateur concerné dans la liste.",
					"2. Cliquer sur les trois points à droite.",
					"3. Sélectionner l'option Bannir.",
					"Après cette action, l'utilisateur banni ne pourra plus accéder à la plateforme.",
				],
			},
		],
	},
	u5: {
		title: "U5 : Super Administrateur",
		description: "Super administrateur du système",
		access: [
			{ icon: BuildingIcon, text: "Gestion de toutes les organisations" },
			{ icon: UsersIcon, text: "Accès global au système" },
		],
		functionalities: [
			{
				title: "Gestion des organisations",
				steps: [
					"En tant que Super Administrateur, vous avez accès à la gestion de toutes les organisations.",
					"Vous pouvez créer, modifier et supprimer des organisations.",
				],
			},
		],
	},
};

export function UserGuideSheet({ userRole }: UserGuideSheetProps) {
	const [open, setOpen] = useState(false);
	const guide = roleGuideContent[userRole];

	if (!guide) return null;

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="size-8" aria-label="Guide d'utilisation">
					<BookOpenIcon className="size-4" />
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-full sm:max-w-lg">
				<SheetHeader className="text-left shadow">
					<div className="flex items-center gap-2">
						<SheetTitle>Fiche Technique</SheetTitle>
						<Badge variant="secondary">{getRoleDisplayName(userRole)}</Badge>
					</div>
					<SheetDescription>
						Guide d'utilisation de la plateforme Photothèque DGMP
					</SheetDescription>
				</SheetHeader>

				<ScrollArea className="h-[calc(100vh-140px)] pr-4">
					<div className="space-y-8 py-2 px-4 pb-8">
						{/* Objectifs */}
						<section className="space-y-4">
							<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
								Objectifs de la plateforme
							</h3>
							<ul className="space-y-3 text-sm">
								<li className="flex gap-3">
									<CheckCircleIcon className="size-4 text-primary mt-0.5 shrink-0" />
									<span>
										<strong className="font-semibold">Centralisation des données :</strong> Créer une plateforme intranet sécurisée, accessible via le web et une application mobile, pour gérer les photos et les informations des missions de contrôle de chantier.
									</span>
								</li>
								<li className="flex gap-3">
									<CheckCircleIcon className="size-4 text-primary mt-0.5 shrink-0" />
									<span>
										<strong className="font-semibold">Capitalisation des résultats :</strong> Structurer une base de données pour stocker les informations des missions (nom, ville, lieu, projet, durée, entreprise, description, remarques, observations, photos).
									</span>
								</li>
								<li className="flex gap-3">
									<CheckCircleIcon className="size-4 text-primary mt-0.5 shrink-0" />
									<span>
										<strong className="font-semibold">Accessibilité et sécurité :</strong> Assurer un accès sécurisé pour les utilisateurs autorisés (agents, administrateurs, rédacteurs du magazine).
									</span>
								</li>
								<li className="flex gap-3">
									<CheckCircleIcon className="size-4 text-primary mt-0.5 shrink-0" />
									<span>
										<strong className="font-semibold">Publication :</strong> Faciliter l'extraction de contenus (photos, descriptions) pour alimenter le magazine hebdomadaire de la DGMP.
									</span>
								</li>
								<li className="flex gap-3">
									<CheckCircleIcon className="size-4 text-primary mt-0.5 shrink-0" />
									<span>
										<strong className="font-semibold">Ergonomie et mobilité :</strong> Offrir une interface intuitive, disponible sur navigateur web et application mobile, pour une utilisation sur le terrain et au bureau.
									</span>
								</li>
							</ul>
						</section>

						<Separator />

						{/* Rôle et Description */}
						<section className="space-y-4">
							<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
								Votre Rôle
							</h3>
							<div className="rounded-lg border bg-card p-5">
								<h4 className="font-semibold text-base">{guide.title}</h4>
								<p className="text-sm text-muted-foreground mt-2">{guide.description}</p>
							</div>
						</section>

						<Separator />

						{/* Accès et Permissions */}
						<section className="space-y-4">
							<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
								Rôles et Accès
							</h3>
							<ul className="space-y-3">
								{guide.access.map((item, index) => {
									const Icon = item.icon;
									return (
										<li key={index} className="flex items-start gap-3 text-sm">
											<div className="rounded-md bg-primary/10 p-2">
												<Icon className="size-4 text-primary" />
											</div>
											<span className="pt-1">{item.text}</span>
										</li>
									);
								})}
							</ul>
						</section>

						{/* Fonctionnalités */}
						{guide.functionalities && guide.functionalities.length > 0 && (
							<>
								<Separator />
								<section className="space-y-4">
									<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
										Fonctionnalités
									</h3>
									<div className="space-y-5">
										{guide.functionalities.map((func, funcIndex) => (
											<div key={funcIndex} className="rounded-lg border bg-card p-5">
												<h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
													<ClipboardCheckIcon className="size-4 text-primary" />
													{func.title}
												</h4>
												<div className="space-y-2">
													{func.steps.map((step, stepIndex) => {
														// Empty line for spacing
														if (step === "") {
															return <div key={stepIndex} className="h-3" />;
														}
														
														// Detect if it's a numbered list item (starts with number)
														const isNumberedItem = /^\d+\./.test(step);
														
														// Detect if it's a bullet point (starts with •)
														const isBulletPoint = step.trim().startsWith("•");
														
														// Detect if it's an indented sub-item (starts with spaces)
														const isSubItem = step.startsWith("   ") || step.startsWith("  ");
														
														// Main section headers (not indented, not numbered, not bullet)
														const isSectionHeader = !isNumberedItem && !isBulletPoint && !isSubItem && !step.includes(":") && step.trim().length > 0;
														
														if (isNumberedItem || isBulletPoint) {
															return (
																<div key={stepIndex} className="flex gap-2 text-sm">
																	<span className="text-primary shrink-0">•</span>
																	<span className="text-muted-foreground">{step.replace(/^\d+\.\s*/, "").replace(/^•\s*/, "")}</span>
																</div>
															);
														}
														
														if (isSubItem) {
															return (
																<div key={stepIndex} className="flex gap-2 text-sm pl-4">
																	<span className="text-primary/70 shrink-0">◦</span>
																	<span className="text-muted-foreground">{step.trim()}</span>
																</div>
															);
														}
														
														if (isSectionHeader) {
															return (
																<p key={stepIndex} className="text-sm font-medium mt-3 first:mt-0">
																	{step}
																</p>
															);
														}
														
														return (
															<p key={stepIndex} className="text-sm text-muted-foreground">
																{step}
															</p>
														);
													})}
												</div>
											</div>
										))}
									</div>
								</section>
							</>
						)}
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}

