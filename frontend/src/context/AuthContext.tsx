import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import {
  login as loginService,
  logout as logoutService,
  getMe,
} from "../services/auth.service.ts";

import type {
  User,
  LoginCredentials,
  AuthResponse,
} from "../types/auth.types.ts";
import { toast } from "react-toastify";

//================================================================================================================================================
type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextType = {
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;

  login: (credentials: LoginCredentials) => Promise<AuthResponse>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

// =========================
// CONTEXT
// =========================

// Create Context
const AuthContext = createContext<AuthContextType | null>(null);

// =========================
// PROVIDER
// =========================
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // =========================
  // CHECK AUTH
  // =========================
  const checkAuth = useCallback(async () => {
    try {
      setStatus("loading");

      const res = await getMe();

      console.log("Response for getme:", res);

      setUser(res.data.data.user);

      setStatus("authenticated");
    } catch (error) {
      console.log("Auth check failed");

      setUser(null);

      setStatus("unauthenticated");
    }
  }, []);

  // =========================
  // INITIAL AUTH CHECK
  // =========================
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // =========================
  // LOGIN
  // =========================
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResponse> => {
      try {
        const res = await loginService(credentials);

        setUser(res.data.data.user);

        setStatus("authenticated");

        toast.success("Login Successful");

        return res.data;
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Login failed");

        throw error;
      }
    },
    [],
  );

  // =========================
  // LOGOUT
  // =========================

  const logout = useCallback(async () => {
    try {
      await logoutService();

      setUser(null);

      setStatus("unauthenticated");

      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");

      throw error;
    }
  }, []);

  // =========================
  // CONTEXT VALUE
  // =========================

  const value: AuthContextType = {
    user,

    status,

    isAuthenticated: status === "authenticated",

    login,

    logout,

    refreshUser: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// =========================
// CUSTOM HOOK
// =========================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
