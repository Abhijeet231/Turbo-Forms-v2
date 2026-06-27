import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ClerkProvider } from "@clerk/react";
import router from "@/routes/Approuter";
import { Toaster } from "sonner";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, useTheme } from "@/components/theme-provider";

const ToasterWithTheme = () => {
  const { theme } = useTheme();
  return (
    <Toaster
      position="top-right"
      richColors
      expand={false}
      duration={2500}
      theme={theme as "light" | "dark" | "system"}
    />
  );
};

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <ToasterWithTheme />
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>,
);
