import { BaggageClaim, ChartColumn, Grid2x2Plus, Headset, Home, MessageCircleQuestion, MonitorCog, NotepadText, Package, PackagePlus, Settings, ShoppingBag, Tags, UserCheck, UserPlus, Users } from "lucide-react";

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
        icon: Tags,
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
        icon: Headset,
        path: "/services",
      },
      {
        label: "Orders",
        icon: ChartColumn,
        path: "/orders",
      },
      {
        label: "Users",
        icon: Users,
        path: "/users",
      },
      {
        label: "Enquiry",
        icon: MessageCircleQuestion,
        path: "/enquiry-form",
      },
      {
        label: "User Preferences",
        icon: MonitorCog,
        path: "/user-preferences",
      },
    ],
  },
];
