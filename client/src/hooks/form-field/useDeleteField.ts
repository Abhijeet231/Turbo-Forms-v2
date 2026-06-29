import { useState } from "react";
import { deleteField } from "@/services/form-field.service"

export const useDeleteField = (formId: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = async (fieldId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await deleteField(formId, fieldId);
        } catch (error) {
            setError("Failed to delete field");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { mutate, isLoading, error };
};
