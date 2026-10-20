import { matchPath } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Tags, Ticket, Users } from "lucide-react";

export const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Products", icon: Package },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/coupons", label: "Coupons", icon: Ticket },
  { to: "/users", label: "Users", icon: Users },
];

// Sub-pages that are not in the sidebar. Checked before NAV_ITEMS.
const SUB_PAGE_TITLES = [
  { path: "/products/new", title: "New product" },
  { path: "/products/:id/edit", title: "Edit product" },
];

export const getPageTitle = (pathname) => {
  const subPage = SUB_PAGE_TITLES.find(({ path }) => matchPath({ path, end: true }, pathname));
  if (subPage) return subPage.title;

  const item = NAV_ITEMS.find(({ to }) => matchPath({ path: to, end: true }, pathname));
  return item ? item.label : "Page not found";
};