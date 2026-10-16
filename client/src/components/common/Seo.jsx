import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SITE_NAME } from "../../utils/site";

const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/$/, "");
const DEFAULT_IMAGE = "/og-default.png"; // add a 1200x630 PNG/JPG to public/
const PRIVATE_PREFIXES = [
  "/cart", "/checkout", "/account", "/login", "/register", "/forgot-password", "/reset-password",
];

const toAbsolute = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
};

// props: title, description, image, type, jsonLd (object or array),
// canonical (path or URL, default: current path), noindex (default: automatic for private pages).
export default function Seo({ title, description, image, type = "website", jsonLd, canonical, noindex }) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  const isPrivate =
    noindex ?? PRIVATE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const canonicalUrl = SITE_URL ? toAbsolute(canonical ?? pathname) : "";
  const imageUrl = SITE_URL ? toAbsolute(image || DEFAULT_IMAGE) : image || "";
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={isPrivate ? "noindex, nofollow" : "index, follow"} />
      {canonicalUrl && !isPrivate && <link rel="canonical" href={canonicalUrl} />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {canonicalUrl && !isPrivate && <meta property="og:url" content={canonicalUrl} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      <meta name="twitter:card" content={imageUrl ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}

      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}