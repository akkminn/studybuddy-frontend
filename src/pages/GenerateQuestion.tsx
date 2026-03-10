import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card"
import { FileQuestion } from "lucide-react"

function GenerateQuestion() {
    return (
        <main className="w-full space-y-6">
            <header className="space-y-1">
                <h1 className="flex items-center gap-2 text-2xl font-semibold">
                    <FileQuestion className="h-5 w-5 text-primary" />
                    Generate Questions
                </h1>
                <p className="text-sm text-muted-foreground">
                    Create question sets from your uploaded materials.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Coming soon</CardTitle>
                    <CardDescription>
                        Question generation is almost ready.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    You&apos;ll be able to choose question types, difficulty, and quiz length.
                </CardContent>
            </Card>
        </main>
    )
}

export default GenerateQuestion
