import { getAuth } from "@/actions/get-auth";
import { AppBreadcrumb } from "@/components/breadcrumb/app-breadcrumb";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { RolePermissions } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { verifyOrganization } from "@/lib/auth-guard";

export default async function ClientLayout({ children }: { children: ReactNode }) {
	const { hasPermission, user, userRole } = await getAuth();
	const { activeOrganizationId } = await verifyOrganization();

	let organization = null;
	if (activeOrganizationId && userRole !== "u5") {
		organization = await prisma.organization.findUnique({
			where: { id: activeOrganizationId },
			select: {
				id: true,
				name: true,
				logo: true,
			},
		});
	}

	const navigationItems = [
		{
			title: "Menu",
			items: [
				{
					title: "Accueil",
					url: "/dashboard",
					permission: "canViewDashboard",
				},
				{
					title: "Galerie",
					url: "/dashboard/gallery",
					permission: "canViewGallery",
				},
				{
					title: "Missions",
					url: "/dashboard/missions",
					permission: "canViewMissions",
				},
				{
					title: "Marchés",
					url: "/dashboard/projects",
					permission: "canViewProjects",
				},
				{
					title: "Entreprises",
					url: "/dashboard/companies",
					permission: "canViewCompanies",
				},
				{
					title: "Utilisateurs",
					url: "/dashboard/users",
					permission: "canManageUsers",
				},
				{
					title: "Organisations",
					url: "/dashboard/organizations",
					permission: "canManageOrganizations",
				},
			].filter((item) => hasPermission(item.permission as keyof RolePermissions)),
		},
		{
			title: "Compte",
			items: [
				{
					title: "Mon Profil",
					url: "/dashboard/profile",
					permission: null, // Tous les utilisateurs peuvent accéder à leur profil
				},
			],
		},
	]

	return (
		<SidebarProvider>
			<AppSidebar 
				navigationItems={navigationItems} 
				user={user} 
				userRole={userRole}
				organization={organization}
			/>
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />

					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>

					<AppBreadcrumb showHome={false} />
				</header>
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
