import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "../../data/site";

const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, "");

const toAbsoluteUrl = (value) =>
  /^https?:\/\//i.test(value) ? value : `${SITE_URL}${value.startsWith("/") ? "" : "/"}${value}`;

// "<" is escaped so text inside the data can never close the <script> tag
const serializeJsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

// props: { title, description, image, type, jsonLd (object | array), noindex }
// Canonical is the pathname only, so filter and page queries do not create duplicate URLs.
export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  type = "website",
  jsonLd,
  noindex = false,
}) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${pathname}`;
  const imageUrl = image ? toAbsoluteUrl(image) : null;
  const jsonLdList = jsonLd ? [jsonLd].flat() : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta name="twitter:card" content={imageUrl ? "summary_large_image" : "summary"} />
      {jsonLdList.map((item, index) => (
        <script key={index} type="application/ld+json">
          {serializeJsonLd(item)}
        </script>
      ))}
    </Helmet>
  );
}