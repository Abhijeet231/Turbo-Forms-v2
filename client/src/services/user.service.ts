import api from "@/services/api";

// this just triggers the create-if-not-exists logic on backend
// no request body needed, clerk token handles identity
export const syncUser = async () => {
    const response = await api.get("/api/v1/user/me");
    return response.data;
};
