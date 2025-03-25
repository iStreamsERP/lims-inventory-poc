import { ThemeProvider } from "@/contexts/theme-context";
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

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
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
            { path: "cart-page", element: <CartPage /> },
          ]
        }
      ],
    },
  ]);

  return (
    <ThemeProvider storageKey="theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
