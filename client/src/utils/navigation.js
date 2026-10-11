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