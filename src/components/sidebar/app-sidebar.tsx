"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Building2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const data = {
  navMain: [
    {
      title: "Menu",
      items: [
        {
          title: "Accueil",
          url: "/",
        },
        {
          title: "Missions",
          url: "/missions",
        },
        {
          title: "Marchés",
          url: "/projects",
        },
        {
          title: "Entreprises",
          url: "/companies",
        },
        {
          title: "Utilisateurs",
          url: "/users",
        },
        {
          title: "Galerie",
          url: "/gallery",
        },
      ],
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
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
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.url === pathname}>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
