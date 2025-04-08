import { BaggageClaim, ChartColumn, Grid2x2Plus, Home, NotepadText, Package, PackagePlus, Settings, ShoppingBag, UserCheck, UserPlus, Users } from "lucide-react";

export const navbarLinks = [
  {
    title: "Dashboard",
    links: [
      {
        label: "Dashboard",
        icon: Home,
        path: "/",
      },
    ],
  },
  {
    title: "Customers",
    links: [
      {
        label: "Customer Master",
        icon: UserPlus,
        path: "/customer-master",
      },
    ],
  },
  {
    title: "Categories",
    links: [
      {
        label: "Category",
        icon: Package,
        path: "/category",
      },
    ],
  },
  {
    title: "Lists",
    links: [
      {
        label: "User Management",
        icon: Users,
        path: "/user-management",
      },
      {
        label: "Product List",
        icon: ShoppingBag,
        path: "/products-list",
      },
      {
        label: "Service List",
        icon: NotepadText,
        path: "/services-list",
      },
      {
        label: "Service Price Card",
        icon: NotepadText,
        path: "/service-price-page",
      },
      {
        label: "Order List",
        icon: ChartColumn,
        path: "/order-list",
      },
      {
        label: "Enquiry",
        icon: UserCheck,
        path: "/enquiry-form",
      },
    ],
  },
];
