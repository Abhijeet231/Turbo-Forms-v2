import { useState, useEffect } from "react";
import { getFormSubmissions } from "@/services/form-submission.service";
import type { FormSubmission } from "@/schemas/form-submission";
import { getApiErrorMessage } from "@/lib/apiError";

export const useGetFormSubmissions = (formId: string) => {
    const [data, setData] = useState<FormSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = async () => {
        setIsLoading(true);
        try {
            const submissions = await getFormSubmissions(formId);
            setData(submissions);
        } catch (error) {
            setError(getApiErrorMessage(error, "Failed to fetch submissions"));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (formId) fetch();
    }, [formId]);

    return { data, isLoading, error, refetch: fetch };
};
