import express from "express";
import { apiReference } from "@scalar/express-api-reference";
import { openApiSpecification } from "./docs/swageer.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.route.js"
import { errorHandler } from "./middlewares/error.middleware.js";


const createApp = () => {

    const app = express();

    // ── Core Middlewares ──────────────────────────────────────────────

    app.use(cors(
        {
            origin: process.env.CORS_ORIGIN,
            credentials: true
        }
    ))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static("public"))
    app.use(cookieParser())


    // ── API Docs (Scalar) ─────────────────────────────────────────────
    app.use("/docs", apiReference({
        content: openApiSpecification,
    }))



    // ── Routes ────────────────────────────────────────────────────────
    app.use("/api/auth", authRouter)


    // ── 404 Handler ───────────────────────────────────────────────────
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: `Route ${req.method} ${req.url} not found`,
        })
    })

    // ── Global Error Handler ──────────────────────────────────────────
    // MUST be last, MUST have 4 params (err, req, res, next)
    app.use(errorHandler)

    return app;
}

export default createApp;