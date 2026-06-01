
import { Router } from "express";
import {
    createField,
    getFieldsByFormId,
    updateField,
    deleteField,
    reorderField,
} from "./form-field.controller.js";
import { authenticate, optionalAuthenticate } from "../../middlewares/auth.middleware.js";

const router = Router({ mergeParams: true }); // mergeParams: true → gives access to :formId from parent router

// GET    /api/forms/:formId/fields            → public if form is published
// POST   /api/forms/:formId/fields            → owner only
// PATCH  /api/forms/:formId/fields/:fieldId   → owner only
// DELETE /api/forms/:formId/fields/:fieldId   → owner only
// PATCH  /api/forms/:formId/fields/:fieldId/reorder → owner only

router.get("/", optionalAuthenticate, getFieldsByFormId);
router.post("/", authenticate, createField);
router.patch("/:fieldId", authenticate, updateField);
router.delete("/:fieldId", authenticate, deleteField);
router.patch("/:fieldId/reorder", authenticate, reorderField);

export default router;