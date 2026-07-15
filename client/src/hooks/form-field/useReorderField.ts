import { useState } from "react";
import type { ReorderFieldInput } from "@/schemas/form-field.schema";
import { reorderField } from '@/services/form-field.service'
import { getApiErrorMessage } from "@/lib/apiError";

export const useReorderField = (formId: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = async (fieldId: string, data: ReorderFieldInput) => {
        setIsLoading(true);
        setError(null);
        try {
            return await reorderField(formId, fieldId, data);
        } catch (error) {
            setError(getApiErrorMessage(error, "Failed to reorder field"));
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { mutate, isLoading, error };
};
