export interface SignupBody {
    fullName: string
    email: string
    password: string
}

export interface LoginBody {
    email: string
    password: string
}

// what gets attached to req after JWT verification
export interface AuthenticatedUser {
    id: string
    email: string
}

// extended Express Request type so req.user works everywhere
declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser
        }
    }
}