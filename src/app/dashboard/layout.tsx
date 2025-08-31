import { AppBreadcrumb } from "@/components/breadcrumb/app-breadcrumb";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
    return (
		<SidebarProvider>
			<AppSidebar />
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
  