import { ThemeProvider } from "@/components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EnquiryForm from "./components/form/EnquiryForm";
import AccountSettings from "./pages/AccountSettings";
import CartPage from "./pages/CartPage";
import CategoryListPage from "./pages/CategoryListPage";
import CustomerDashboardPage from "./pages/CustomerDashboardPage";
import CustomerFormPage from "./pages/CustomerFormPage";
import CustomerListPage from "./pages/CustomerListPage";
import DashboardPage from "./pages/DashboardPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import LoginFormPage from "./pages/LoginFormPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderFormPage from "./pages/OrderFormPage";
import OrderList from "./pages/OrderList";
import ProceedToCheckPage from "./pages/ProceedToCheckPage";
import ProductCardListPage from "./pages/ProductCardListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductFormPage from "./pages/ProductFormPage";
import ProductListPage from "./pages/ProductListPage";
import ServiceCategoryListPage from "./pages/ServiceCategoryListPage";
import ServiceFormPage from "./pages/ServiceFormPage";
import ServiceListPage from "./pages/ServiceListPage";
import SignUpPage from "./pages/SignUpPage";
import UserListPage from "./pages/UserListPage";
import UserPreferences from "./pages/userPreferences/UserPreferences";
import UserRolePage from "./pages/UserRolePage";
import Layout from "./routes/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import UserAccessRightsPage from "./pages/UserAccessRightsPage";
import RoleAccessRightsPage from "./pages/RoleAccessRightsPage";
import CategoryAccessRightsPage from "./pages/CategoryAccessRightsPage";

const App = () => {
  const router = createBrowserRouter([
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
          element: <Layout />,
          children: [
            { index: true, element: <DashboardPage /> },

            { path: "customers", element: <CustomerListPage /> },
            { path: "/new-customer", element: <CustomerFormPage /> },
            { path: "/customer/:id", element: <CustomerFormPage /> },
            { path: "/customer-dashboard/:id", element: <CustomerDashboardPage /> },

            { path: "categories", element: <CategoryListPage /> },
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

            { path: "enquiry-form", element: <EnquiryForm /> },

            { path: "users", element: <UserListPage /> },
            { path: "user-role", element: <UserRolePage /> },
            { path: "user-access-rights", element: <UserAccessRightsPage /> },
            { path: "role-access-rights", element: <RoleAccessRightsPage /> },
            { path: "category-access-rights", element: <CategoryAccessRightsPage /> },

            { path: "user-preferences", element: <UserPreferences /> },
            { path: "account-settings", element: <AccountSettings /> },

            { path: "cart-page", element: <CartPage /> },
            { path: "cart-page/proceed-to-check", element: <ProceedToCheckPage /> },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return (
    <ThemeProvider
      defaultTheme="dark"
      storageKey="vite-ui-theme"
    >
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
