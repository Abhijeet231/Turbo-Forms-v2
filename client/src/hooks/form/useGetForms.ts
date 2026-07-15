import { useState, useEffect } from "react";
import { getForms } from "@/services/form.service";
import type { Form } from "@/schemas/form.schema";
import { getApiErrorMessage } from "@/lib/apiError";


export const useGetForms = () => {
    const [data, setData] = useState<Form[]> ([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState < string | null> (null);

    const fetch = async () => {
        setIsLoading(true);
        try {
            const response = await getForms()
            setData(response.forms)
            setCount(response.count)
        } catch (error) {
            setError(getApiErrorMessage(error, "Failed to fetch forms"))
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetch()
    }, [])

    return {data, count, isLoading, error, refetch: fetch}

}
