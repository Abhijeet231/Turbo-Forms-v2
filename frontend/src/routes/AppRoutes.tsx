import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/user/Dashboard";
import Templates from "../pages/user/Templates";
import Responses from "../pages/user/Responses";
import About from "../pages/publicc/About";
import Contact from "../pages/publicc/Contact";
import Profile from "../pages/user/Profile";
import Landing from "../pages/publicc/Landing";
import ProtectedRoute from "./ProtectedRoutes";
import DashboardLayout from "../components/layout/DashboardLayout";

const router = createBrowserRouter([
  // ── Auth pages (no layout at all) ──────────────────────────
  { path: "/login",    element: <Login /> },
  { path: "/register", element: <Register /> },

  // ── Public layout (App.tsx with navbar) ────────────────────
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: "about",   element: <About /> },
      { path: "contact", element: <Contact /> },
    ],
  },

  // ── App layout (DashboardLayout — NO public navbar) ────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "dashboard",  element: <Dashboard /> },
          { path: "templates",  element: <Templates /> },
          { path: "responses",  element: <Responses /> },
          { path: "profile",    element: <Profile /> },
        ],
      },
    ],
  },
]);

export default router;