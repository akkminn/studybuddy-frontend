import {useState} from "react"
import {Controller, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Link, Navigate, useNavigate} from "react-router-dom"
import type {AxiosError} from "axios"

import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Spinner} from "@/components/ui/spinner"
import {registerSchema, type RegisterSchema} from "@/schemas/authSchemas"
import AuthService from "@/services/authService"
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field"

function getApiError(error: unknown) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>
    return axiosError.response?.data?.detail ?? axiosError.response?.data?.message ?? "Registration failed"
}

export default function Register() {
    const navigate = useNavigate()
    const [apiError, setApiError] = useState<string | null>(null)
    const hasToken = Boolean(localStorage.getItem("access_token"))

    const form = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            display_name: "",
            email: "",
            password: "",
        },
    })

    const onSubmit = form.handleSubmit(async (values: RegisterSchema) => {
        try {
            setApiError(null)
            await AuthService.register({
                email: values.email,
                password: values.password,
                display_name: values.display_name,
            })
            navigate("/dashboard", {replace: true})
        } catch (error) {
            setApiError(getApiError(error))
        }
    })

    if (hasToken) {
        return <Navigate to="/dashboard" replace/>
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create account</CardTitle>
                    <CardDescription>Register to start using StudyBuddy.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="register-form" onSubmit={onSubmit} className="space-y-3">
                        {apiError && (
                            <Alert variant="destructive">
                                <AlertTitle>Unable to register</AlertTitle>
                                <AlertDescription>{apiError}</AlertDescription>
                            </Alert>
                        )}

                        <FieldGroup>
                            <Controller
                                name="display_name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-register-display_name">
                                            Full Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-register-display_name"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Jhon Doe"
                                            autoComplete="name"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-register-email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-register-email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="jhondoe@gmail.com"
                                            autoComplete="email"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-register-password">
                                            Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-register-password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Password"
                                            autoComplete="new-password"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="confirm_password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-register-confirm_password">
                                            Confirm Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-register-confirm_password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Retype Password"
                                            autoComplete="false"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                        </FieldGroup>

                        <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? <Spinner className="h-4 w-4"/> : null}
                            {form.formState.isSubmitting ? "Creating account..." : "Register"}
                        </Button>

                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link className="font-medium text-primary hover:underline" to="/login">
                                Login
                            </Link>
                        </p>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field orientation="horizontal">
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                            Reset
                        </Button>
                        <Button type="submit" form="form-rhf-input">
                            Save
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        </main>
    )
}
