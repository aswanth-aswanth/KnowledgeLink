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