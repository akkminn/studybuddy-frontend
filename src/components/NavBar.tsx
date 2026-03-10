import {Menu} from "lucide-react"

import {ModeToggle} from "@/components/ModeToggle.tsx"
import {Button} from "@/components/ui/button"
import type {ReactNode} from "react";
import {useSidebar} from "@/components/ui/sidebar.tsx";

type NavbarProps = {
    leftSlot?: ReactNode
}

export default function Navbar({ leftSlot }: NavbarProps) {
    const { toggleSidebar } = useSidebar()

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md transition-colors duration-300 md:px-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden" aria-label="Open sidebar">
                    <Menu className="h-5 w-5" />
                </Button>
                {leftSlot}
                <div>
                    <p className="text-sm text-muted-foreground">Workspace</p>
                    <h1 className="text-base font-semibold">StudyBuddy</h1>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <ModeToggle />
            </div>
        </header>
    )
}