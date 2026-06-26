// verify clerk token, attach user to req
import { type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const { userId } = getAuth(req)

    if (!userId) {
        return res.status(401).json({
            error: "Unauthorized"
        })
    }

    res.locals.userId = userId;

    next();
}
