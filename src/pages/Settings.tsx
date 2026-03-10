import { Settings2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Settings() {
    return (
        <main className="w-full space-y-6">
            <header className="space-y-1">
                <h1 className="flex items-center gap-2 text-2xl font-semibold">
                    <Settings2 className="h-5 w-5 text-primary" />
                    Settings
                </h1>
                <p className="text-sm text-muted-foreground">
                    Update your account and application preferences.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Coming soon</CardTitle>
                    <CardDescription>Settings are on the way.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    We&apos;ll add profile, security, and notification controls here.
                </CardContent>
            </Card>
        </main>
    )
}
