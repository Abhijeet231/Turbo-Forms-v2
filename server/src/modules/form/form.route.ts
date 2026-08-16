import { Router } from "express";
import {
    createForm,
    deleteForm,
    getAllForms,
    getAllPublicForms,
    getFormByIdForCreator,
    getPublicForm,
    publishForm,
    unpublishForm,
    updateForm
} from "./form.controller.js";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { publicReadLimiter } from "../../middleware/rateLimiter.middleware.js";


const router = Router();

// private routes
router.get("/", requireAuth, getAllForms)
router.post("/", requireAuth, createForm)

// public routes
router.get("/public", publicReadLimiter, getAllPublicForms)
router.get("/slug/:slug", publicReadLimiter, getPublicForm)

// private
router.get("/:id", requireAuth, getFormByIdForCreator)
router.patch("/:id", requireAuth, updateForm)
router.delete("/:id", requireAuth, deleteForm)
router.post("/:id/publish", requireAuth, publishForm)
router.post("/:id/unpublish", requireAuth, unpublishForm)


export default router;
