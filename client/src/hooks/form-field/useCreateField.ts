import { useState } from "react";
import {createField} from "@/services/form-field.service"
import type { CreateFieldInput } from "@/schemas/form-field.schema";

export const useCreateField = (formId:string) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null> (null)

    const mutate = async (data: CreateFieldInput) => {
        setIsLoading(true)
        setError(null)

        try {
            return await createField(formId, data)
        } catch (error) {
            setError("Failed to Create a filed")
            throw error;
        } finally {
            setIsLoading(false)
        }
    }

    return {mutate, isLoading, error}

}
