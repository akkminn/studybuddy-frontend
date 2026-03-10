import { Settings2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Settings() {
    return (
        <div className="mx-auto w-full max-w-5xl p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5 text-primary" />
                        Settings
                    </CardTitle>
                    <CardDescription>Update your account and application preferences.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Settings controls are coming soon.</CardContent>
            </Card>
        </div>
    )
}