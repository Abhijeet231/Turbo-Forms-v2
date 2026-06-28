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


export default api;
