import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { registerTokenGetter } from "@/services/api"; 

export const useRegisterAuthToken = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    registerTokenGetter(getToken);
  }, [getToken]);
};
