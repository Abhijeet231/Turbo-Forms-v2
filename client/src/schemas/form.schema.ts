import { z } from "zod"
import type { FormField } from "./form-field.schema"

// *** Create Form Schema ***
export const createFormSchema = z.object({
    title: z.string("Title is required")
        .min(1, "Title cannot be empty")
        .max(100, "Title must be under 100 characters").trim(),

    description: z.string()
        .max(500, "Description must be unde 500 characters")
        .trim()
        .optional()
})

// *** Update Form Schema ***
export const updateFormSchema = z.object({
    title: z.string("Title is required")
        .min(1, "Title cannot be empty")
        .max(100, "Title must be under 100 characters").trim().optional(),

    description: z.string()
        .max(500, "Description must be unde 500 characters")
        .trim()
        .optional(),

    visibility: z.enum(["public", "unlisted"]).optional(),
})

export type CreateFormInput = z.infer<typeof createFormSchema>;

export type UpdateFormInput = z.infer<typeof updateFormSchema>;


// *** Response Type ***
export type FormVisibility = "public" | "unlisted";

export type FormTheme = Record<string, unknown>;
export type FormSettings = Record<string, unknown>;


export type Form = {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    slug: string;
    visibility: FormVisibility;
    is_published: boolean;
    theme: FormTheme;
    settings: FormSettings;
    created_at: string; // ISO 8601 string from JSON serialization
    updated_at: string;
};

// public form fetched by slug: the form row plus its ordered fields
export type PublicForm = Form & {
    fields: FormField[];
};


