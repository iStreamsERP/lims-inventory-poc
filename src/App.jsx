import { ThemeProvider } from "@/components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EnquiryForm from "./components/form/EnquiryForm";
import AccountSettings from "./pages/AccountSettings";
import CartPage from "./pages/CartPage";
import CategoryListPage from "./pages/CategoryListPage";
import CategoryPageTrash from "./pages/CategoryPageTrash";
import CreateProduct from "./pages/CreateProduct";
import CreateService from "./pages/CreateService";
import CustomerCreation from "./pages/CustomerCreation";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import CustomerMaster from "./pages/CustomerMaster";
import DashboardPage from "./pages/DashboardPage";
import ForgetPassword from "./pages/ForgetPassword";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderCreationPage from "./pages/OrderCreationPage";
import OrderList from "./pages/OrderList";
import ProceedToCheckPage from "./pages/ProceedToCheckPage";
import ProductList from "./pages/ProductList";
import ServiceList from "./pages/ServiceList";
import ServicePricingPage from "./pages/ServicePricingPage";
import SignUpPage from "./pages/SignUpPage";
import UserManagement from "./pages/UserManagement";
import Layout from "./routes/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductListPage from "./pages/ProductListPage";
import UserPreferences from "./pages/UserPreferences";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignUpPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgetPassword />,
    },
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          element: <Layout />,
          children: [
            { index: true, element: <DashboardPage /> },
            { path: "account-settings", element: <AccountSettings /> },
            { path: "customer-master", element: <CustomerMaster /> },
            { path: "/customer-master/customer-creation/:id?", element: <CustomerCreation /> },
            { path: "/customer-master/:id", element: <CustomerDetailPage /> },
            { path: "category-list", element: <CategoryListPage /> },
            { path: "category-trash", element: <CategoryPageTrash /> },
            { path: "category-list/:id", element: <ProductListPage /> },
            { path: "product-detail/:id", element: <ProductDetailPage /> },
            { path: "/order-list/order-creation", element: <OrderCreationPage /> },
            { path: "products-list", element: <ProductList /> },
            { path: "/products-list/create-product/:id?", element: <CreateProduct /> },
            { path: "services-list", element: <ServiceList /> },
            { path: "/services-list/create-service/:id?", element: <CreateService /> },
            { path: "service-price-page", element: <ServicePricingPage /> },
            { path: "order-list", element: <OrderList /> },
            { path: "enquiry-form", element: <EnquiryForm /> },
            { path: "user-management", element: <UserManagement /> },
            { path: "user-preferences", element: <UserPreferences /> },
            { path: "cart-page", element: <CartPage /> },
            { path: "cart-page/proceed-to-check", element: <ProceedToCheckPage /> },
          ]
        }
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
