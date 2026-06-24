import express from "express"
import cors from "cors"
import { env } from "./config/env.js";

const createApp = () => {

    const app = express();
    app.use(express.urlencoded({ extended: true }))


    app.use(cors(
        {
            origin: env.CORS_ORIGIN,
            credentials: true
        }

    ))

    app.use(express.json())


    // health route
    app.get('/health', (req, res) => {
        res.json({
            message: "hi i am healthy"
        })
    })

    return app;

}

export default createApp;