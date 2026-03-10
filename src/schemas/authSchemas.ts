import * as z from "zod"

export const registerSchema = z.object({
    display_name: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Full name is required"
                : "Enter a valid name"
        })
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(80, "Full name must be 80 characters or fewer"),
    email: z.email("Enter a valid email address"),
    password: z
        .string()
        .min(8, "Use at least 8 characters")
        .refine(
            (value) => /[A-Z]/.test(value),
            "Include at least one uppercase letter",
        )
        .refine(
            (value) => /[a-z]/.test(value),
            "Include at least one lowercase letter",
        )
        .refine(
            (value) => /[^a-zA-Z0-9]/.test(value),
            "Include at least one special character",
        ),
    confirm_password: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Please confirm your password"
                : "Enter a valid password"
        })
        .min(8, "Use at least 8 characters")
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
})

export const loginSchema = z.object({
    email: z.email("Enter a valid email address"),
    password: z.string().min(1, "Enter your password"),
})

export type RegisterSchema = z.infer<typeof registerSchema>
export type LoginSchema = z.infer<typeof loginSchema>
