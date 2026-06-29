import { useState, useEffect } from "react";
import { getFormById } from "@/services/form.service";
import type { Form } from "@/schemas/form.schema";


export const useGetFormsById = (id: string) => {
    const [data, setData] = useState<Form | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = async () => {
        setIsLoading(true);
        try {
            const forms = await getFormById(id)
            setData(forms)
        } catch (error) {
            setError("Failed to fetch forms")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (id) fetch();
    }, [id]);

    return { data, isLoading, error, refetch: fetch }

}
