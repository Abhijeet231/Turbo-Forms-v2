import { publishForm } from "@/services/form.service";
import { useState } from "react";

export const usePublishForm = (id: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = async () => {
        setIsLoading(true)
         setError(null)
        try {
            return await publishForm(id);

        } catch (error) {
            setError("Failed to Publish the Form")
        } finally {
            setIsLoading(false)
        }
    }

    return { mutate, isLoading, error }

}