export const DEFAULT_AFTER_LOGIN = "/account";

// getRedirectTarget(location) | out: { pathname, search, hash } taken from location.state.from, else "/account"
// Only internal absolute paths are accepted.
export function getRedirectTarget(location) {
  const from = location.state?.from;
  const pathname = from?.pathname;

  if (typeof pathname === "string" && pathname.startsWith("/") && !pathname.startsWith("//")) {
    return { pathname, search: from.search ?? "", hash: from.hash ?? "" };
  }
  return DEFAULT_AFTER_LOGIN;
}

// shopUrl(params) | out: "/shop?category=men&sort=newest" (or "/shop" when params is empty)
export function shopUrl(params = {}) {
  const query = new URLSearchParams(params).toString();
  return query ? `/shop?${query}` : "/shop";
}