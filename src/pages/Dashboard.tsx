import { useEffect, useState } from "react"
import type { AxiosError } from "axios"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import AuthService from "@/services/authService"
import type { DashboardResponse, UserRole } from "@/types/type.ts"

function getApiError(error: unknown) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>
    return axiosError.response?.data?.detail ?? axiosError.response?.data?.message ?? "Something went wrong"
}

export default function Dashboard() {
    const [role, setRole] = useState<UserRole | null>(null)
    const [email, setEmail] = useState("")
    const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const user = await AuthService.getCurrentUser()
                const userRole = user.role

                if (!userRole) {
                    throw new Error("No role assigned to this user")
                }

                setRole(userRole)
                setEmail(user.email)

                const dashboardResponse =
                    userRole === "admin"
                        ? await AuthService.getAdminDashboard()
                            : await AuthService.getStudentDashboard()

                setDashboard(dashboardResponse)
            } catch (err) {
                setError(getApiError(err))
            } finally {
                setIsLoading(false)
            }
        }

        void loadDashboard()
    }, [])

    return (
        <main className="w-full space-y-6">
            <header className="space-y-1">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Signed in as {email || "-"}</p>
            </header>

            {isLoading ? (
                <Card>
                    <CardContent className="flex items-center gap-2 py-6">
                        <Spinner className="h-5 w-5" />
                        <p>Loading your dashboard...</p>
                    </CardContent>
                </Card>
            ) : null}

            {error ? (
                <Alert variant="destructive">
                    <AlertTitle>We couldn&apos;t load your dashboard</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : null}

            {!isLoading && !error && dashboard ? (
                <section className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your role</CardTitle>
                            <CardDescription>Used to personalize your experience</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="capitalize">{role}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>System message</CardTitle>
                            <CardDescription>From your {role} endpoint</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>{dashboard.message}</p>
                        </CardContent>
                    </Card>
                </section>
            ) : null}
        </main>
    )
}
