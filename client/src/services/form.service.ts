import api from "@/services/api";
import type { CreateFormInput, UpdateFormInput, Form, PublicForm } from "@/schemas/form.schema";

// *** Mutations *** 
export const createForm = async (data: CreateFormInput): Promise<Form> => {
    const response = await api.post("/api/v1/forms", data);
    return response.data;
};

export const updateForm = async (id: string, data: UpdateFormInput): Promise<Form> => {
    const response = await api.patch(`/api/v1/forms/${id}`, data);
    return response.data;
}

export const deleteForm = async (id: string): Promise<void> => {
    await api.delete(`/api/v1/forms/${id}`);
};

export const publishForm = async (id: string): Promise<Form> => {
    const response = await api.post(`/api/v1/forms/${id}/publish`);
    return response.data;
}

export const unpublishForm = async (id: string): Promise<Form> => {
    const response = await api.post(`/api/v1/forms/${id}/unpublish`);
    return response.data;
}

// *** Querries ***

// get all forms for creator
export const getForms = async (): Promise<{ forms: Form[]; count: number }> => {
    const response = await api.get("/api/v1/forms");
    return response.data;
}

// get form by id for creator for preview ( only for creator )
export const getFormById = async (id: string): Promise<Form> => {
    const response = await api.get(`/api/v1/forms/${id}`);
    return response.data;
};

// get all publicly avaiable forms
export const getPublicForms = async (): Promise<Form[]> => {
    const response = await api.get("/api/v1/forms/public");
    return response.data;
};

// get single form which is publicly available (includes its ordered fields)
export const getPublicFormById = async (slug: string): Promise<PublicForm> => {
    const response = await api.get(`/api/v1/forms/slug/${slug}`);
    return response.data;
};