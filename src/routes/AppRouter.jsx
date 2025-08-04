import ForgetPasswordPage from "@/pages/ForgetPasswordPage";
import LoginFormPage from "@/pages/LoginFormPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SignUpPage from "@/pages/SignUpPage";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { DefaultLayout } from "@/layouts/DefaultLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { PurchaseOrderPage } from "@/pages/PurchaseOrderPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginFormPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgetPasswordPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DefaultLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "/purchase-order", element: <PurchaseOrderPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
