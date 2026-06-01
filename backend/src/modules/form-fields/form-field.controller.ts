import { type Request, type Response } from "express";
import { db } from "../../db/index.js";
import { formFieldsTable, type FieldValidation } from "../../db/models/form-field.js";
import { eq, and, asc } from "drizzle-orm";
import { generateKeyBetween } from "fractional-indexing";
import {
    createFieldSchema,
    updateFieldSchema,
    reorderFieldSchema,
} from "./form-field.validation.js";
import { verifyFormOwnership } from "./form-field.helper.js";
import type {
    FieldSummary,
    FieldDetail,
    ApiSuccess,
    ApiError,
} from "./form-field.types.js";

// ─── Helpers ───────────────────────────────────────────────

/**
 * Generates a labelKey from the field label.
 * "First Name" → "first_name"
 * "What's your email?" → "whats_your_email"
 */
function generateLabelKey(label: string): string {
    return label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "_")
        .replace(/_+/g, "_")
        .slice(0, 190);
}

/**
 * Gets the current last displayOrder for a form's fields.
 * Returns null if no fields exist yet.
 */
async function getLastDisplayOrder(formId: string): Promise<string | null> {
    const fields = await db
        .select({ displayOrder: formFieldsTable.displayOrder })
        .from(formFieldsTable)
        .where(eq(formFieldsTable.formId, formId))
        .orderBy(asc(formFieldsTable.displayOrder));

    if (fields.length === 0) return null;
    return fields[fields.length - 1]!.displayOrder;
}

// ─── CREATE FIELD ──────────────────────────────────────────

export const createField = async (req: Request, res: Response) => {
    try {
        const { formId } = req.params as { formId: string };
        const userId = req.user!.id;

        //  Ownership check
        const check = await verifyFormOwnership(formId, userId);
        if (!check.authorized) {
            return res.status(check.status!).json({
                success: false,
                message: check.message!,
            } satisfies ApiError);
        }

        //  Validate body
        const parsed = createFieldSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: parsed.error.flatten().fieldErrors,
            } satisfies ApiError);
        }

        const { label, ...rest } = parsed.data;

        //  Generate labelKey - handle collision by appending a suffix
        let labelKey = generateLabelKey(label);
        const existing = await db
            .select({ labelKey: formFieldsTable.labelKey })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId));

        const existingKeys = new Set(existing.map((f) => f.labelKey));
        if (existingKeys.has(labelKey)) {
            const suffix = Math.random().toString(36).slice(2, 6);
            labelKey = `${labelKey}_${suffix}`.slice(0, 200);
        }

        //  Generate displayOrder - append after last field
        const lastOrder = await getLastDisplayOrder(formId);
        const displayOrder = generateKeyBetween(lastOrder, null);

        //  Insert
        const [field] = await db
            .insert(formFieldsTable)
            .values({
                formId,
                label,
                labelKey,
                displayOrder,
                ...rest,

            })
            .returning();

        if (!field) {
            return res.status(500).json({
                success: false,
                message: "Field creation failed unexpectedly",
            } satisfies ApiError);
        }

        return res.status(201).json({
            success: true,
            message: "Field created successfully",
            data: field,
        } satisfies ApiSuccess<FieldDetail>);

    } catch (error: any) {
        // labelKey unique constraint collision (rare edge case)
        if (error?.code === "23505" && error?.constraint === "uq_form_fields_label_key") {
            return res.status(409).json({
                success: false,
                message: "Could not generate a unique field key. Please try again.",
            } satisfies ApiError);
        }

        console.error("[createField]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        } satisfies ApiError);
    }
};

// ─── GET FIELDS BY FORM ────────────────────────────────────

