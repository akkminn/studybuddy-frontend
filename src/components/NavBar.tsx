import {Menu} from "lucide-react"

import {ModeToggle} from "@/components/ModeToggle.tsx"
import {Button} from "@/components/ui/button"

type NavbarProps = {
    onOpenSidebar: () => void
}

export default function Navbar({onOpenSidebar}: NavbarProps) {
    return (
        <header
            className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur-md md:px-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={onOpenSidebar} className="md:hidden"
                        aria-label="Open sidebar">
                    <Menu className="h-5 w-5"/>
                </Button>
                <div>
                    <p className="text-sm text-muted-foreground">Workspace</p>
                    <h1 className="text-base font-semibold">StudyBuddy</h1>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <ModeToggle/>
            </div>
        </header>
    )
}