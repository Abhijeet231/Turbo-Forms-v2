import { z } from "zod";

// *** Field Type Constants ***

export const FIELD_TYPES = [
    "short_text",
    "long_text",
    "email",
    "number",
    "date",
    "single_select",
    "multi_select",
    "dropdown",
    "rating",
    "boolean",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

// *** Sub Schemas ***

export const fieldOptionSchema = z.object({
    label: z.string().min(1, "Option label cannot be empty").max(100),
    value: z.string().min(1, "Option value cannot be empty").max(100),
});

export const fieldValidationSchema = z.object({
    minLength: z.number().int().nonnegative().optional(),
    maxLength: z.number().int().positive().optional(),
    pattern: z.string().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    minSelections: z.number().int().nonnegative().optional(),
    maxSelections: z.number().int().positive().optional(),
    minRating: z.number().int().min(1).max(10).optional(),
    maxRating: z.number().int().min(1).max(10).optional(),
}).strict();

// *** Create Field Schema ***

export const createFieldSchema = z.object({
    type: z.enum(FIELD_TYPES, { message: "Invalid field type" }),
    label: z.string().min(1, "Label is required").max(200).trim(),
    placeholder: z.string().max(200).trim().optional(),
    help_text: z.string().max(500).trim().optional(),
    is_required: z.boolean().default(false),
    options: z.array(fieldOptionSchema).optional(),
    validations: fieldValidationSchema.optional(),
});

// *** Update Field Schema ***

export const updateFieldSchema = z.object({
    label: z.string().min(1).max(200).trim().optional(),
    placeholder: z.string().max(200).trim().optional().nullable(),
    help_text: z.string().max(500).trim().optional().nullable(),
    is_required: z.boolean().optional(),
    options: z.array(fieldOptionSchema).optional(),
    validations: fieldValidationSchema.optional(),
});

// *** Reorder Field Schema ***

export const reorderFieldSchema = z.object({
    prevOrder: z.string().nullable(),
    nextOrder: z.string().nullable(),
}).refine(
    (data) => !(data.prevOrder === null && data.nextOrder === null),
    { message: "prevOrder and nextOrder cannot both be null" }
);

// *** Response Type (what backend sends back) ***

export type FormField = {
    id: string;
    form_id: string;
    type: FieldType;
    label: string;
    field_key: string;
    placeholder?: string | null;
    help_text?: string | null;
    is_required: boolean;
    order: string;
    options: { label: string; value: string }[];
    validations: z.infer<typeof fieldValidationSchema>;
    created_at: string;
    updated_at: string;
};

// *** Exported Types *** 

export type CreateFieldInput = z.infer<typeof createFieldSchema>;
export type UpdateFieldInput = z.infer<typeof updateFieldSchema>;
export type ReorderFieldInput = z.infer<typeof reorderFieldSchema>;
export type FieldOptionInput = z.infer<typeof fieldOptionSchema>;
export type FieldValidationInput = z.infer<typeof fieldValidationSchema>;
