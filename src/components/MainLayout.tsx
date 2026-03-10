import { Outlet } from "react-router-dom"

import { AppSidebar } from "@/components/AppSidebar"
import Navbar from "@/components/NavBar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function MainLayout() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-muted/20 transition-colors duration-300">
                <AppSidebar />
                <SidebarInset className="min-w-0">
                    <Navbar leftSlot={<SidebarTrigger className="hidden md:inline-flex" />} />
                    <div className="flex-1 min-w-0 px-4 pb-6 pt-4 md:px-6 md:pt-6">
                        <Outlet />
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}
