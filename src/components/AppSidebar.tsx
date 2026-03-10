import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail,
} from "@/components/ui/sidebar"
import {FileQuestion, LayoutDashboard, LibraryBig, LogOut, Settings, Sparkles} from "lucide-react"
import {Link, useLocation, useNavigate} from "react-router-dom"
import {useMemo} from "react";
import AuthService from "@/services/authService";

const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { title: "Generate Questions", icon: FileQuestion, href: "/generate-questions" },
    { title: "My Quizzes", icon: LibraryBig, href: "/my-quizzes" },
    { title: "Settings", icon: Settings, href: "/settings" },
] as const

export function AppSidebar() {
    const location = useLocation()
    const navigate = useNavigate()

    const activePath = useMemo(() => location.pathname, [location.pathname])

    const handleLogout = async () => {
        try {
            await AuthService.logout()
        } catch {
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
        }

        navigate("/login", { replace: true })
    }

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="p-3">
                <Link to="/" className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-sidebar-accent">
                    <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                        <Sparkles className="size-4" />
                    </div>
                    <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="text-xs text-sidebar-foreground/70">Workspace</span>
                        <span className="text-sm font-semibold">StudyBuddy</span>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={activePath === item.href} tooltip={item.title}>
                                        <Link to={item.href} className="transition-colors duration-200">
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                            <LogOut className="size-4" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
