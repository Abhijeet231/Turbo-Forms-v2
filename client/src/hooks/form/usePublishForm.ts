import { publishForm } from "@/services/form.service";
import { useState } from "react";
import { getApiErrorMessage } from "@/lib/apiError";

export const usePublishForm = (id: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = async () => {
        setIsLoading(true)
         setError(null)
        try {
            return await publishForm(id);

        } catch (error) {
            setError(getApiErrorMessage(error, "Failed to Publish the Form"))
            throw error;
        } finally {
            setIsLoading(false)
        }
    }

    return { mutate, isLoading, error }

}
