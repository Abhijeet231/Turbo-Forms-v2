import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";


export default function ProtectedRoute () {
    const {status} = useAuth();

    if(status === "loading") {
        return <div className="min-h-screen flex items-center justify-center">
            Checking Authentication....
        </div>
    }

    if(status !== "authenticated") {
        return <Navigate to='/login' replace/>
    }

    return <Outlet/>
}