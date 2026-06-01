import type { Request, Response, NextFunction } from "express"
import { verifyAccessToken } from "../utils/jwt.utils.js"

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    // get authorization header
    const authHeader = req.headers.authorization

    // check header existence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      })
    }

    // extract token
    const token = authHeader.split(" ")[1]

    // extra safety check
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token format",
      })
    }

    // verify token
    const payload = verifyAccessToken(token) as {
      id: string
      email: string
    }

    // validate payload
    if (!payload?.id || !payload?.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      })
    }

    // attach user to request
    req.user = {
      id: payload.id,
      email: payload.email,
    }

    next()

  } catch (error) {
    console.error("Auth middleware error:", error)

    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    })
  }
}

// Optional authenticate middleware
export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return next();
    
    try {
        const decoded = verifyAccessToken(token) as { id: string; email: string };
        if (decoded?.id && decoded?.email) {
            req.user = { id: decoded.id, email: decoded.email };
        }
    } catch {
        // invalid token - ignore:)
    }
    next();
};
