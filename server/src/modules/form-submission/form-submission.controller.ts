import type { Request, Response, NextFunction } from "express";
import { submitFormSchema } from "./form-submission.validation.js";
import {
    submitFormService,
    getFormSubmissionsService,
    getSubmissionByIdService,
} from "./form-submission.service.js";

// ** Submit a form **   POST /api/forms/:formId/submit 

export const submitForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = submitFormSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.flatten() });
        }

        const { formId } = req.params as { formId: string };
        if (!formId) {
            return res.status(400).json({ error: "Form ID is required" });
        }


        const submission = await submitFormService(formId, result.data);

        return res.status(201).json(submission);
    } catch (error) {
        next(error);
    }
};

// ** Get all submissions for a form **  GET /api/submissions/form/:formId 

export const getFormSubmissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clerkId = res.locals.userId as string;

        const { formId } = req.params as { formId: string };
        if (!formId) {
            return res.status(400).json({ error: "Form ID is required" });
        }

        const submissions = await getFormSubmissionsService(clerkId, formId!);

        return res.status(200).json(submissions);
    } catch (error) {
        next(error);
    }
};

// ** Get Single Submission **   GET /api/submissions/:submissionId 

export const getSubmissionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clerkId = res.locals.userId as string;
        const { submissionId } = req.params as { submissionId: string };
        if (!submissionId) {
            return res.status(400).json({ error: "SubmissionId is required" })
        }

        const submission = await getSubmissionByIdService(clerkId, submissionId!);

        return res.status(200).json(submission);
    } catch (error) {
        next(error);
    }
};
