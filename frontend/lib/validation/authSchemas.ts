import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .regex(/^\S+$/, "Email should not contain spaces"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must be at most 32 characters")
        .regex(/^\S+$/, "Password should not contain spaces"),
});

export const registrationSchema = z
    .object({
        username: z
            .string()
            .min(6)
            .max(12)
            .regex(
                /^[a-zA-Z]+$/,
                "Username should only contain letters and should not contain spaces or special characters"
            ),
        email: z
            .string()
            .max(20)
            .email("Invalid email address")
            .regex(/^\S+$/, "Email should not contain spaces"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(32, "Password must be at most 32 characters")
            .regex(/^\S+$/, "Password should not contain spaces")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/\d/, "Password must contain at least one number")
            .regex(
                /[^a-zA-Z0-9]/,
                "Password must contain at least one special character"
            ),
        confirmPassword: z.string().nonempty("Confirm password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });