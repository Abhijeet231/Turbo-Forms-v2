import { z } from "zod";

export const createFormSchema = z.object({
    title: z
        .string("Title is required")
        .min(1, "Title cannot be empty")
        .max(100, "Title must be under 100 characters")
        .trim(),

    description: z
        .string()
        .max(500, "Description must be under 500 characters")
        .trim()
        .optional(),
});

export type CreateFormInput = z.infer<typeof createFormSchema>;


export const publishFormSchema = z.object({
    visibility: z.enum(["public", "unlisted"]).default("unlisted"),
});

export type PublishFormInput = z.infer<typeof publishFormSchema>;