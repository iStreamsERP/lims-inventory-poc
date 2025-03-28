import { ChartColumn, Home, NotepadText, Package, PackagePlus, Settings, ShoppingBag, UserCheck, UserPlus, Users } from "lucide-react";

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
        label: "Customer Information",
        icon: Users,
        path: "/customers-information",
      },
      {
        label: "Customer Table",
        icon: UserPlus,
        path: "/customers-table",
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
        label: "User Register List",
        icon: UserPlus,
        path: "/user-register-list",
      },
      {
        label: "Order Creation",
        icon: UserPlus,
        path: "/order-creation",
      },
      {
        label: "Product List",
        icon: ShoppingBag,
        path: "/product-list",
      },
      {
        label: "Service List",
        icon: NotepadText,
        path: "/service-list",
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
