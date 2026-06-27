import { createBrowserRouter } from "react-router-dom";
import App from "@/App";

import Contact from "@/pages/Contact";
import Explore from "@/pages/Explore";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";

import Dashboard from "@/pages/dashboard/Dashboard";
import FormBuilder from "@/pages/dashboard/FormBuilder";
import FormPreview from "@/pages/dashboard/FormPreview";
import FormResponse from "@/pages/dashboard/FormResponse";

import FormPage from "@/pages/shared/FormPage";
import ProtectedRoute from "./Protected";

const router = createBrowserRouter([
  // *** Public pages ***

  { path: "/f/:slug", element: <FormPage /> },

  {
    path: "/",
    element: <App />,
    errorElement: <NotFound/>,
    children: [
      { index: true, element: <Landing /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "explore", element: <Explore /> },
      { path: "pricing", element: <Pricing /> },
    ],
  },

  // *** Protected pages ***

  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/dashboard/forms/:id/edit", element: <FormBuilder /> },
      { path: "/dashboard/forms/:id/preview", element: <FormPreview /> },
      { path: "/dashboard/forms/:id/responses", element: <FormResponse /> },
    ],
  },

  {path: "*", element: <NotFound/>}

]);


export default router;
