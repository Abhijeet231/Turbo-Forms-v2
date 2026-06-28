import api from "@/services/api";

// this just triggers the create-if-not-exists logic on backend
// no request body needed, clerk token handles identity
export const syncUser = async (token: string) => {
    const response = await api.get("/api/v1/users/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};