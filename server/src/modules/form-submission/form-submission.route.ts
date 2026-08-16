import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { submitLimiter } from "../../middleware/rateLimiter.middleware.js";
import {
    submitForm,
    getFormSubmissions,
    getSubmissionById,
} from "./form-submission.controller.js";

//  /api/forms/:formId/submit
export const formSubmitRouter = Router({ mergeParams: true });

// public
formSubmitRouter.post("/:formId/submit", submitLimiter, submitForm);

//  /api/submissions 

export const submissionsRouter = Router();

submissionsRouter.use(requireAuth); // all submission read routes are owner only

submissionsRouter.get("/form/:formId",  getFormSubmissions);
submissionsRouter.get("/:submissionId", getSubmissionById);
