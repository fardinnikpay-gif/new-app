// Where to go after login/register: the page the guest came from, or a fallback.
// Only internal paths are accepted.
export const getRedirectPath = (state, fallback = "/account") => {
  const from = state?.from;
  if (!from) return fallback;

  const path =
    typeof from === "string" ? from : `${from.pathname ?? ""}${from.search ?? ""}${from.hash ?? ""}`;

  return path.startsWith("/") && !path.startsWith("//") ? path : fallback;
};