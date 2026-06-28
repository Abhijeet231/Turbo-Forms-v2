import { Outlet } from "react-router-dom";
import Navbar from "./components/general/Navbar";
import Footer from "./components/general/Footer";

import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import { setAuthTOken } from "./services/api";
import { syncUser } from "./services/user.service";

export const AuthSync = () => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const init = async () => {
      if (isSignedIn) {
        const token = await getToken();
        if (!token) return;
        setAuthTOken(token);
        await syncUser();
      } else {
        setAuthTOken(null);
      }
    };

    init();
  }, [isSignedIn, getToken]);

  return null;
};

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
