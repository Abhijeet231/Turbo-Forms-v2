import { Router } from "express"
import { signup, login, refreshToken, logout, getMe } from "./auth.controller.js"
import { authenticate } from "../../middlewares/auth.middleware.js"
import { uploadProfile } from "../../middlewares/multer.middleware.js"

const router = Router()


router.post("/signup", uploadProfile.single("profileImage"), signup)


router.post("/login", login)


router.post("/refresh-token", refreshToken)


router.post("/logout",authenticate, logout)


router.get("/me", authenticate, getMe)

export default router