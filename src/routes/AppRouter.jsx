import ForgetPasswordPage from "@/pages/ForgetPasswordPage";
import LoginFormPage from "@/pages/LoginFormPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SignUpPage from "@/pages/SignUpPage";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { DefaultLayout } from "@/layouts/DefaultLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { PurchaseOrderPage } from "@/pages/PurchaseOrderPage";
import RfqPage from "@/pages/rfq";
import RfqMaterialList from "@/pages/RfqMaterialList";
import RfqRateUpdates from "@/pages/RfqRateUpdates";
import Rfq from "@/pages/rfq";
import RfqRateComparisionPortal from "@/pages/RfqRateComparisionPortal";
import RfqOffical from "@/pages/RfqOffical";
import RfqDetailsPage from "@/pages/RfqDetailsPage";
import Ilms from "@/pages/Ilms";
import Ilmsc from "@/pages/ilmsc";
import CartImg from "@/pages/CartImg";
import Cart from "@/pages/CartProducts";
import CartProducts from "@/pages/CartProducts";
import ReactInputsChange from "@/pages/ReactnputChange";
import GalePass from "@/pages/GalePass";
import GatePass from "@/pages/GatePass";
import Test from "@/pages/Test";
import Release from "@/pages/Release";

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
   {path: "/rfq-offcial",element: <RfqOffical />},
            {path: "/rfq-details/:id",element: <RfqDetailsPage />},
            {path: "/rfq-details",element: <RfqDetailsPage />},
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DefaultLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "/purchase-order", element: <PurchaseOrderPage /> },
          { path: "/rfq", element: <RfqPage /> },
            { path: "/rfq-material-list", element: <RfqMaterialList /> },
            { path: "/rfq-rate-updates/:id", element: <RfqRateUpdates /> },
            { path: "/rfq-rate-updates", element: <RfqRateUpdates /> },
            { path: "/rfq", element: <Rfq /> },
           
            {path: "/rfq-rate-comparision",element: <RfqRateComparisionPortal />},
            {path: "/ilms",element: <Ilms />},
            {path: "/ilms-comp-click",element: <Ilmsc />},
            {path: "/cart-img",element: <CartImg />},
            {path: "/cart",element: <CartProducts />},
            {path: "/cart/:category",element: <CartProducts />},
            {path: "/inp",element: <ReactInputsChange />},
            {path: "/gatepass",element: <GalePass />},
            {path: "/gate",element: <GatePass />},
            {path: "/test",element: <Test />},
            {path: "/release",element: <Release />},
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
