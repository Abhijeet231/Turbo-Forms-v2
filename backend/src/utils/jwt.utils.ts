import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

//  Defining payload Type
export interface AuthPayload {
    id: string;
    email: string;
}

// Create AccessToken
const generateAccessToken = (payload: AuthPayload): string => {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRY
    }as SignOptions)
}

// Verify AccessToken
const verifyAccessToken = (token: string) : AuthPayload => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload
}

// Create RefreshToken
const generateRefreshToken = (payload: AuthPayload): string => {
     return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRY,
    }as SignOptions)
}

// Verify Refresh token
const verifyRefreshToken = (token: string):AuthPayload => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as AuthPayload
}

export {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken}