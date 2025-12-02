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
import { Building, Building2, Camera, FolderOpen, Home, LogOut, Users, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { UserInfo } from "./user-info";
import { AuthUser, UserRole } from "@/lib/auth-utils";

interface NavigationItem {
  title: string;
  url: string;
}

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

interface Organization {
  id: string;
  name: string;
  logo: string | null;
}

const navigationIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "/dashboard": Home,
  "/dashboard/gallery": Camera,
  "/dashboard/missions": FolderOpen,
  "/dashboard/projects": Building2,
  "/dashboard/companies": Building,
  "/dashboard/users": Users,
  "/dashboard/organizations": Building2,
  "/dashboard/profile": User,
};

export function AppSidebar({ 
  navigationItems, 
  user, 
  userRole,
  organization,
  ...props 
}: React.ComponentProps<typeof Sidebar> & { 
  navigationItems: NavigationGroup[];
  user: AuthUser | null;
  userRole: UserRole;
  organization: Organization | null;
}) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const router = useRouter();

  console.log("ORGANIZATION", organization);
  
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
            <div className="flex items-center gap-3 p-1.5 mb-3">
              {userRole === "u5" ? (
                <>
                  <Building2 className="size-8 shrink-0" />
                  <span className="text-lg font-semibold">
                    MarketScan
                  </span>
                </>
              ) : organization ? (
                <>
                  {organization.logo ? (
                    <div className="relative size-8 shrink-0 rounded-full overflow-hidden">
                      <Image 
                        src={organization.logo} 
                        alt={organization.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <Building2 className="size-8 shrink-0" />
                  )}
                  <span className="text-lg font-semibold">
                    {organization.name}
                  </span>
                </>
              ) : (
                <>
                  <Building2 className="size-8 shrink-0" />
                  <span className="text-lg font-semibold">
                    MarketScan
                  </span>
                </>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
        <UserInfo user={user} userRole={userRole} />
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = navigationIcons[item.url]
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.url}>
                        <Link href={item.url} className="flex items-center gap-2">
                          {Icon && <Icon className="size-4" />}
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
              <Button
                onClick={handleSignOut}
                disabled={isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isPending ? "Déconnexion..." : "Déconnexion"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
