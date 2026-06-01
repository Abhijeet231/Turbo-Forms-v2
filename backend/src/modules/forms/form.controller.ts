import { formsTable } from "../../db/models/form.js";
import { type Request, type Response } from "express";
import { db } from "../../db/index.js";
import { eq, count, and } from "drizzle-orm";
import type { FormSummary, FormDetail, ApiSuccess, ApiError } from "./form.types.js";
import { createFormSchema, publishFormSchema } from "./form.validation.js";
import { formFieldsTable } from "../../db/models/form-field.js";

// ─── Helper ───────────────────────────────────────────────

function generateSlug(title: string): string {
    const base = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")   // strip special chars
        .replace(/\s+/g, "-")            // spaces → hyphens
        .replace(/-+/g, "-")             // collapse multiple hyphens
        .slice(0, 80);                   // keep base under 80 chars

    const suffix = Math.random().toString(36).slice(2, 6); // e.g. "x7k2"
    return `${base}-${suffix}`;
}


// ─── CREATE FORM ───────────────────────────────────────────

export const createForm = async (req: Request, res: Response) => {
    try {
        //  Validate body
        const parsed = createFormSchema.safeParse(req.body);
        if (!parsed.success) {
            const errors = parsed.error.flatten().fieldErrors;
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors,
            } satisfies ApiError);
        }

        const { title, description } = parsed.data;

        //  Getting user that comes from middleware
        const createdBy = req.user?.id
        if (!createdBy) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            } satisfies ApiError);
        }

        // Generating slug 
        let slug = generateSlug(title);

        //  Inserting to DB
        const [form] = await db
            .insert(formsTable)
            .values({
                title,
                description: description ?? null,
                slug,
                createdBy,

            })
            .returning();

        // narrowing chck
        if (!form) {
            return res.status(500).json({
                success: false,
                message: "Form creation failed unexpectedly"
            } satisfies ApiError)
        }

        return res.status(201).json({
            success: true,
            message: "Form created successfully",
            data: form,
        } satisfies ApiSuccess<FormDetail>);

    } catch (error: any) {
        // Slug unique constraint violation → retry with new slug
        if (error?.code === "23505" && error?.constraint === "idx_forms_slug") {
            return res.status(409).json({
                success: false,
                message: "Could not generate a unique form URL. Please try again.",
            } satisfies ApiError);
        }

        console.error("[createForm]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        } satisfies ApiError);
    }
};


// ─── GET ALL FORMS BY USER ─────────────────────────────────

export const getFormsByUser = async (req: Request, res: Response) => {
    try {
        // getting the user
        const userId = req.user?.id
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            } satisfies ApiError);
        }

        // fetching all forms realted to this user
        const forms = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                slug: formsTable.slug,
                isPublished: formsTable.isPublished,
                visibility: formsTable.visibility,
                theme: formsTable.theme,
                viewCount: formsTable.viewCount,
                submissionCount: formsTable.submissionCount,
                createdAt: formsTable.createdAt,
                updatedAt: formsTable.updatedAt,
            })
            .from(formsTable)
            .where(eq(formsTable.createdBy, userId))
            .orderBy(formsTable.createdAt);


        return res.status(200).json({
            success: true,
            data: forms,
        } satisfies ApiSuccess<FormSummary[]>);

    } catch (error) {
        console.error("[getFormsByUser]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        } satisfies ApiError);
    }
};


// ─── GET FORM BY FORM-ID ────────────────────────────────────────

export const getFormById = async (req: Request, res: Response) => {
    try {
        const { formId } = req.params as { formId: string };
        const userId = req.user?.id;


        const [form] = await db
            .select()
            .from(formsTable)
            .where(eq(formsTable.id, formId))
            .limit(1);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form not found",
            } satisfies ApiError);
        }

        // Only the owner can see unpublished forms
        if (!form.isPublished && form.createdBy !== userId) {
            return res.status(403).json({
                success: false,
                message: "You do not have access to this form",
            } satisfies ApiError);
        }

        return res.status(200).json({
            success: true,
            data: form,
        } satisfies ApiSuccess<FormDetail>);

    } catch (error) {
        console.error("[getFormById]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        } satisfies ApiError);
    }
};

// PUblish fomr 
export const publishForm = async (req: Request, res: Response) => {
    try {
        const { formId } = req.params as { formId: string };
        const userId = req.user!.id;

        //  Validate body
        const parsed = publishFormSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
            } satisfies ApiError);
        }

        const { visibility } = parsed.data;

        //  Verify form exists and user owns it
        const [form] = await db
            .select({
                id: formsTable.id,
                createdBy: formsTable.createdBy,
                isPublished: formsTable.isPublished,
            })
            .from(formsTable)
            .where(eq(formsTable.id, formId))
            .limit(1);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form not found",
            } satisfies ApiError);
        }

        if (form.createdBy !== userId) {
            return res.status(403).json({
                success: false,
                message: "You do not have access to this form",
            } satisfies ApiError);
        }

        //  Already published - nothing to do
        if (form.isPublished) {
            return res.status(400).json({
                success: false,
                message: "Form is already published",
            } satisfies ApiError);
        }

        //  Must have at least 1 field
        const [fieldCount] = await db
            .select({ count: count() })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId));

        if (!fieldCount || fieldCount.count === 0) {
            return res.status(400).json({
                success: false,
                message: "Form must have at least one field before publishing",
            } satisfies ApiError);
        }

        //  Publish
        const [published] = await db
            .update(formsTable)
            .set({
                isPublished: true,
                visibility,
            })
            .where(eq(formsTable.id, formId))
            .returning();

        if (!published) {
            return res.status(500).json({
                success: false,
                message: "Failed to publish form",
            } satisfies ApiError);
        }

        return res.status(200).json({
            success: true,
            message: "Form published successfully",
            data: published,
        } satisfies ApiSuccess<FormDetail>);

    } catch (error) {
        console.error("[publishForm]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        } satisfies ApiError);
    }
};


// Unpublish form
export const unpublishForm = async (req: Request, res: Response) => {
    try {
        const { formId } = req.params as { formId: string };
        const userId = req.user!.id;

        const [form] = await db
            .select({
                id: formsTable.id,
                createdBy: formsTable.createdBy,
                isPublished: formsTable.isPublished,
            })
            .from(formsTable)
            .where(eq(formsTable.id, formId))
            .limit(1);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "Form not found",
            } satisfies ApiError);
        }

        if (form.createdBy !== userId) {
            return res.status(403).json({
                success: false,
                message: "You do not have access to this form",
            } satisfies ApiError);
        }

        if (!form.isPublished) {
            return res.status(400).json({
                success: false,
                message: "Form is already unpublished",
            } satisfies ApiError);
        }

        const [unpublished] = await db
            .update(formsTable)
            .set({ isPublished: false })
            .where(eq(formsTable.id, formId))
            .returning();

        if (!unpublished) {
            return res.status(500).json({
                success: false,
                message: "Failed to unpublish form",
            } satisfies ApiError);
        }

        return res.status(200).json({
            success: true,
            message: "Form unpublished successfully",
            data: unpublished,
        } satisfies ApiSuccess<FormDetail>);

    } catch (error) {
        console.error("[unpublishForm]", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        } satisfies ApiError);
    }
};