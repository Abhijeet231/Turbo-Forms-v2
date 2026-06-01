import { z } from "zod";

// ─── Field Types ───────────────────────────────────────────

const fieldTypes = [
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

const optionTypes = ["single_select", "multi_select", "dropdown"] as const;
const textTypes   = ["short_text", "long_text", "email"] as const;
const numberTypes = ["number", "rating"] as const;

// ─── Sub-schemas ───────────────────────────────────────────

const fieldOptionSchema = z.object({
    label: z.string().min(1, "Option label cannot be empty").max(100),
    value: z.string().min(1, "Option value cannot be empty").max(100),
});

const fieldValidationSchema = z.object({
    minLength    : z.number().int().nonnegative().optional(),
    maxLength    : z.number().int().positive().optional(),
    min          : z.number().optional(),
    max          : z.number().optional(),
    pattern      : z.string().optional(),
    minSelections: z.number().int().nonnegative().optional(),
    maxSelections: z.number().int().positive().optional(),
    minRating    : z.number().int().min(1).optional(),
    maxRating    : z.number().int().max(10).optional(),
}).optional();

// ─── Create Field Schema ───────────────────────────────────

export const createFieldSchema = z.object({
    type: z.enum(fieldTypes, {
         error: "Invalid field type"
    }),

    label: z
        .string( "Label is required" )
        .min(1, "Label cannot be empty")
        .max(200, "Label must be under 200 characters")
        .trim(),

    description: z.string().max(500).trim().optional(),
    placeholder : z.string().max(200).trim().optional(),
    isRequired  : z.boolean().optional().default(false),
    defaultValue: z.string().max(500).optional(),

    options    : z.array(fieldOptionSchema).optional(),
    validations: fieldValidationSchema,
})
// Cross-field validation
.superRefine((data, ctx) => {
    const isOptionType = (optionTypes as readonly string[]).includes(data.type);
    const isTextType   = (textTypes as readonly string[]).includes(data.type);
    const isNumberType = (numberTypes as readonly string[]).includes(data.type);

    // options required for select/dropdown types
    if (isOptionType && (!data.options || data.options.length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["options"],
            message: `Options are required for field type "${data.type}"`,
        });
    }

    // options not allowed on non-select types
    if (!isOptionType && data.options && data.options.length > 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["options"],
            message: `Options are not allowed for field type "${data.type}"`,
        });
    }

    // text-only validations
    if (!isTextType && data.validations) {
        const { minLength, maxLength, pattern } = data.validations;
        if (minLength !== undefined || maxLength !== undefined || pattern !== undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["validations"],
                message: `minLength, maxLength, pattern are only valid for text field types`,
            });
        }
    }

    // number-only validations
    if (!isNumberType && data.validations) {
        const { min, max, minRating, maxRating } = data.validations;
        if (min !== undefined || max !== undefined || minRating !== undefined || maxRating !== undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["validations"],
                message: `min, max, minRating, maxRating are only valid for number/rating field types`,
            });
        }
    }

    // minLength < maxLength
    if (data.validations?.minLength !== undefined && data.validations?.maxLength !== undefined) {
        if (data.validations.minLength >= data.validations.maxLength) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["validations", "minLength"],
                message: "minLength must be less than maxLength",
            });
        }
    }

    // min < max
    if (data.validations?.min !== undefined && data.validations?.max !== undefined) {
        if (data.validations.min >= data.validations.max) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["validations", "min"],
                message: "min must be less than max",
            });
        }
    }
});

// ─── Update Field Schema ───────────────────────────────────
// type is intentionally excluded — changing type breaks submission answers

export const updateFieldSchema = z.object({
    label       : z.string().min(1).max(200).trim().optional(),
    description : z.string().max(500).trim().optional(),
    placeholder : z.string().max(200).trim().optional(),
    isRequired  : z.boolean().optional(),
    defaultValue: z.string().max(500).optional(),
    options     : z.array(fieldOptionSchema).optional(),
    validations : fieldValidationSchema,
}).superRefine((data, ctx) => {
    if (data.validations?.minLength !== undefined && data.validations?.maxLength !== undefined) {
        if (data.validations.minLength >= data.validations.maxLength) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["validations", "minLength"],
                message: "minLength must be less than maxLength",
            });
        }
    }
    if (data.validations?.min !== undefined && data.validations?.max !== undefined) {
        if (data.validations.min >= data.validations.max) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["validations", "min"],
                message: "min must be less than max",
            });
        }
    }
});

// ─── Reorder Field Schema ──────────────────────────────────

export const reorderFieldSchema = z.object({
    prevOrder: z.string().nullable(),
    nextOrder: z.string().nullable(),
}).refine(
    (data) => !(data.prevOrder === null && data.nextOrder === null),
    { message: "prevOrder and nextOrder cannot both be null" }
);

// ─── Inferred Types ────────────────────────────────────────

export type CreateFieldInput  = z.infer<typeof createFieldSchema>;
export type UpdateFieldInput  = z.infer<typeof updateFieldSchema>;
export type ReorderFieldInput = z.infer<typeof reorderFieldSchema>;