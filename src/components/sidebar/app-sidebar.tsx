"use client";


import { useTransition } from "react";
import { signOutAction } from "@/actions/sign-out";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Building2, Home, Camera, FolderOpen, Building, Users, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";

const getNavigationItems = (hasPermission: (permission: any) => boolean) => [
  {
    title: "Menu",
    items: [
      {
        title: "Accueil",
        url: "/dashboard",
        icon: Home,
        permission: "canViewDashboard",
      },
      {
        title: "Galerie",
        url: "/dashboard/gallery",
        icon: Camera,
        permission: "canViewGallery",
      },
      {
        title: "Missions",
        url: "/dashboard/missions",
        icon: FolderOpen,
        permission: "canViewMissions",
      },
      {
        title: "Marchés",
        url: "/dashboard/projects",
        icon: Building2,
        permission: "canViewProjects",
      },
      {
        title: "Entreprises",
        url: "/dashboard/companies",
        icon: Building,
        permission: "canViewCompanies",
      },
      {
        title: "Utilisateurs",
        url: "/dashboard/users",
        icon: Users,
        permission: "canManageUsers",
      },
    ].filter((item) => hasPermission(item.permission)),
  }
]


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { hasPermission } = useAuth()
  const navigationItems = getNavigationItems(hasPermission)
  const [isPending, startTransition] = useTransition()
  const router = useRouter();
  
  const handleSignOut = () => {
    startTransition(async () => {
      const result = await signOutAction()
      if (result.success) {
        router.push('/')
      }
    })
  }
  
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 p-1.5">
              <Building2 className="size-5" />
              <span className="text-base font-semibold">Phototech</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.url}>
                        <Link href={item.url} className="flex items-center gap-2">
                          <Icon className="size-4" />
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2" disabled={isPending}>
              <LogOut className="size-4" />
              Déconnexion
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Déconnexion</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir vous déconnecter ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleSignOut}
                disabled={isPending}
              >
                {isPending ? "Déconnexion..." : "Déconnexion"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
