//----------------------------------------------------------------------REQUEST TYPINGS-------------------------------------------------------------------------------//

// REGISTER Credentials TYPES
export interface RegisterCredentials {
    fullName: string;
    email: string;
    password: string;
    profileImageUrl?: File;
}


// LOGIN Credentials TYPES
export interface LoginCredentials {
    email: string;
    password: string
}

//----------------------------------------------------------------------RESPONSE TYPINGS-------------------------------------------------------------------------------//


// response user type
export interface User {
    id: string;
    fullName: string;
    email: string;
    profileImageUrl?: string | null;
    createdAt: string;
}


// AUTH RESPONSE TYPE
export interface AuthResponse {
    success: boolean;
    message: string;

    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    }
}

// LOGOUT RESPONSE 
export interface LogoutResponse {
    success: boolean;
    message: string;
}

// GET ME RESPONSE
export interface GetMe {
    success: boolean;
    data: {
        user: User
    }
}

// REFRESH TOKEN RESPONSE
export interface RefreshToken {
    success: boolean;
    data: {
        accessToken: string;
    }
}