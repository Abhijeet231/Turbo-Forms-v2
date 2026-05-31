import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/user/Dashboard";
import About from "../pages/publicc/About";
import Contact from "../pages/publicc/Contact";
import Profile from "../pages/user/Profile";
import Landing from "../pages/publicc/Landing";
import ProtectedRoute from "./ProtectedRoutes";

const router = createBrowserRouter([
  // Auth Pages
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // Main Layout
  {
    path: "/",
    element: <App />,
    children: [
      // public
      { index: true, element: <Landing /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },

      // Protected Routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
]);

export default router;