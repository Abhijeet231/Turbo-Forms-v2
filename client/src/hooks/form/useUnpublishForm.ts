import { unpublishForm } from "@/services/form.service";
import { useState } from "react";

export const useUnpublishForm = (id: string) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const mutate = async () => {
        setIsLoading(true)
        setError(null)

        try {
            return await unpublishForm(id)
        } catch (error) {
            setError("Failed to Unpublish the Form")
        } finally {
            setIsLoading(false)
        }
    }
    return { mutate, isLoading, error }


}