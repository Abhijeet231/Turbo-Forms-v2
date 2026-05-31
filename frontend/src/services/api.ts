import axios from "axios";
import { env } from "../config/env";

const api = axios.create({
    baseURL: env.VITE_API_BASE_URL,
    withCredentials: true 
});

export default api;

// interceptors here ...