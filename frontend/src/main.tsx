import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRoutes.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { Toaster } from "sonner";
import "@tabler/icons-webfont/dist/tabler-icons.min.css";

createRoot(document.getElementById("root")!).render(
 
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors expand={false} duration={2500} />
    </AuthProvider>
 
);


