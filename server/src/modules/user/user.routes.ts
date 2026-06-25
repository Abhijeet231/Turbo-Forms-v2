import { Router } from "express";
import {getCurrentUser} from "./user.controller.js"
import {requireAuth} from "../../middleware/auth.middleware.js";

const route = Router()

// create or get user
route.get("/me",requireAuth, getCurrentUser)

export default route;
