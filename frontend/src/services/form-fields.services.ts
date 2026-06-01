import api from "./api";
import {
    type CreateFieldPayload,
    type CreateFieldResponse,
    type DeleteFieldResponse,
    type GetFieldsResponse,
    type ReorderFieldPayload,
    type ReorderFieldResponse,
    type UpdateFieldPayload,
    type UpdateFieldResponse,
} from "../types/form-fields.types";

// Get all fields for a form
export const getFieldsByFormId = (formId: string) => {
    return api.get<GetFieldsResponse>(`/api/forms/${formId}/fields`);
};

// Create a new field (appended to end)
export const createField = (formId: string, payload: CreateFieldPayload) => {
    return api.post<CreateFieldResponse>(`/api/forms/${formId}/fields`, payload);
};

// Update a field (type cannot be changed)
export const updateField = (formId: string, fieldId: string, payload: UpdateFieldPayload) => {
    return api.patch<UpdateFieldResponse>(`/api/forms/${formId}/fields/${fieldId}`, payload);
};

// Delete a field
export const deleteField = (formId: string, fieldId: string) => {
    return api.delete<DeleteFieldResponse>(`/api/forms/${formId}/fields/${fieldId}`);
};

// Reorder a field - send prevOrder and nextOrder, backend generates the new fractional key
export const reorderField = (formId: string, fieldId: string, payload: ReorderFieldPayload) => {
    return api.patch<ReorderFieldResponse>(
        `/api/forms/${formId}/fields/${fieldId}/reorder`,
        payload
    );
};