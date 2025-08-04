import {
  Home
} from "lucide-react";

export const getNavbarLinks = (isAdmin) => [
  {
    title: "Main",
    links: [
      {
        label: "Dashboard",
        icon: Home,
        path: "/",
      },
    ],
  },
  {
    title: "Forms",
    links: [
      {
        label: "Inventory Management",
        icon: "ShieldUser",
        children: [
          {
            label: "Material Master",
            icon: "Home",
            path: "/material-master",
          },
          {
            label: "Material Requisition",
            icon: "Home",
            path: "/material-requisition",
          },
          {
            label: "Material Issue Note",
            icon: "Home",
            path: "/material-issue-note",
          },
          {
            label: "Purchase Order",
            icon: "Home",
            path: "/purchase-order",
          },
        ],
      },
      {
        label: "Procurement Management",
        icon: "ShieldUser",
        children: [
          {
            label: "RFQ Rate Viewer",
            icon: "Home",
            path: "/rfq-rate-viewer",
          },
          {
            label: "RFQ List",
            icon: "Home",
            path: "/material-requisition",
          },
          {
            label: "RFQ short list process",
            icon: "Home",
            path: "/purchase-order",
          },
          {
            label: "RFQ comparison",
            icon: "Home",
            path: "/purchase-requisition",
          },
        ],
      },
    ],
  },
];