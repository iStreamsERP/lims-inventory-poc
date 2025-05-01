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
        label: "Customers",
        icon: UserPlus,
        path: "/customers",
      },
    ],
  },
  {
    title: "Categories",
    links: [
      {
        label: "Product Category",
        icon: Package,
        path: "/categories",
      },
      {
        label: "Service Category",
        icon: NotepadText,
        path: "/service-price-page",
      },
    ],
  },
  {
    title: "Lists",
    links: [
      {
        label: "Products",
        icon: ShoppingBag,
        path: "/products",
      },
      {
        label: "Services",
        icon: NotepadText,
        path: "/services",
      },
      {
        label: "Orders",
        icon: ChartColumn,
        path: "/orders",
      },
      {
        label: "Enquiry",
        icon: UserCheck,
        path: "/enquiry-form",
      },
      {
        label: "Users",
        icon: Users,
        path: "/users",
      },
      {
        label: "User Role",
        icon: Users,
        path: "/user-role",
      },
      {
        label: "User Preferences",
        icon: Users,
        path: "/user-preferences",
      },
    ],
  },
];
