import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BookingPage } from "@/pages/customer/BookingPage";
import { BookingsDashboard } from "@/pages/customer/BookingsDashboard";
import { ProviderDashboard } from "@/pages/provider/ProviderDashboard";
import { HomePage } from "@/pages/customer/HomePage";
import { ProviderDetailPage } from "@/pages/customer/ProviderDetailPage";
import { ProfileSetupPage } from "@/pages/provider/ProfileSetupPage";
import { ServicesPage } from "@/pages/provider/ServicesPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { RootLayout } from "@/components/layout/RootLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";
import { VerifyEmailPage } from "@/pages/auth/VerifyEmailPage";
import { NotFoundPage } from "@/pages/NotFoundPage.tsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/provider/:id", element: <ProviderDetailPage /> },
      { path: "/provider/:providerId/service/:serviceId/book", element: <BookingPage /> },
      {
        path: "/dashboard/bookings",
        element: (
          <ProtectedRoute>
            <RoleRoute allowedRoles={["customer"]}>
              <BookingsDashboard />
            </RoleRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/provider",
        element: (
          <ProtectedRoute>
            <RoleRoute allowedRoles={["provider"]}>
              <ProviderDashboard />
            </RoleRoute>
          </ProtectedRoute>
        ),
      },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password/:token", element: <ResetPasswordPage /> },
      { path: "/verify-email/:token", element: <VerifyEmailPage /> },
      {
        path: "/provider/profile",
        element: (
          <ProtectedRoute>
            <RoleRoute allowedRoles={["provider"]}>
              <ProfileSetupPage />
            </RoleRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "/provider/services",
        element: (
          <ProtectedRoute>
            <RoleRoute allowedRoles={["provider"]}>
              <ServicesPage />
            </RoleRoute>
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
