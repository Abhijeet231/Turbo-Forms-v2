import api from "@/services/api";
import {
    reorderFieldSchema,
    type CreateFieldInput,
    type UpdateFieldInput,
    type ReorderFieldInput,
    type FormField,
    createFieldSchema,
    updateFieldSchema,
    
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

    const parsed = createFieldSchema.safeParse(data);
    if (!parsed.success) {
        console.error("Error creating new filed")
        throw parsed.error
    }

    const response = await api.post(`/api/v1/forms/${formId}/fields`, parsed.data);
    return response.data;
};

// Update field
export const updateField = async (formId: string, fieldId: string, data: UpdateFieldInput): Promise<FormField> => {

    const parsed = updateFieldSchema.safeParse(data);
    if (!parsed.success) {
        console.error("Error updating filed")
        throw parsed.error
    }

    const response = await api.patch(`/api/v1/forms/${formId}/fields/${fieldId}`, parsed.data);
    return response.data;
};

// Reorder fields
export const reorderField = async (formId: string, fieldId: string, data: ReorderFieldInput): Promise<FormField> => {

    const parsed = reorderFieldSchema.safeParse(data);
    if (!parsed.success) {
        console.error("Error updating the order  filed")
        throw parsed.error
    }

    const response = await api.patch(`/api/v1/forms/${formId}/fields/${fieldId}/reorder`, data);
    return response.data;
};

// Delete field
export const deleteField = async (formId: string, fieldId: string): Promise<void> => {
    await api.delete(`/api/v1/forms/${formId}/fields/${fieldId}`);
};
