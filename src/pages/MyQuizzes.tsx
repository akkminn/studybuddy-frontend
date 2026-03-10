import { BookOpenCheck } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MyQuizzes() {
    return (
        <main className="w-full space-y-6">
            <header className="space-y-1">
                <h1 className="flex items-center gap-2 text-2xl font-semibold">
                    <BookOpenCheck className="h-5 w-5 text-primary" />
                    My Quizzes
                </h1>
                <p className="text-sm text-muted-foreground">
                    View and manage your generated quizzes.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Coming soon</CardTitle>
                    <CardDescription>
                        Quiz management is on the way.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    We&apos;ll add filtering, progress tracking, and sharing options here.
                </CardContent>
            </Card>
        </main>
    )
}
