import { type Request, type Response, type NextFunction } from "express";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    console.error(`[${req.method}] ${req.path} -- ${err.message}`);
    console.error(err.stack)


    // handle known errors
    if (err.message === "User not found") {
        return res.status(404).json({ error: err.message })
    }

    if (err.message === "Form not found or unauthorized") {
        return res.status(404).json({ error: err.message })
    }

    // everything else is a server error
    res.status(500).json({ error: "Internal Server Error" })

}