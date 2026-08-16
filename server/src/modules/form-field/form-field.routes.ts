import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
    createField,
    deleteField,
    getFields,
    reorderField,
    updateField
} from "./form-field.controller.js"

const router = Router({mergeParams: true});

router.use(requireAuth);

router.patch("/:fieldId/reorder", reorderField);

router.post("/", createField);
router.get("/", getFields);
router.patch("/:fieldId", updateField);
router.delete("/:fieldId", deleteField);

export default router;
