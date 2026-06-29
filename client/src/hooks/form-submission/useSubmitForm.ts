import { submitForm } from "@/services/form-submission.service";
import { useState } from "react";
import type { SubmitFormInput, FormSubmission } from "@/schemas/form-submission";


export const useSubmitForm = (formId: string) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const mutate = async (data: SubmitFormInput): Promise<FormSubmission> => {

        setIsLoading(true)
        setError(null)

        try {
            return await submitForm(formId, data)
        } catch (error) {
            setError("Failed to submit form")
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return { mutate, isLoading, error }
}
