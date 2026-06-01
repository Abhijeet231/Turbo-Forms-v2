import api from "./api";
import {
    type CreateFormPayload,
    type CreateFormResponse,
    type GetFormsResponse,
    type GetFormByIdResponse,
    type PublishFormPayload,
    type PublishFormResponse,
    type UnpublishFormResponse,
} from "../types/form.types";

// Create a new form
export const createForm = (payload: CreateFormPayload) => {
    return api.post<CreateFormResponse>("/api/forms", payload);
};

// Get all forms for the authenticated user
export const getFormsByUser = () => {
    return api.get<GetFormsResponse>("/api/forms");
};

// Get a single form by ID
export const getFormById = (formId: string) => {
    return api.get<GetFormByIdResponse>(`/api/forms/${formId}`);
};

// Publish a form
export const publishForm = (formId: string, payload: PublishFormPayload) => {
    return api.patch<PublishFormResponse>(`/api/forms/${formId}/publish`, payload);
};

// Unpublish a form
export const unpublishForm = (formId: string) => {
    return api.patch<UnpublishFormResponse>(`/api/forms/${formId}/unpublish`);
};