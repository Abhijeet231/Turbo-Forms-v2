import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const createApp = () => {

    const app = express();

    // Middlewares 

    app.use(cors(
        {
            origin: process.env.CORS_ORIGIN,
            credentials: true
        }
    ))

    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    app.use(express.static("public"))
    app.use(cookieParser())
    


    // Routes


    // Error handling


    return app;
}

export default createApp;