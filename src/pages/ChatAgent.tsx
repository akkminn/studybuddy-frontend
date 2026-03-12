import type { AxiosError } from "axios"
import { type FormEvent, type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import ChatService from "@/services/chatService"
import type { ChatMessageCreateRequest, ChatMessageResponse } from "@/types/type.ts"

const initialSessionTitle = "Study with AI"
const initialMessageLimit = 50
const sessionStorageKeyPrefix = "chat_session_id"

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
    const tokenParts = token.split(".")
    if (tokenParts.length < 2) {
        return null
    }

    try {
        const base64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/")
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")
        const decoded = atob(padded)
        return JSON.parse(decoded) as Record<string, unknown>
    } catch {
        return null
    }
}

const getSessionStorageKey = (): string => {
    const token = localStorage.getItem("access_token")

    if (!token) {
        return `${sessionStorageKeyPrefix}:anonymous`
    }

    const payload = decodeJwtPayload(token)
    const userScope =
        (typeof payload?.sub === "string" && payload.sub) ||
        (typeof payload?.user_id === "string" && payload.user_id) ||
        (typeof payload?.email === "string" && payload.email) ||
        token

    return `${sessionStorageKeyPrefix}:${userScope}`
}

const isNotFoundError = (error: unknown): boolean => {
    const status = (error as AxiosError | undefined)?.response?.status
    return status === 404
}

export default function ChatAgent() {
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
    const [messages, setMessages] = useState<ChatMessageResponse[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isSending, setIsSending] = useState(false)
    const [isBootstrapping, setIsBootstrapping] = useState(true)
    const [inlineError, setInlineError] = useState<string | null>(null)
    const sendInFlightRef = useRef(false)

    const createAndPersistSession = useCallback(async () => {
        const session = await ChatService.createSession({ title: initialSessionTitle })
        const sessionStorageKey = getSessionStorageKey()
        localStorage.setItem(sessionStorageKey, session.id)
        setActiveSessionId(session.id)
        return session.id
    }, [])

    const recoverSessionFrom404 = useCallback(async () => {
        const sessionStorageKey = getSessionStorageKey()
        localStorage.removeItem(sessionStorageKey)
        localStorage.removeItem(sessionStorageKeyPrefix)
        setActiveSessionId(null)
        setMessages([])
        return createAndPersistSession()
    }, [createAndPersistSession])

    const bootstrapConversation = useCallback(async () => {
        try {
            setIsBootstrapping(true)
            setInlineError(null)
            const sessionStorageKey = getSessionStorageKey()
            const storedSessionId = localStorage.getItem(sessionStorageKey)

            if (!storedSessionId) {
                setActiveSessionId(null)
                setMessages([])
                return
            }

            setActiveSessionId(storedSessionId)

            try {
                const messageResponse = await ChatService.listSessionMessages(storedSessionId, {
                    limit: initialMessageLimit,
                })
                setMessages(messageResponse.messages)
            } catch (error) {
                if (isNotFoundError(error)) {
                    const newSessionId = await recoverSessionFrom404()

                    try {
                        const retryMessageResponse = await ChatService.listSessionMessages(newSessionId, {
                            limit: initialMessageLimit,
                        })
                        setMessages(retryMessageResponse.messages)
                    } catch {
                        setMessages([])
                        setInlineError("Your chat is ready, but we couldn't load previous messages.")
                    }

                    return
                }

                setMessages([])
                setInlineError("Your chat is ready, but we couldn't load previous messages.")
            }
        } catch {
            setActiveSessionId(null)
            setMessages([])
            setInlineError("We couldn't start your chat right now. Please retry.")
        } finally {
            setIsBootstrapping(false)
        }
    }, [recoverSessionFrom404])

    useEffect(() => {
        void bootstrapConversation()
    }, [bootstrapConversation])

    const handleSend = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const trimmedInput = inputValue.trim()
        if (!trimmedInput || isSending || isBootstrapping || sendInFlightRef.current) {
            return
        }

        try {
            sendInFlightRef.current = true
            setIsSending(true)
            setInlineError(null)

            let sessionId = activeSessionId
            if (!sessionId) {
                sessionId = await createAndPersistSession()
            }
            if (!sessionId) {
                throw new Error("Session is unavailable")
            }

            const payload: ChatMessageCreateRequest = { content: trimmedInput }
            let nextMessage: ChatMessageResponse

            try {
                nextMessage = await ChatService.sendSessionMessage(sessionId, payload)
            } catch (error) {
                if (!isNotFoundError(error)) {
                    throw error
                }

                const recoveredSessionId = await recoverSessionFrom404()
                nextMessage = await ChatService.sendSessionMessage(recoveredSessionId, payload)
            }

            setMessages((currentMessages) => {
                if (currentMessages.some((message) => message.id === nextMessage.id)) {
                    return currentMessages
                }
                return [...currentMessages, nextMessage]
            })
            setInputValue("")
        } catch {
            setInlineError("Message failed to send. Please try again.")
        } finally {
            sendInFlightRef.current = false
            setIsSending(false)
        }
    }

    const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key !== "Enter" || event.shiftKey) {
            return
        }

        event.preventDefault()

        if (!inputValue.trim() || isBootstrapping || isSending || sendInFlightRef.current) {
            return
        }

        event.currentTarget.form?.requestSubmit()
    }

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
                            {messages.length === 0 ? (
                                <p className="rounded-lg border border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground">
                                    {isBootstrapping
                                        ? "Loading your conversation..."
                                        : "Your conversation will appear here once you send a message."}
                                </p>
                            ) : null}

                            {messages.map((message) => (
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
                                    {message.role === "assistant" && message.sources && message.sources.length > 0 ? (
                                        <details className="mt-2 rounded-md border border-border/60 bg-background/70 p-2">
                                            <summary className="cursor-pointer text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Sources ({message.sources.length})
                                            </summary>
                                            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                                                {message.sources.map((source, index) => (
                                                    <li key={`${message.id}-source-${index}`} className="space-y-1">
                                                        <p className="font-medium text-foreground">{source.subject}</p>
                                                        {source.topic_path.length > 0 ? (
                                                            <p className="break-words">{source.topic_path.join(" > ")}</p>
                                                        ) : null}
                                                        <p className="break-words">{source.content}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    ) : null}
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            {inlineError ? (
                                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    <p>{inlineError}</p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            void bootstrapConversation()
                                        }}
                                        disabled={isBootstrapping || isSending}
                                    >
                                        {isBootstrapping ? "Retrying..." : "Retry"}
                                    </Button>
                                </div>
                            ) : null}

                            <form className="space-y-3" onSubmit={handleSend}>
                                <div>
                                    <Textarea
                                        placeholder="Ask StudyBuddy anything about your topic..."
                                        className="min-h-[96px] resize-none"
                                        value={inputValue}
                                        onChange={(event) => setInputValue(event.target.value)}
                                        onKeyDown={handleComposerKeyDown}
                                        disabled={isBootstrapping || isSending}
                                    />
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Tip: Ask for a summary, then request a short quiz.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-xs text-muted-foreground">
                                        Press Enter to send • Shift+Enter for a new line
                                    </p>
                                    <Button
                                        type="submit"
                                        disabled={isBootstrapping || isSending || !inputValue.trim()}
                                    >
                                        {isSending ? "Sending..." : "Send"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </CardContent>
                </Card>

            </section>
        </main>
    )
}
