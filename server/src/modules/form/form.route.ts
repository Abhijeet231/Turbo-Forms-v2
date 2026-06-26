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
import route from "../user/user.routes.js";


const router = Router();

// private routes
route.get("/", requireAuth, getAllForms)
route.post("/", requireAuth, createForm)

// public routes
route.get("/public", getAllPublicForms)
route.get("/slug/:slug", getPublicForm)

// private
router.get("/:id", requireAuth, getFormByIdForCreator)
route.patch("/:id", requireAuth, updateForm)
route.delete("/:id", requireAuth, deleteForm)
route.post("/:id/publish", requireAuth, publishForm)
route.post("/:id/unpublish", requireAuth, unpublishForm)


export default router;
