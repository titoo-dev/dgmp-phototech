import { getAuth } from "@/actions/get-auth";
import { AppBreadcrumb } from "@/components/breadcrumb/app-breadcrumb";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { RolePermissions } from "@/lib/auth-utils";

export default async function ClientLayout({ children }: { children: ReactNode }) {
	const { hasPermission } = await getAuth();

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
		}
	]

	return (
		<SidebarProvider>
			<AppSidebar navigationItems={navigationItems} />
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
