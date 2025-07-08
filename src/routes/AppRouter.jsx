import CategoryAccessRightsPage from "@/pages/CategoryAccessRightsPage";
import CustomerDashboardPage from "@/pages/CustomerDashboardPage";
import CustomerFormPage from "@/pages/CustomerFormPage";
import CustomerListPage from "@/pages/CustomerListPage";
import DashboardPage from "@/pages/DashboardPage";
import ForgetPasswordPage from "@/pages/ForgetPasswordPage";
import LoginFormPage from "@/pages/LoginFormPage";
import NotFoundPage from "@/pages/NotFoundPage";
import OrderFormPage from "@/pages/OrderFormPage";
import OrderList from "@/pages/OrderList";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import ProceedToCheckPage from "@/pages/ProceedToCheckPage";
import ProductCardListPage from "@/pages/ProductCardListPage";
import ProductCategoryListPage from "@/pages/ProductCategoryListPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import ProductFormPage from "@/pages/ProductFormPage";
import ProductListPage from "@/pages/ProductListPage";
import RefundPolicyPage from "@/pages/RefundPolicyPage";
import ReturnPolicyPage from "@/pages/ReturnPolicyPage";
import RoleAccessRightsPage from "@/pages/RoleAccessRightsPage";
import ServiceCategoryListPage from "@/pages/ServiceCategoryListPage";
import ServiceFormPage from "@/pages/ServiceFormPage";
import ServiceListPage from "@/pages/ServiceListPage";
import ShippingPolicyPage from "@/pages/ShippingPolicyPage";
import SignUpPage from "@/pages/SignUpPage";
import TermsAndConditionPage from "@/pages/TermsAndConditionPage";
import UserAccessRightsPage from "@/pages/UserAccessRightsPage";
import UserListPage from "@/pages/UserListPage";
import UserPreferences from "@/pages/userPreferences/UserPreferences";
import UserRolePage from "@/pages/UserRolePage";
import RfqListPage from "@/pages/RfqListPage";
import { createBrowserRouter } from "react-router-dom";
import AccountSettings from "@/pages/AccountSettings";
import CartPage from "@/pages/CartPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { DefaultLayout } from "@/layouts/DefaultLayout";

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

  { path: "/T&C", element: <TermsAndConditionPage /> },
  { path: "/refund_policy", element: <RefundPolicyPage /> },
  { path: "/privacy_policy", element: <PrivacyPolicyPage /> },
  { path: "/return_policy", element: <ReturnPolicyPage /> },
  { path: "/shipping_policy", element: <ShippingPolicyPage /> },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DefaultLayout />,
        children: [
          { index: true, element: <DashboardPage /> },

          { path: "customers", element: <CustomerListPage /> },
          { path: "/new-customer", element: <CustomerFormPage /> },
          { path: "/customer/:id", element: <CustomerFormPage /> },
          { path: "/customer-dashboard/:id", element: <CustomerDashboardPage /> },

          { path: "categories", element: <ProductCategoryListPage /> },
          { path: "product-card-list/:id", element: <ProductCardListPage /> },
          { path: "product-detail/:id", element: <ProductDetailPage /> },

          { path: "products", element: <ProductListPage /> },
          { path: "/new-product", element: <ProductFormPage /> },
          { path: "/product/:id", element: <ProductFormPage /> },

          { path: "services", element: <ServiceListPage /> },
          { path: "/new-service", element: <ServiceFormPage /> },
          { path: "/service/:id", element: <ServiceFormPage /> },
          { path: "service-category-list", element: <ServiceCategoryListPage /> },

          { path: "orders", element: <OrderList /> },
          { path: "/new-order", element: <OrderFormPage /> },
          { path: "/edit-order/:id", element: <OrderFormPage /> },
          { path: "/view-order/:id", element: <OrderFormPage /> },

          { path: "quotations", element: <OrderList /> },
          { path: "/new-quotation", element: <OrderFormPage /> },
          { path: "/edit-quotation/:id", element: <OrderFormPage /> },
          { path: "/view-quotation/:id", element: <OrderFormPage /> },

          { path: "rfq", element: <RfqListPage /> },

          { path: "users", element: <UserListPage /> },
          { path: "user-role", element: <UserRolePage /> },
          { path: "user-access-rights", element: <UserAccessRightsPage /> },
          { path: "role-access-rights", element: <RoleAccessRightsPage /> },
          { path: "category-access-rights", element: <CategoryAccessRightsPage /> },

          { path: "user-preferences", element: <UserPreferences /> },
          { path: "account-settings", element: <AccountSettings /> },

          { path: "cart-page", element: <CartPage /> },
          { path: "/proceed-to-check", element: <ProceedToCheckPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
