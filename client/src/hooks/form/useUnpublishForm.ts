import { unpublishForm } from "@/services/form.service";
import { useState } from "react";
import { getApiErrorMessage } from "@/lib/apiError";

export const useUnpublishForm = (id: string) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const mutate = async () => {
        setIsLoading(true)
        setError(null)

        try {
            return await unpublishForm(id)
        } catch (error) {
            setError(getApiErrorMessage(error, "Failed to Unpublish the Form"))
            throw error;
        } finally {
            setIsLoading(false)
        }
    }
    return { mutate, isLoading, error }


}
