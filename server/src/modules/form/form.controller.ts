import {createFormSchema, updateFormSchema} from "./form.validation.js"
import { type Request, type Response } from "express"
import {createFormService, updateFormService} from "./form.service.js"


// create form
export const createForm = async (req:Request, res:Response) => {

    const result = createFormSchema.safeParse(req.body)
    if(!result.success) {
        return res.status(400).json({error: result.error.flatten()});
    }

    const userId = res.locals.userId;

    const form = await createFormService(userId, result.data)

    res.status(201).json(form)
}

// update form
export const updateForm = async (req:Request, res:Response) => {

    const result = updateFormSchema.safeParse(req.body)
    if(!result.success) {
        return res.status(400).json({error: result.error.flatten()});
    }

    const userId = res.locals.userId;
    const formId = req.params.id;

    const form = await updateFormService(userId,formId, result.data)

    res.status(200).json(form)

}