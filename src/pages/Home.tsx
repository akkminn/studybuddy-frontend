import type { ComponentType } from "react"
import {BrainCircuit, FileQuestion, Layers3} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type FeatureCard = {
    title: string
    description: string
    icon: ComponentType<{ className?: string }>
}

const featureCards: FeatureCard[] = [
    {
        title: "Create mind maps",
        description: "Turn study materials into connected visual concepts for faster recall.",
        icon: BrainCircuit,
    },
    {
        title: "Create flashcards",
        description: "Generate flashcards from your notes and review with spaced repetition.",
        icon: Layers3,
    },
    {
        title: "Generate quiz questions",
        description: "Build questions instantly with AI tailored to your learning goals.",
        icon: FileQuestion,
    },
]

export default function Home() {
    return (
        <main className="w-full space-y-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    Welcome to StudyBuddy
                </h1>
                <p className="text-sm text-muted-foreground md:text-base">
                    Turn notes into quizzes, flashcards, and maps in minutes.
                </p>
            </header>

            <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {featureCards.map((feature) => (
                    <Card key={feature.title} className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        <CardHeader>
                            <div className="mb-3 w-fit rounded-lg bg-primary/10 p-2 text-primary transition-transform duration-300 group-hover:scale-110">
                                <feature.icon className="h-5 w-5" />
                            </div>
                            <CardTitle>{feature.title}</CardTitle>
                            <CardDescription>{feature.description}</CardDescription>
                        </CardHeader>
                        <CardContent />
                    </Card>
                ))}
            </section>
        </main>
    )
}
