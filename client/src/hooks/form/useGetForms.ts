import { useState, useEffect } from "react";
import { getForms } from "@/services/form.service";
import type { Form } from "@/schemas/form.schema";


export const useGetForms = () => {
    const [data, setData] = useState<Form[]> ([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState < string | null> (null);

    const fetch = async () => {
        setIsLoading(true);
        try {
            const forms = await getForms()
            setData(forms)
        } catch (error) {
            setError("Failed to fetch forms")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetch()
    }, [])

    return {data, isLoading, error, refetch: fetch}

}
