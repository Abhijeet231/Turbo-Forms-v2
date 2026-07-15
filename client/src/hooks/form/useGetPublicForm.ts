import { useState, useEffect } from "react";
import { getPublicFormById } from "@/services/form.service";
import type { PublicForm } from "@/schemas/form.schema";
import { getApiErrorMessage } from "@/lib/apiError";

// Fetch a published, public form (with its fields) by slug. No auth required.
export const useGetPublicForm = (slug: string) => {
    const [data, setData] = useState<PublicForm | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const form = await getPublicFormById(slug);
            setData(form);
        } catch (error) {
            setError(getApiErrorMessage(error, "This form is not available"));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (slug) fetch();
    }, [slug]);

    return { data, isLoading, error, refetch: fetch };
};
