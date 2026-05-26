import { z } from "zod"

// SIGN UP SCHEMA
export const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name must be under 80 characters")
    .trim(),

  email: z
    .email("Invalid email address")
    .max(255)
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password too long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
})


// LOGIN SCHEMA
export const loginSchema = z.object({
  email: z
    .email("Invalid email address")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, "Password is required"),
})

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>