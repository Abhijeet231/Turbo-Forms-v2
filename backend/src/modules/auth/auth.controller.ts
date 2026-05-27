import { usersTable } from "../../db/models/user.js";
import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../../db/index.js";
import { eq } from "drizzle-orm";
import { signupSchema, loginSchema } from "./auth.validation.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.utils.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import cookieOptions from "../../utils/cookieOptions.js";
import crypto from "node:crypto";


// ─── SIGNUP ──────────────────────────────────────────────────────────────────// 
export const signup = async (req: Request, res: Response) => {
    try {

        // validate body
        const parsed = signupSchema.safeParse(req.body)
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: parsed.error.issues,

            })
        }

        const { fullName, email, password } = parsed.data;

        // check for duplicate email
        const existingUser = await db.select({ id: usersTable.id })
            .from(usersTable)
            .where(eq(usersTable.email, email))

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            })
        }

        // hash password
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt)

        // handle optional profile image uplaod
        let profileImageUrl: string | null = null

        if (req.file) {
            const uploadImage = await uploadOnCloudinary(req.file.path)
            profileImageUrl = uploadImage?.secure_url || null

        }


        // insert user
        const [newUser] = await db.insert(usersTable).values({
            fullName,
            email,
            password: hashedPassword,
            profileImageUrl,
        }).returning({
            id: usersTable.id,
            fullName: usersTable.fullName,
            email: usersTable.email,
            profileImageUrl: usersTable.profileImageUrl,
            createdAt: usersTable.createdAt,
        })

        if (!newUser) {
            return res.status(500).json({
                success: false,
                message: "Failed to create user"
            })
        }

        // generate tokens
        const accessToken = generateAccessToken({
            id: newUser.id,
            email: newUser.email
        })

        const refreshToken = generateRefreshToken({
            id: newUser.id,
            email: newUser.email,

        })

        // hashing refresh toekn
        const hashedRefreshToken = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex")

        // how to compare it ? 
        // get the token from the cookie > then hash it using the same process > then compare both - stored one in db and one that you got from cookies...


        // saving hashed refresh token in DB
        await db.update(usersTable)
            .set({ refreshToken: hashedRefreshToken })
            .where(eq(usersTable.id, newUser.id))


        // set refresh token as httpOnly cookie
        res.cookie("refreshToken", refreshToken, cookieOptions)

        return res.status(201).json({
            success: true,
            message: "Account created successully",
            data: {
                user: newUser,
                accessToken,
                refreshToken
            },
        })

    } catch (error) {
        console.error("Signup error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


// ─── LOGIN ──────────────────────────────────────────────────────────────────// 
export const login = async (req: Request, res: Response) => {
    try {
        // validate body
        const parsed = loginSchema.safeParse(req.body)
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: parsed.error.issues,
            })
        };

        const { email, password } = parsed.data

        // find user 
        const [user] = await db.select(
            {
                id: usersTable.id,
                fullName: usersTable.fullName,
                email: usersTable.email,
                password: usersTable.password,
                profileImageUrl: usersTable.profileImageUrl,
                createdAt: usersTable.createdAt,
            }
        )
            .from(usersTable)
            .where(eq(usersTable.email, email))

        if (!user || !user.password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        // generate tokens
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,

        })

        const refreshToken = generateRefreshToken({
            id: user.id,
            email: user.email,

        })

        // hashing refresh toekn
        const hashedRefreshToken = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex")

        // saving refresh token in DB
        await db.update(usersTable)
            .set({ refreshToken: hashedRefreshToken })
            .where(eq(usersTable.id, user.id))


        // set reffresh token in cookies
        res.cookie("refreshToken", refreshToken, cookieOptions)

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            data: {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    profileImageUrl: user.profileImageUrl,
                    createdAt: user.createdAt,
                },
                accessToken,
                refreshToken
            },
        })

    } catch (error) {
        console.error("Login error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}


// ─── REFRESH TOKEN ──────────────────────────────────────────────────────────────────// 
export const refreshToken = async (req: Request, res: Response) => {
    try {
        let token: string | undefined

        // web support (cookie)
        if (req.cookies?.refreshToken) {
            token = req.cookies.refreshToken
        }

        // mobile suport
        if (!token &&
            req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1]
        }

        // no token found
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Refresh token missing"
            })
        }

        // verify refresh token 
        const payload = verifyRefreshToken(token) as {
            id: string
            email: string
        }


        // hashing incoming refresh token
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex")


        // finding user in db
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, payload.id))

        // user not found
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            })
        }


        // comparing tokens
        if (user.refreshToken !== hashedToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            })
        }

        // generating new access token
        const accessToken = generateAccessToken({ id: payload.id, email: payload.email })

        return res.status(200).json({
            success: true,
            data: { accessToken }
        })


    } catch (error) {
        console.error("Refresh token error:", error)

        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token",
        })
    }
}


// ─── GET ME ──────────────────────────────────────────────────────────────────// 
export const getMe = async (req: Request, res: Response) => {
    try {

        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            })
        }

        const [user] = await db
            .select({
                id: usersTable.id,
                fullName: usersTable.fullName,
                email: usersTable.email,
                profileImageUrl: usersTable.profileImageUrl,
                emailVerified: usersTable.emailVerified,
                createdAt: usersTable.createdAt
            })
            .from(usersTable)
            .where(eq(usersTable.id, req.user.id))

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        return res.status(200).json({
            success: true,
            data: { user }
        })

    } catch (error) {
        console.error("GetMe error:", error)

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}



// ─── LOG OUT ──────────────────────────────────────────────────────────────────// 
export const logout = async (req: Request, res: Response) => {
    try {

        // check authenticated user
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            })
        }

        // remove refresh token from DB
        await db
            .update(usersTable)
            .set({
                refreshToken: null,
            })
            .where(eq(usersTable.id, req.user.id))

        // clear refresh token cookie
        res.clearCookie("refreshToken", cookieOptions)

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        })

    } catch (error) {
        console.error("Logout error:", error)

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}