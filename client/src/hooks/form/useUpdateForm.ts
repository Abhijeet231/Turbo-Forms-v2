import { updateForm } from "@/services/form.service"
import { useState } from "react"
import type { UpdateFormInput } from "@/schemas/form.schema";


export const useUpdateForm = (id: string) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const mutate = async (data: UpdateFormInput) => {
        setIsLoading(true)
        setError(null)
        try {
            return await updateForm(id, data)
        } catch (error) {
            setError("Failed to Update form")
            throw error;
        } finally {
            setIsLoading(false)
        }
    }

    return { mutate, isLoading, error }
}
