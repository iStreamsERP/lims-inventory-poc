import { ThemeProvider } from "@/components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EnquiryForm from "./components/form/EnquiryForm";
import CartPage from "./pages/CartPage";
import CategoryDetailsPage from "./pages/CategoryDetailsPage";
import CategoryPage from "./pages/CategoryPage";
import CustomersInformation from "./pages/CustomersInformation";
import CustomersTable from "./pages/CustomersTable";
import DashboardPage from "./pages/DashboardPage";
import ItemList from "./pages/ItemsList";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderCreationPage from "./pages/OrderCreationPage";
import ServicePricingPage from "./pages/ServicePricingpage";
import SignUpPage from "./pages/SignUpPage";
import UserRegisterListPage from "./pages/UserRegisterListPage";
import Layout from "./routes/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import SubMaterialPage from "./pages/SubMaterialPage";
import AccountSettings from "./pages/AccountSettings";

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
            { path: "account-settings", element: <AccountSettings /> },
            { path: "customers-information", element: <CustomersInformation /> },
            { path: "customers-table", element: <CustomersTable /> },
            { path: "category", element: <CategoryPage /> },
            { path: "category/:category", element: <CategoryDetailsPage /> },
            { path: "user-register-list", element: <UserRegisterListPage /> },
            { path: "sub-material-page", element: <SubMaterialPage /> },
            { path: "item-list", element: <ItemList /> },
            { path: "order-creation", element: <OrderCreationPage /> },
            { path: "service-list", element: <ServicePricingPage /> },
            { path: "enquiry-form", element: <EnquiryForm /> },
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
