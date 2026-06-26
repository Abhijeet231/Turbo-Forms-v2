import { z } from "zod";

//  Field Type Constants 

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


const OPTION_TYPES = new Set(["single_select", "multi_select", "dropdown"]);
const TEXT_TYPES = new Set(["short_text", "long_text", "email"]);
const NUMBER_TYPES = new Set(["number"]);
const RATING_TYPES = new Set(["rating"]);
const SELECT_TYPES = new Set(["multi_select"]);

//  Sub-schemas 

export const fieldOptionSchema = z.object({
    label: z.string().min(1, "Option label cannot be empty").max(100),
    value: z.string().min(1, "Option value cannot be empty").max(100),
});

// .strict() rejects any key not listed here 
export const fieldValidationSchema = z
    .object({
        minLength: z.number().int().nonnegative().optional(),
        maxLength: z.number().int().positive().optional(),
        pattern: z.string().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
        minSelections: z.number().int().nonnegative().optional(),
        maxSelections: z.number().int().positive().optional(),
        minRating: z.number().int().min(1).max(10).optional(),
        maxRating: z.number().int().min(1).max(10).optional(),
    })
    .strict();

//  Shared Cross-field Validation 

interface CrossValidateArgs {
    type: FieldType;
    options?: { label: string; value: string; }[] | undefined;
    validations?: z.infer<typeof fieldValidationSchema> | undefined;
}

function crossValidateField(data: CrossValidateArgs, ctx: z.RefinementCtx) {
    const { type, options, validations } = data;

    //  Options presence 
    // single_select, multi_select, dropdown - options are required
    // everything else - options must not be present
    if (OPTION_TYPES.has(type)) {
        if (!options || options.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["options"],
                message: `options are required for field type "${type}"`,
            });
        }
    } else {
        if (options && options.length > 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["options"],
                message: `options are not allowed for field type "${type}"`,
            });
        }
    }

    // nothing else to check if no validations were sent
    if (!validations) return;

    //  Text-only keys 
    // minLength, maxLength, pattern only make sense on text fields
    const hasTextValidations =
        validations.minLength !== undefined ||
        validations.maxLength !== undefined ||
        validations.pattern !== undefined;

    if (hasTextValidations && !TEXT_TYPES.has(type)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["validations"],
            message: `minLength, maxLength, pattern are only valid for text field types`,
        });
    }

    //  Number-only keys 
    const hasNumberValidations =
        validations.min !== undefined ||
        validations.max !== undefined;

    if (hasNumberValidations && !NUMBER_TYPES.has(type)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["validations"],
            message: `min and max are only valid for the "number" field type`,
        });
    }

    //  Rating-only keys 
    const hasRatingValidations =
        validations.minRating !== undefined ||
        validations.maxRating !== undefined;

    if (hasRatingValidations && !RATING_TYPES.has(type)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["validations"],
            message: `minRating and maxRating are only valid for the "rating" field type`,
        });
    }

    // Multi-select-only keys 
    const hasSelectValidations =
        validations.minSelections !== undefined ||
        validations.maxSelections !== undefined;

    if (hasSelectValidations && !SELECT_TYPES.has(type)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["validations"],
            message: `minSelections and maxSelections are only valid for the "multi_select" field type`,
        });
    }

    //  Cross-range 
    // These were missing in your old code for minRating and minSelections

    if (
        validations.minLength !== undefined &&
        validations.maxLength !== undefined &&
        validations.minLength >= validations.maxLength
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["validations", "minLength"],
            message: "minLength must be less than maxLength",
        });
    }

    if (
        validations.min !== undefined &&
        validations.max !== undefined &&
        validations.min >= validations.max
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["validations", "min"],
            message: "min must be less than max",
        });
    }

    if (
        validations.minRating !== undefined &&
        validations.maxRating !== undefined &&
        validations.minRating >= validations.maxRating
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["validations", "minRating"],
            message: "minRating must be less than maxRating",
        });
    }

    if (
        validations.minSelections !== undefined &&
        validations.maxSelections !== undefined &&
        validations.minSelections >= validations.maxSelections
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["validations", "minSelections"],
            message: "minSelections must be less than maxSelections",
        });
    }

    //  Validate pattern is a real 
    // Your old code accepted any string — "***" is not a valid regex
    if (validations.pattern !== undefined) {
        try {
            new RegExp(validations.pattern);
        } catch {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["validations", "pattern"],
                message: "pattern must be a valid regular expression",
            });
        }
    }
}

//  Create Field Schema 
export const createFieldSchema = z
    .object({
        
        type: z.enum(FIELD_TYPES, { message: "Invalid field type" }),

        label: z
            .string("label is required")
            .min(1, "label cannot be empty")
            .max(200, "label must be under 200 characters")
            .trim(),

        placeholder: z.string().max(200).trim().optional(),
        help_text: z.string().max(500).trim().optional(),
        is_required: z.boolean().default(false),

        options: z.array(fieldOptionSchema).optional(),
        validations: fieldValidationSchema.optional(),
    })
    .superRefine((data, ctx) => {
        crossValidateField(data, ctx);
    });


//  Update Field Schema 
export const updateFieldSchema = z
    .object({
        label: z.string().min(1).max(200).trim().optional(),
        placeholder: z.string().max(200).trim().optional().nullable(),
        help_text: z.string().max(500).trim().optional().nullable(),
        is_required: z.boolean().optional(),
        options: z.array(fieldOptionSchema).optional(),
        validations: fieldValidationSchema.optional(),
    })
    .superRefine((data, ctx) => {
       
        const v = data.validations;
        if (!v) return;

        if (v.minLength !== undefined && v.maxLength !== undefined && v.minLength >= v.maxLength) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["validations", "minLength"], message: "minLength must be less than maxLength" });
        }
        if (v.min !== undefined && v.max !== undefined && v.min >= v.max) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["validations", "min"], message: "min must be less than max" });
        }
        if (v.minRating !== undefined && v.maxRating !== undefined && v.minRating >= v.maxRating) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["validations", "minRating"], message: "minRating must be less than maxRating" });
        }
        if (v.minSelections !== undefined && v.maxSelections !== undefined && v.minSelections >= v.maxSelections) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["validations", "minSelections"], message: "minSelections must be less than maxSelections" });
        }
        if (v.pattern !== undefined) {
            try { new RegExp(v.pattern); } catch {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["validations", "pattern"], message: "pattern must be a valid regular expression" });
            }
        }
    });


//  Reorder Field Schema 
export const reorderFieldSchema = z
    .object({
        prevOrder: z.string().nullable(),
        nextOrder: z.string().nullable(),
    })
    .refine(
        (data) => !(data.prevOrder === null && data.nextOrder === null),
        { message: "prevOrder and nextOrder cannot both be null" }
    );

//  Exported Types 
export type CreateFieldInput = z.infer<typeof createFieldSchema>;
export type UpdateFieldInput = z.infer<typeof updateFieldSchema>;
export type ReorderFieldInput = z.infer<typeof reorderFieldSchema>;
export type FieldOptionInput = z.infer<typeof fieldOptionSchema>;
export type FieldValidationInput = z.infer<typeof fieldValidationSchema>;
