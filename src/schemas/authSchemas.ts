import * as z from "zod";

export const registerSchema = z.object({
    display_name: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(80, "Full name must be at most 80 characters"),
    email: z.email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .refine(
            (value) => /[A-Z]/.test(value),
            "Password must contain at least one uppercase letter",
        )
        .refine(
            (value) => /[a-z]/.test(value),
            "Password must contain at least one lowercase letter",
        )
        .refine(
            (value) => /[^a-zA-Z0-9]/.test(value),
            "Password must contain at least one special character",
        ),
    confirm_password: z
        .string()
        .min(8, "Password must be at least 8 characters")
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
})

export const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
})

export type RegisterSchema = z.infer<typeof registerSchema>
export type LoginSchema = z.infer<typeof loginSchema>