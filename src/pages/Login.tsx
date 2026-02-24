import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, Navigate, useNavigate } from "react-router-dom"
import type { AxiosError } from "axios"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import AuthService from "@/services/authService"
import { loginSchema, type LoginSchema } from "@/schemas/authSchemas"

function getApiError(error: unknown) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>
    return axiosError.response?.data?.detail ?? axiosError.response?.data?.message ?? "Login failed"
}

export default function Login() {
    const navigate = useNavigate()
    const [apiError, setApiError] = useState<string | null>(null)
    const hasToken = Boolean(localStorage.getItem("access_token"))

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = form.handleSubmit(async (values: LoginSchema) => {
        try {
            setApiError(null)
            await AuthService.login(values)
            navigate("/dashboard", { replace: true })
        } catch (error) {
            setApiError(getApiError(error))
        }
    })

    if (hasToken) {
        return <Navigate to="/dashboard" replace />
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription>Login to continue using StudyBuddy.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        {apiError && (
                            <Alert variant="destructive">
                                <AlertTitle>Unable to login</AlertTitle>
                                <AlertDescription>{apiError}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
                            {form.formState.errors.email && (
                                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                {...form.register("password")}
                            />
                            {form.formState.errors.password && (
                                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                            )}
                        </div>

                        <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <Spinner className="h-4 w-4" /> : null}
                            {form.formState.isSubmitting ? "Logging in..." : "Login"}
                        </Button>

                        <p className="text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link className="font-medium text-primary hover:underline" to="/register">
                                Register
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}