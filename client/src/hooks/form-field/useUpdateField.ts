import { useState } from "react";
import type { UpdateFieldInput } from "@/schemas/form-field.schema";
import { updateField } from "@/services/form-field.service";
import { getApiErrorMessage } from "@/lib/apiError";

export const useUpdateField = (formId: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = async (fieldId: string, data: UpdateFieldInput) => {
        setIsLoading(true);
        setError(null);
        try {
            return await updateField(formId, fieldId, data);
        } catch (error) {
            setError(getApiErrorMessage(error, "Failed to update field"));
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { mutate, isLoading, error };
};
