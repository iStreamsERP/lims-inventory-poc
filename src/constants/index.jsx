import { BaggageClaim, ChartColumn, Home, NotepadText, Package, PackagePlus, Settings, ShoppingBag, UserCheck, UserPlus, Users } from "lucide-react";

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
        label: "Customers",
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
        label: "User Management",
        icon: Users,
        path: "/user-register-list",
      },
      {
        label: "Products",
        icon: ShoppingBag,
        path: "/products-list",
      },
      {
        label: "Product Category",
        icon: ShoppingBag,
        path: "/product-category",
      },
      {
        label: "Order Creation",
        icon: BaggageClaim,
        path: "/order-creation",
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
