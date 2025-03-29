import { ThemeProvider } from "@/components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EnquiryForm from "./components/form/EnquiryForm";
import AddCustomerPages from "./pages/AddCustomerPages";
import CartPage from "./pages/CartPage";
import CategoryDetailsPage from "./pages/CategoryDetailsPage";
import CategoryPage from "./pages/CategoryPage";
import CustomersTable from "./pages/CustomersTable";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ServicePricingPage from "./pages/ServicePricingpage";
import Layout from "./routes/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import UserRegisterListPage from "./pages/UserRegisterListPage";
import OrderCreationPage from "./pages/OrderCreationPage";
import ItemList from "./pages/ItemsList";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";

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
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          element: <Layout />,
          children: [
            { index: true, element: <DashboardPage /> },
            { path: "category", element: <CategoryPage /> },
            { path: "customers-information", element: <AddCustomerPages /> },
            { path: "service-list", element: <ServicePricingPage /> },
            { path: "category/:category", element: <CategoryDetailsPage /> },
            { path: "customers-table", element: <CustomersTable /> },
            { path: "enquiry-form", element: <EnquiryForm /> },
            { path: "user-register-list", element: <UserRegisterListPage /> },
            { path: "item-list", element: <ItemList /> },
            { path: "order-creation", element: <OrderCreationPage /> },
            { path: "cart-page", element: <CartPage /> },
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
