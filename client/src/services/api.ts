import axios from "axios"
import { env } from "@/config/env"

const api = axios.create({
    baseURL: env.VITE_API_BASE_URL,
    withCredentials: true
});

export const setAuthTOken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"]
    }
}

let getTokenFn: (() => Promise<string | null>) | null = null;

export const registerTokenGetter = (fn: () => Promise<string | null>) => {
    getTokenFn = fn;
}

api.interceptors.request.use(async (config) => {
    if (getTokenFn) {
        const token = await getTokenFn();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});


export default api;
