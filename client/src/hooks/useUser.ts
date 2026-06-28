import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";
import { syncUser } from "@/services/user.service";

export const useSyncUser = () => {

    const {isSignedIn, getToken} = useAuth();
    const [isSynced, setIsSynced] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null> (null)

    useEffect(() => {
        const sync = async () => {
            if(!isSignedIn) return;

            try {
                setIsLoading(true)
                const token = await getToken()
                if(!token) return;

                await syncUser(token)
                setIsSynced(true)
            } catch (error) {
                setError("Failed to Sync User")
                console.error(error)
            } finally{
                setIsLoading(false)
            }
        };

        sync();
    }, [isSignedIn])

    return {isSynced, isLoading, error}
}