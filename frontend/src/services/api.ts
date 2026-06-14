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

        // Don't retry or redirect for public routes
        const publicRoutes = ["/api/forms/public/"];
        const isPublicRoute = publicRoutes.some((route) =>
            original.url?.includes(route)
        );

        if (error.response?.status === 401 && !original._retry && !isPublicRoute) {
            original._retry = true;

            try {
                const res = await api.post("/api/auth/refresh-token");
                const newToken = res.data.data.accessToken;

                setAccessToken(newToken);
                original.headers.Authorization = `Bearer ${newToken}`;

                return api(original);

            } catch (refreshError) {
                // Only redirect to login if we're NOT on a public page
                const isPublicPage = window.location.pathname.startsWith("/f/");
                if (!isPublicPage) {
                    setAccessToken(null);
                    localStorage.removeItem("isAuthenticated");
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error)
    }
)


export default api;