export const getFieldsByFormId = async (req: Request, res: Response) => {
    try {
        const { formId } = req.params as { formId: string };
        const userId = req.user?.id;

        // ownership check only for unauthenticated / non-owners
        const fields = await db
            .select()
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
            .orderBy(asc(formFieldsTable.displayOrder));

        // if no fields - verify the form actually exists
        if (fields.length === 0) {
            const check = await verifyFormOwnership(formId, userId ?? "");
            if (check.status === 404) {
                return res.status(404).json({
                    success: false,
                    message: "Form not found",
                } satisfies ApiError);
            }
        }

        return res.status(200).json({
            success: true,
            data: fields,
        } satisfies ApiSuccess<FieldSummary[]>);

    } catch (error) {
        console.error("[getFieldsByFormId]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        } satisfies ApiError);
    }
};

// ─── UPDATE FIELD ──────────────────────────────────────────

export const updateField = async (req: Request, res: Response) => {
    try {
        const { formId, fieldId } = req.params as { formId: string; fieldId: string };
        const userId = req.user!.id;

        //  Ownership check
        const check = await verifyFormOwnership(formId, userId);
        if (!check.authorized) {
            return res.status(check.status!).json({
                success: false,
                message: check.message ?? "Someting went wrong",
            } satisfies ApiError);
        }

        //  Verify field belongs to this form
        const [existing] = await db
            .select()
            .from(formFieldsTable)
            .where(
                and(
                    eq(formFieldsTable.id, fieldId),
                    eq(formFieldsTable.formId, formId)
                )
            )
            .limit(1);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Field not found",
            } satisfies ApiError);
        }

        //  Validate body
        const parsed = updateFieldSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: parsed.error.flatten().fieldErrors,
            } satisfies ApiError);
        }

        //  If label changed, regenerate labelKey
        let labelKey: string | undefined;
        if (parsed.data.label && parsed.data.label !== existing.label) {
            const newKey = generateLabelKey(parsed.data.label);
            const allFields = await db
                .select({ labelKey: formFieldsTable.labelKey })
                .from(formFieldsTable)
                .where(eq(formFieldsTable.formId, formId));

            const existingKeys = new Set(
                allFields
                    .filter((f) => f.labelKey !== existing.labelKey)
                    .map((f) => f.labelKey)
            );

            labelKey = existingKeys.has(newKey)
                ? `${newKey}_${Math.random().toString(36).slice(2, 6)}`.slice(0, 200)
                : newKey;
        }

        //  Update
        const [updated] = await db
            .update(formFieldsTable)
            .set({
                ...parsed.data,
                ...(labelKey ? { labelKey } : {}),
            })
            .where(
                and(
                    eq(formFieldsTable.id, fieldId),
                    eq(formFieldsTable.formId, formId)
                )
            )
            .returning();

        if (!updated) {
            return res.status(500).json({
                success: false,
                message: "Field update failed unexpectedly",
            } satisfies ApiError);
        }

        return res.status(200).json({
            success: true,
            message: "Field updated successfully",
            data: updated,
        } satisfies ApiSuccess<FieldDetail>);

    } catch (error) {
        console.error("[updateField]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        } satisfies ApiError);
    }
};

// ─── DELETE FIELD ──────────────────────────────────────────

export const deleteField = async (req: Request, res: Response) => {
    try {
        const { formId, fieldId } = req.params as { formId: string; fieldId: string };
        const userId = req.user!.id;

        //  Ownership check
        const check = await verifyFormOwnership(formId, userId);
        if (!check.authorized) {
            return res.status(check.status!).json({
                success: false,
                message: check.message ?? "Someting went wrong",
            } satisfies ApiError);
        }

        //  Delete - only if it belongs to this form
        const [deleted] = await db
            .delete(formFieldsTable)
            .where(
                and(
                    eq(formFieldsTable.id, fieldId),
                    eq(formFieldsTable.formId, formId)
                )
            )
            .returning({ id: formFieldsTable.id });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Field not found",
            } satisfies ApiError);
        }

        return res.status(200).json({
            success: true,
            message: "Field deleted successfully",
            data: { id: deleted.id },
        } satisfies ApiSuccess<{ id: string }>);

    } catch (error) {
        console.error("[deleteField]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        } satisfies ApiError);
    }
};

// ─── REORDER FIELD ─────────────────────────────────────────

export const reorderField = async (req: Request, res: Response) => {
    try {
        const { formId, fieldId } = req.params as { formId: string; fieldId: string };
        const userId = req.user!.id;

        //  Ownership check
        const check = await verifyFormOwnership(formId, userId);
        if (!check.authorized) {
            return res.status(check.status!).json({
                success: false,
                message: check.message ?? "Someting went wrong",
            } satisfies ApiError);
        }

        //  Validate body
        const parsed = reorderFieldSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: parsed.error.flatten().fieldErrors,
            } satisfies ApiError);
        }

        const { prevOrder, nextOrder } = parsed.data;

        //  Generate new displayOrder between the two neighbours
        const newOrder = generateKeyBetween(prevOrder, nextOrder);

        //  Update just this one field - one DB write, that's the beauty of fractional indexing
        const [updated] = await db
            .update(formFieldsTable)
            .set({ displayOrder: newOrder })
            .where(
                and(
                    eq(formFieldsTable.id, fieldId),
                    eq(formFieldsTable.formId, formId)
                )
            )
            .returning({ id: formFieldsTable.id, displayOrder: formFieldsTable.displayOrder });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Field not found",
            } satisfies ApiError);
        }

        return res.status(200).json({
            success: true,
            message: "Field reordered successfully",
            data: updated,
        } satisfies ApiSuccess<{ id: string; displayOrder: string }>);

    } catch (error) {
        console.error("[reorderField]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        } satisfies ApiError);
    }
};