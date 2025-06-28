import { ChartColumn, Headset, Home, LibraryBig, Package, ScrollText, ShieldUser, ShoppingBag, Tags, UserPlus } from "lucide-react";

export const getNavbarLinks = (isAdmin) => [
  {
    title: "Main",
    links: [
      {
        label: "Dashboard",
        icon: Home,
        path: "/",
      },
      {
        label: "Customers",
        icon: UserPlus,
        path: "/customers",
      },
      {
        label: "Product Category",
        icon: Package,
        path: "/categories",
      },
      {
        label: "Service Category",
        icon: Tags,
        path: "/service-category-list",
      },
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
        label: "Quotation",
        icon: ScrollText,
        path: "/quotations",
      },
      {
        label: "RFQ",
        icon: ScrollText,
        path: "/rfq",
      },
    ],
  },
  {
    title: "Access Control",
    links: [
      {
        label: "User Administration",
        icon: ShieldUser,
        children: [
          {
            label: "Users",
            icon: LibraryBig,
            path: "/users",
          },
          {
            label: "User Role",
            icon: LibraryBig,
            path: "/user-role",
          },
          {
            label: "User Access Rights",
            icon: LibraryBig,
            path: "/user-access-rights",
          },
          {
            label: "Role Access Rights",
            icon: LibraryBig,
            path: "/role-access-rights",
          },
          {
            label: "Category Access Rights",
            icon: LibraryBig,
            path: "/category-access-rights",
          },
        ],
      },
    ],
  },
];
