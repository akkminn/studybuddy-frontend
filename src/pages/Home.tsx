import type { ComponentType } from "react"
import { BarChart3, FileUp, Sparkles } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type FeatureCard = {
    title: string
    description: string
    icon: ComponentType<{ className?: string }>
}

const featureCards: FeatureCard[] = [
    {
        title: "Upload Document",
        description: "Upload study material in seconds and let AI understand your content instantly.",
        icon: FileUp,
    },
    {
        title: "Generate Questions",
        description: "Create high-quality quizzes tailored to your topic, level, and learning goals.",
        icon: Sparkles,
    },
    {
        title: "Track Performance",
        description: "Monitor your progress with smart analytics and improve weak areas quickly.",
        icon: BarChart3,
    },
]

export default function Home() {
    return (
        <section className="mx-auto w-full max-w-6xl space-y-8">
            <div className="space-y-3 rounded-2xl border bg-card/80 p-8 shadow-sm backdrop-blur-sm transition-colors duration-300">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Welcome to StudyBuddy</h2>
                <p className="text-lg text-muted-foreground">AI-powered quiz generation platform</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {featureCards.map((feature) => (
                    <Card key={feature.title} className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <CardHeader>
                            <div className="mb-3 w-fit rounded-lg bg-primary/10 p-2 text-primary">
                                <feature.icon className="h-5 w-5" />
                            </div>
                            <CardTitle>{feature.title}</CardTitle>
                            <CardDescription>{feature.description}</CardDescription>
                        </CardHeader>
                        <CardContent />
                    </Card>
                ))}
            </div>
        </section>
    )
}