import { LayoutDashboard, Package, Tags, Settings } from "lucide-react";

export const adminLinks = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Products", to: "/admin/products", icon: Package, end: false },
  { label: "Categories", to: "/admin/categories", icon: Tags, end: false },
  { label: "Settings", to: "/admin/settings", icon: Settings, end: false },
];
