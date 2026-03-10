import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card"
import { FileQuestion } from "lucide-react"

function GenerateQuestion() {
    return (
        <div className="mx-auto w-full max-w-5xl p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileQuestion className="h-5 w-5 text-primary" />
                        Generate Questions
                    </CardTitle>
                    <CardDescription>Create question sets from your uploaded learning materials.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Question generation workflow is ready for integration.</CardContent>
            </Card>
        </div>
    )
}

export default GenerateQuestion