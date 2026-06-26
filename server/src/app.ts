import express from "express"
import cors from "cors"
import { env } from "./config/env.js";
import { clerkMiddleware } from "@clerk/express"
import userRoutes from "./modules/user/user.routes.js"
import { errorHandler } from "./middleware/errorHandler.js";


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


    // health route
    app.get('/health', (req, res) => {
        res.json({
            message: "hi i am healthy"
        })
    })

    // user routes
    app.use("/api/v1/user", userRoutes)



    // error handler route
    app.use(errorHandler)

    return app;

}

export default createApp;