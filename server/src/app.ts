import express from "express"
import cors from "cors"
import { env } from "./config/env.js";
import { clerkMiddleware } from "@clerk/express"
import userRoutes from "./modules/user/user.routes.js"
import { errorHandler } from "./middleware/errorHandler.js";
import formRoutes from "./modules/form/form.route.js"
import formFieldRoutes from "./modules/form-field/form-field.routes.js"
import { formSubmitRouter, submissionsRouter } from "./modules/form-submission/form-submission.route.js";
import { apiLimiter } from "./middleware/rateLimiter.middleware.js";

const createApp = () => {

    const app = express();

    app.use(express.urlencoded({ extended: true }))
    app.use(cors(
        {
            origin: env.CORS_ORIGIN,
            credentials: true
        }

    ))
    app.use(clerkMiddleware())
    app.use(express.json())
    app.use(apiLimiter)



    // user routes
    app.use("/api/v1/user", userRoutes)

    // form routes
    app.use("/api/v1/forms", formRoutes)

    // form field routes
    app.use("/api/v1/forms/:formId/fields", formFieldRoutes)

    // form submit route  (public)
    app.use("/api/v1/forms", formSubmitRouter)

    // submissions routes (protected)
    app.use("/api/v1/submissions", submissionsRouter)

    // error handler 
    app.use(errorHandler)

    return app;

}

export default createApp;