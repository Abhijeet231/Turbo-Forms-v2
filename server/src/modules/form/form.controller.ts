import { createFormSchema, updateFormSchema } from "./form.validation.js"
import { type NextFunction, type Request, type Response } from "express"
import { createFormService, updateFormService, getAllFormsService, getFormByIdForCreatorService, deleteFormService, setFormPublishStatusService } from "./form.service.js"


// create form
export const createForm = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const result = createFormSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({ error: result.error.flatten() });
        }

        const userId = res.locals.userId;
        const form = await createFormService(userId, result.data)

        res.status(201).json(form)
    } catch (error) {
        next(error)
    }
}

// update form
export const updateForm = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const result = updateFormSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({ error: result.error.flatten() });
        }

        const userId = res.locals.userId;
        const formId = req.params.id as string;

        if (!formId) {
            return res.status(400).json({ error: "Form ID is required" });
        }


        const form = await updateFormService(userId, formId, result.data)

        res.status(200).json(form)
    } catch (error) {
        next(error)
    }

}

// get all form for loggedIn creatro
export const getAllForms = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const userId = res.locals.userId;

        const forms = await getAllFormsService(userId)

        res.status(200).json(forms)
    } catch (error) {
        next(error)
    }
}

// get single form by id for creator
export const getFormByIdForCreator = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const formId = req.params.id as string;
        const userId = res.locals.userId;

        const form = await getFormByIdForCreatorService(userId, formId)

        res.status(200).json(form)
    } catch (error) {
        next(error)
    }
}


// delete form
export const deleteForm = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const formId = req.params.id as string;
        const userId = res.locals.userId;

        await deleteFormService(userId, formId);

        res.status(200).json({ message: "Form Deleted successfully" })
    } catch (error) {
        next(error)
    }

}


// publish form
export const publishForm = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const formId = req.params.id as string;
        const userId = res.locals.userId;

        const form = await setFormPublishStatusService(userId, formId, true);

        res.status(200).json(form)

    } catch (error) {
        next(error)
    }
}

// unpublish form
export const unpublishForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const formId = req.params.id as string;
        const userId = res.locals.userId;

        const form = await setFormPublishStatusService(userId, formId, false);

        res.status(200).json(form);
    } catch (error) {
        next(error)
    }
};