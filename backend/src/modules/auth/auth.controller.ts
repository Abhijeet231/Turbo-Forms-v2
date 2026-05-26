import { usersTable } from "../../db/models/user.js";
import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../../db/index.js";
import { eq } from "drizzle-orm";
import { signupSchema, loginSchema } from "./auth.validation.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.utils.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import cookieOptions from "../../utils/cookieOptions.js";


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
            salt,
            password: hashedPassword,
            profileImageUrl
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

        // set refresh token as httpOnly cookie
        res.cookie("refreshToken", refreshToken, cookieOptions)

        return res.status(201).json({
            success: true,
            message: "Account created successully",
            data: {
                user: newUser,
                accessToken
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
        const [user] = await db.select()
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
                accessToken
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