import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "@/pages/customer/HomePage";
import { ProviderDetailPage } from "@/pages/customer/ProviderDetailPage";
import { ProfileSetupPage } from "@/pages/provider/ProfileSetupPage";
import { ServicesPage } from "@/pages/provider/ServicesPage";
import { ProtectedRoute } from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/provider/:id",
    element: <ProviderDetailPage />,
  },
  {
    path: "/provider/profile",
    element: (
      <ProtectedRoute>
        <ProfileSetupPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/provider/services",
    element: (
      <ProtectedRoute>
        <ServicesPage />
      </ProtectedRoute>
    ),
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
