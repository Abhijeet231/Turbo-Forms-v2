import axios from "axios";
import { env } from "../config/env";

const api = axios.create({
    baseURL: env.VITE_API_BASE_URL,
    withCredentials: true 
});


// interceptors here ...

let accessToken: string | null = null
export const setAccessToken = (token: string | null) => { accessToken = token }
export const getAccessToken = () => accessToken

// attach token to every request
api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

// response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            try {
                const res = await api.post("/api/auth/refresh-token")
                const newToken = res.data.data.accessToken

                setAccessToken(newToken) // ← store new token
                original.headers.Authorization = `Bearer ${newToken}` // ← patch retry request

                return api(original) // ← retry original request

            } catch (refreshError) {
                setAccessToken(null)
                localStorage.removeItem("isAuthenticated")
                window.location.href = "/login"
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)


export default api;