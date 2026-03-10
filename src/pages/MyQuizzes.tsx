import { BookOpenCheck } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MyQuizzes() {
    return (
        <div className="mx-auto w-full max-w-5xl p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpenCheck className="h-5 w-5 text-primary" />
                        My Quizzes
                    </CardTitle>
                    <CardDescription>View and manage your generated quizzes.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Quiz management features are coming soon.</CardContent>
            </Card>
        </div>
    )
}