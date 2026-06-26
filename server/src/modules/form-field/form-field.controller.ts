import { type CreateFieldInput, createFieldSchema } from "./form-field.validation.js"
import { type Request, type Response, type NextFunction } from "express"
import { createFieldService } from "./form-field.service.js"


// create form
export const createField = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = createFieldSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: result.error.flatten()
            })
        }

        const userId = res.locals.userId;
        const formId = req.params.formId ;

        if(!formId){
             return res.status(400).json({ error: "Form ID is required" });
        }

        const field = await createFieldService(userId, formId, result);

        res.status(201).json(field)



    } catch (error) {
        next(error)
    }
}