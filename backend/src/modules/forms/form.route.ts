import {Router} from "express"
import rateLimit from "express-rate-limit"
import { createForm, getFormsByUser, getFormById, unpublishForm, publishForm, getPublicForm, previewForm} from "./form.controller.js"
import { authenticate, optionalAuthenticate } from "../../middlewares/auth.middleware.js"
import fieldRouter from "../form-fields/form-field.route.js"


// Rate-Limiter
const createFormLimiter = rateLimit({
    windowMs: 10 * 1000, 
    limit: 3,
    message: {
        success: false,
        message: "Too many forms created. Please Wait a moment."
    },
    standardHeaders: "draft-7",
    legacyHeaders: false,
});

const router = Router();

// Create New Form
router.post("/", authenticate, createFormLimiter, createForm);

// Get Forms for a Specific User
router.get("/", authenticate, getFormsByUser);

// Get public form
router.get("/public/:slug", getPublicForm)

// Get Form By ID
router.get("/:formId",optionalAuthenticate, getFormById)

// Get Preview Form
router.get("/:formId/preview", authenticate, previewForm)

// publish form
router.patch("/:formId/publish", authenticate, publishForm);


// unpublish form
router.patch("/:formId/unpublish", authenticate, unpublishForm);


// nested fileds under forms
router.use("/:formId/fields", fieldRouter);


export default router;