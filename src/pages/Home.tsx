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
        title: "Create Mind Map",
        description: "Turn your study materials into connected visual concepts for faster understanding.",
        icon: BrainCircuit,
    },
    {
        title: "Create Flash Card",
        description: "Generate smart flash cards from notes and revise effectively with spaced repetition.",
        icon: Layers3,
    },
    {
        title: "Generate Questions",
        description: "Build quiz questions instantly with AI assistance tailored to your learning goals.",
        icon: FileQuestion,
    },
]

export default function Home() {
    return (
        <section className="mx-auto w-full max-w-6xl space-y-8">
            <div className="rounded-2xl border bg-card/70 p-8 shadow-sm backdrop-blur-sm transition-all duration-300">
                <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Welcome to StudyBuddy</h2>
                <p className="mt-3 text-lg text-muted-foreground">AI-powered quiz generation platform</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
            </div>
        </section>
    )
}