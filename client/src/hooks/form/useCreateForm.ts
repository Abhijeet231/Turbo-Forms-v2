import { useState } from "react";
import { createForm } from "@/services/form.service";
import type { CreateFormInput } from "@/schemas/form.schema";

export const useCreateForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const mutate = async (data: CreateFormInput) => {
        setIsLoading(true)
        setError(null)

        try {
            return await createForm(data);
        } catch (error) {
            setError("Failed to Create Form")
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return { mutate, isLoading, error }

}