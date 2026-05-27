import {type Request, type Response, type NextFunction } from "express"

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500
  const message = err.isOperational ? err.message : "Internal server error"

  if (process.env.NODE_ENV === "development") {
    console.error(`[ERROR] ${req.method} ${req.url}`, {
      message: err.message,
      stack: err.stack,
      statusCode,
    })
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

// for throwing errors from anywhere in the app
export class ApiError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}