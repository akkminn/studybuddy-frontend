import { useEffect, useState } from "react"
import type { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import AuthService from "@/services/authService"
import type { DashboardResponse, UserRole } from "@/types/type.ts"

function getApiError(error: unknown) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>
    return axiosError.response?.data?.detail ?? axiosError.response?.data?.message ?? "Request failed"
}

export default function Dashboard() {
    const navigate = useNavigate()
    const [role, setRole] = useState<UserRole | null>(null)
    const [email, setEmail] = useState("")
    const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

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

    const onLogout = async () => {
        try {
            setIsLoggingOut(true)
            await AuthService.logout()
        } catch {
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
        } finally {
            navigate("/login", { replace: true })
        }
    }

    return (
        <main className="mx-auto min-h-screen w-full max-w-5xl p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">Signed in as {email || "-"}</p>
                </div>
                <Button variant="outline" onClick={onLogout} disabled={isLoggingOut}>
                    {isLoggingOut ? <Spinner /> : null}
                    {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
            </div>

            {isLoading ? (
                <Card>
                    <CardContent className="flex items-center gap-2 py-8">
                        <Spinner className="h-5 w-5" />
                        <p>Loading dashboard...</p>
                    </CardContent>
                </Card>
            ) : null}

            {error ? (
                <Alert variant="destructive" className="mb-6">
                    <AlertTitle>Could not load dashboard</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : null}

            {!isLoading && !error && dashboard ? (
                <section className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>User role</CardTitle>
                            <CardDescription>Role-based dashboard detection</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="capitalize">{role}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Backend message</CardTitle>
                            <CardDescription>Response from your {role} endpoint</CardDescription>
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