import { type Request, type Response, type NextFunction } from "express"
import { createFieldSchema, updateFieldSchema, reorderFieldSchema } from "./form-field.validation.js"

import { createFieldService, getFieldsService, updateFiledService, deleteFieldService, reorderFieldService } from "./form-field.service.js"


// *** create form field ***
export const createField = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = createFieldSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: result.error.flatten()
            })
        }

        const clerkId = res.locals.userId as string;
        const { formId } = req.params as { formId: string };

        if (!formId) {
            return res.status(400).json({ error: "Form ID is required" });
        }

        const field = await createFieldService(clerkId, formId, result.data);

        res.status(201).json(field)

    } catch (error) {
        next(error)
    }
}

// *** GET Fields *** 

export const getFields = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clerkId = res.locals.userId as string;
        const { formId } = req.params as { formId: string };

        const fields = await getFieldsService(clerkId, formId);

        return res.status(200).json(fields);
    } catch (error) {
        next(error);
    }
};

// *** PATCH *** /api/forms/:formId/fields/:fieldId 

export const updateField = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = updateFieldSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.flatten() });
        }

        const clerkId = res.locals.userId as string;

        const { formId, fieldId } = req.params as { formId: string, fieldId: string };

        const field = await updateFiledService(clerkId, formId, fieldId, result.data);

        return res.status(200).json(field);
    } catch (error) {
        next(error);
    }
};

// *** DELETE *** /api/forms/:formId/fields/:fieldId 

export const deleteField = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clerkId = res.locals.userId as string;
        const { formId, fieldId } = req.params as { formId: string, fieldId: string };

        const result = await deleteFieldService(clerkId, formId, fieldId);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};


// *** PATCH *** /api/forms/:formId/fields/reorder 

//  the route for this must be registered BEFORE /fields/:fieldId in your
// router file — otherwise Express matches "reorder" as a fieldId param value.

export const reorderField = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = reorderFieldSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.flatten() });
        }

        const clerkId = res.locals.userId as string;
        const { formId, fieldId } = req.params as { formId: string, fieldId: string };

        const field = await reorderFieldService(clerkId, formId, result.data, fieldId);

        return res.status(200).json(field);
    } catch (error) {
        next(error);
    }
};