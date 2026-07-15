import { deleteForm } from "@/services/form.service";
import { useState } from "react";
import { getApiErrorMessage } from "@/lib/apiError";

export const useDeleteForm = (id: string) => {
    const [isLoading, setIsLoading] = useState(false) // for mutation initial state should be false
    const [error, setError] = useState<string | null>(null)

    const mutate = async () => {
        setIsLoading(true)
        setError(null)
        try {
            await deleteForm(id)

        } catch (error) {
            setError(getApiErrorMessage(error, "Failed to Delete the form"))
            throw error;
        } finally {
            setIsLoading(false)
        }
    }

    return {mutate, isLoading, error}

}

// How to use this in individual delete case 


// const { id } = useParams();
// const { mutate, isLoading, error } = useDeleteForm(id!);

// // to trigger delete
// const handleDelete = () => {
//     mutate();   //  no id needed, hook already got it
// }


// *** how to use in buld delete case

// const { mutate, isLoading, error } = useDeleteForm();

// mutate(id);  // pass id to delete function at click time , this is the bettr way to do it. where you got list of forms and want to delete any of them.

