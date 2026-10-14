import { Heart, Lock, MapPin, Package, User } from "lucide-react";

export const accountNav = [
  { to: "/account/profile", label: "Profile", icon: User },
  { to: "/account/addresses", label: "Addresses", icon: MapPin },
  { to: "/account/orders", label: "Orders", icon: Package },
  { to: "/account/wishlist", label: "Wishlist", icon: Heart },
  { to: "/account/password", label: "Password", icon: Lock },
];