import { SITE_NAME } from "./site";

const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/$/, "");

// Organization + WebSite (with sitelinks search box) for the home page.
export const buildSiteJsonLd = () => {
  if (!SITE_URL) return [];
  return [
    { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/shop?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
};