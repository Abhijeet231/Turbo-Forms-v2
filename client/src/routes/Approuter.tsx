import { createBrowserRouter } from "react-router-dom";
import App from "@/App";

import Contact from "@/pages/Contact";
import Explore from "@/pages/Explore";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";

import Dashboard from "@/pages/dashboard/Dashboard";
import FormBuilder from "@/pages/form/FormBuilder";
import FormPreview from "@/pages/form/FormPreview";
import FormResponse from "@/pages/dashboard/FormResponse";

import Analytics from "@/pages/dashboard/Analytics";
import Submissions from "@/pages/dashboard/Submissions";
import Setting from "@/pages/dashboard/Setting";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";

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
      { path: "/dashboard",
         element: <DashboardLayout />,
         children: [
          {index: true, element: <Dashboard/>},
          {path: "analytics", element: <Analytics/>},
          {path: "submissions", element: <Submissions/>},
          {path: "settings", element: <Setting/>}
         ] 


      },
      { path: "/dashboard/forms/:id/edit", element: <FormBuilder /> },
      { path: "/dashboard/forms/:id/preview", element: <FormPreview /> },
      { path: "/dashboard/forms/:id/responses", element: <FormResponse /> },
    ],
  },

  {path: "*", element: <NotFound/>}

]);


export default router;
