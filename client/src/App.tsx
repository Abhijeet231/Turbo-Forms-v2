import { Outlet } from "react-router-dom";
import Navbar from "./components/general/Navbar";
import Footer from "./components/general/Footer";

import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import { syncUser } from "./services/user.service";
import { useRegisterAuthToken } from "./hooks/auth/useRegisterAuthToken";

export const AuthSync = () => {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      syncUser();
    }
  }, [isSignedIn]);

  return null;
};

const App = () => {
  useRegisterAuthToken();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AuthSync />
    </div>
  );
};

export default App;
