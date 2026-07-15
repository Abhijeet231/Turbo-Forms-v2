import { useState, useEffect } from "react";
import { getSubmissionById } from "@/services/form-submission.service";
import type { SubmissionWithAnswers } from "@/schemas/form-submission";
import { getApiErrorMessage } from "@/lib/apiError";

export const useGetSubmissionById = (submissionId: string) => {
    const [data, setData] = useState<SubmissionWithAnswers | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = async () => {
        setIsLoading(true);
        try {
            const submission = await getSubmissionById(submissionId);
            setData(submission);
        } catch (error) {
            setError(getApiErrorMessage(error, "Failed to fetch submission"));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (submissionId) fetch();
    }, [submissionId]);

    return { data, isLoading, error, refetch: fetch };
};
