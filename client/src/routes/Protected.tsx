import { useAuth } from "@clerk/react";
import { Navigate, Outlet } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return;
    <div className="flex flex-col gap-4 p-8 w-full h-screen">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>;
  }

  return isSignedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
