import { z } from "zod";

/* ================= REGISTER ================= */

export const registerSchema = z.object({
    fullName: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(90, "Name cannot exceed 90 characters")
        .trim(),

    email: z
        .email("Please enter a valid email")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password cannot exceed 100 characters")
        .regex(
            /[A-Z]/,
            "Password must contain at least one uppercase letter"
        )
        .regex(
            /[0-9]/,
            "Password must contain at least one number"
        ),

    profileImageUrl: z
        .url("Please provide a valid image URL")
        .optional(),
});


/* ================= LOGIN ================= */
export const loginSchema = z.object({
    email: z
        .email("Please enter a valid email")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password cannot exceed 100 characters")
        .regex(
            /[A-Z]/,
            "Password must contain at least one uppercase letter"
        )
        .regex(
            /[0-9]/,
            "Password must contain at least one number"
        ),
})

/* ================= TYPES ================= */

export type RegisterSchemaType = z.infer<
    typeof registerSchema
>;

export type LoginSchemaType = z.infer<typeof loginSchema>
