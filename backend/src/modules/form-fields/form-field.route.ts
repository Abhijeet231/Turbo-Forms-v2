
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


router.get("/", optionalAuthenticate, getFieldsByFormId);
router.post("/", authenticate, createField);
router.patch("/:fieldId", authenticate, updateField);
router.delete("/:fieldId", authenticate, deleteField);
router.patch("/:fieldId/reorder", authenticate, reorderField);

export default router;