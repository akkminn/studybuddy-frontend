import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type MessageRole = "user" | "assistant"

type ChatMessage = {
    id: number
    role: MessageRole
    content: string
}

const demoMessages: ChatMessage[] = [
    {
        id: 1,
        role: "assistant",
        content: "Hi! I can help you review and practice. What topic are you working on today?",
    },
    {
        id: 2,
        role: "user",
        content: "I want to review cellular respiration and remember the stages quickly.",
    },
    {
        id: 3,
        role: "assistant",
        content: "Great choice. We'll cover glycolysis, the Krebs cycle, and oxidative phosphorylation.",
    },
    {
        id: 4,
        role: "user",
        content: "Can you give me a simple memory trick for ATP production?",
    },
    {
        id: 5,
        role: "assistant",
        content: "Think of ATP increasing as you go deeper into the mitochondria, with the most made at the inner membrane.",
    },
    {
        id: 6,
        role: "user",
        content: "Perfect. Quiz me after the summary.",
    },
]

export default function ChatAgent() {
    return (
        <main className="w-full space-y-6">
            <header className="space-y-1">
                <h1 className="text-2xl font-semibold">Study with AI</h1>
                <p className="text-sm text-muted-foreground">Review topics, ask follow-up questions, and finish with a quick quiz.</p>
            </header>

            <section className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Conversation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            {demoMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${
                                        message.role === "user"
                                            ? "ml-auto bg-primary text-primary-foreground"
                                            : "bg-muted text-foreground"
                                    }`}
                                >
                                    <p className="mb-1 text-xs font-medium uppercase tracking-wide opacity-80">
                                        {message.role === "user" ? "You" : "StudyBuddy"}
                                    </p>
                                    <p>{message.content}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <form className="space-y-3">
                                <div>
                                    <Textarea
                                        placeholder="Ask StudyBuddy anything about your topic..."
                                        className="min-h-[96px] resize-none"
                                    />
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Tip: Ask for a summary, then request a short quiz.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-xs text-muted-foreground">
                                        Press Enter to send • Shift+Enter for a new line
                                    </p>
                                    <Button type="submit">Send</Button>
                                </div>
                            </form>
                        </div>
                    </CardContent>
                </Card>

            </section>
        </main>
    )
}
