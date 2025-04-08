import { ThemeProvider } from "@/components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EnquiryForm from "./components/form/EnquiryForm";
import AccountSettings from "./pages/AccountSettings";
import CartPage from "./pages/CartPage";
import CategoryDetailsPage from "./pages/CategoryDetailsPage";
import CategoryPage from "./pages/CategoryPage";
import CreateProduct from "./pages/CreateProduct";
import CreateService from "./pages/CreateService";
import CustomerCreation from "./pages/CustomerCreation";
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
import ServicePricingPage from "./pages/ServicePricingpage";
import SignUpPage from "./pages/SignUpPage";
import UserManagement from "./pages/UserManagement";
import Layout from "./routes/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

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
            { path: "/customer-master/customer-creation", element: <CustomerCreation /> },
            { path: "category", element: <CategoryPage /> },
            { path: "category/:category", element: <CategoryDetailsPage /> },
            { path: "user-management", element: <UserManagement /> },
            { path: "products-list", element: <ProductList /> },
            { path: "order-list", element: <OrderList /> },
            { path: "/order-list/order-creation", element: <OrderCreationPage /> },
            { path: "services-list", element: <ServiceList /> },
            { path: "/services-list/create-service", element: <CreateService /> },
            { path: "service-price-page", element: <ServicePricingPage /> },
            { path: "/products-list/create-product", element: <CreateProduct /> },
            { path: "enquiry-form", element: <EnquiryForm /> },
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
