import api from "./api";
import { type RegisterCredentials, type LoginCredentials, type AuthResponse, type LogoutResponse, type GetMe, type RefreshToken } from "../types/auth.types.ts";


// Register
export const register = (credentials: RegisterCredentials) => {

    const formData = new FormData();

    formData.append("fullName", credentials.fullName);
    formData.append("email", credentials.email);
    formData.append("password", credentials.password);

    if (credentials.profileImageUrl) {
        formData.append("profileImage", credentials.profileImageUrl)
    }


    return api.post<AuthResponse>("/api/auth/signup", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
};

// Login
export const login = (credentials: LoginCredentials) => {
    return api.post<AuthResponse>("/api/auth/login", credentials)
};

// Logout
export const logout = () => {
    return api.post<LogoutResponse>("/api/auth/logout")
};

// GetMe
export const getMe = () => {
    return api.get<GetMe>("/api/auth/me")
}

// Refresh-token
export const refreshToken = () => {
    return api.post<RefreshToken>("/api/auth/refresh-token")
}