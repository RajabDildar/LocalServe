import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "./Navbar.tsx";
import { useAuthInit } from "@/features/auth/useAuth";

export const RootLayout = () => {
  useAuthInit();

  return (
    <>
      <Navbar />
      <Outlet />
      <Toaster position="top-right" richColors />
    </>
  );
};
