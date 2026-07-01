import { useState, useEffect } from "react";
import type { FormField } from "@/schemas/form-field.schema";
import { getAllFields } from "@/services/form-field.service";


export const useGetAllFields = (formId: string) => {
    const [data, setData] = useState<FormField[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = async () => {
        setIsLoading(true);
        setError(null)
        try {
            const fields = await getAllFields(formId);
            setData(fields);
        } catch {
            setError("Failed to fetch fields");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (formId) fetch();
    }, [formId]);

    return { data, isLoading, error, refetch: fetch };
};
