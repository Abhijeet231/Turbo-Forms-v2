import api from "@/services/api";
import type { 
    CreateFieldInput, 
    UpdateFieldInput, 
    ReorderFieldInput, 
    FormField 
} from "@/schemas/form-field.schema";

// *** Queries ***

// Get all fields
export const getAllFields = async (formId: string): Promise<FormField[]> => {
    const response = await api.get(`/api/v1/forms/${formId}/fields`);
    return response.data;
};

// *** Mutations ***

// Create field
export const createField = async (formId: string, data: CreateFieldInput): Promise<FormField> => {
    const response = await api.post(`/api/v1/forms/${formId}/fields`, data);
    return response.data;
};

// Update field
export const updateField = async (formId: string, fieldId: string, data: UpdateFieldInput): Promise<FormField> => {
    const response = await api.patch(`/api/v1/forms/${formId}/fields/${fieldId}`, data);
    return response.data;
};

// Reorder fields
export const reorderField = async (formId: string, fieldId: string, data: ReorderFieldInput): Promise<FormField> => {
    const response = await api.patch(`/api/v1/forms/${formId}/fields/${fieldId}/reorder`, data);
    return response.data;
};

// Delete field
export const deleteField = async (formId: string, fieldId: string): Promise<void> => {
    await api.delete(`/api/v1/forms/${formId}/fields/${fieldId}`);
};
