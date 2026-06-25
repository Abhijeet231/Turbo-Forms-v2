import express from "express"
import cors from "cors"
import { env } from "./config/env.js";
import { clerkMiddleware } from "@clerk/express"
import userRoutes from "./modules/user/user.routes.js"

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

    app.use("/api/v1/user", userRoutes)

    return app;

}

export default createApp;