import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
    submitForm,
    getFormSubmissions,
    getSubmissionById,
} from "./form-submission.controller.js";

//  /api/forms/:formId/submit 
export const formSubmitRouter = Router({ mergeParams: true });

// public - add rate limiting later
formSubmitRouter.post("/:formId/submit", submitForm);

//  /api/submissions 

export const submissionsRouter = Router();

submissionsRouter.use(requireAuth); // all submission read routes are owner only

submissionsRouter.get("/form/:formId",  getFormSubmissions);
submissionsRouter.get("/:submissionId", getSubmissionById);
