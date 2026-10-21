// Editable site navigation. `category` must match the category value used by the backend.
export const OVERLAY_HEADER_ROUTES = []; // routes whose first screen is a dark Hero (transparent header)

const makeCategory = (id, label) => ({
  id,
  label,
  category: id,
  links: [
    { label: `All ${label.toLowerCase()}`, params: { category: id } },
    { label: "New arrivals", params: { category: id, sort: "newest" } },
    { label: "On sale", params: { category: id, onSale: "true" } },
    { label: "T-shirts", params: { category: id, search: "t-shirt" } },
    { label: "Shirts", params: { category: id, search: "shirt" } },
    { label: "Trousers", params: { category: id, search: "trousers" } },
    { label: "Jackets", params: { category: id, search: "jacket" } },
  ],
  promo: {
    title: `New in ${label.toLowerCase()}`,
    params: { category: id, sort: "newest" },
    image: "/placeholders/landscape.svg",
  },
});

export const NAV_CATEGORIES = [makeCategory("men", "Men"), makeCategory("women", "Women"), makeCategory("kids", "Kids")];

export const SALE_LINK = { label: "Sale", to: "/shop?onSale=true" };

export const FOOTER_GROUPS = [
  {
    title: "Shop",
    links: [
      { label: "Men", to: "/shop?category=men" },
      { label: "Women", to: "/shop?category=women" },
      { label: "Kids", to: "/shop?category=kids" },
      { label: "Sale", to: SALE_LINK.to },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Size guide", to: "/size-guide" },
      { label: "FAQ", to: "/faq" },
      { label: "Contact", to: "/contact" },
    ],
  },
  { title: "Company", links: [{ label: "About", to: "/about" }] },
  {
    title: "Legal",
    links: [
      { label: "Terms", to: "/terms" },
      { label: "Privacy", to: "/privacy" },
    ],
  },
];

export const SOCIAL_LINKS = [
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
  { id: "x", label: "X", href: "https://x.com/" },
  { id: "facebook", label: "Facebook", href: "https://www.facebook.com/" },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/" },
];