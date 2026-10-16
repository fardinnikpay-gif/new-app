// Generates public/sitemap.xml (static pages + all products from the API) and public/robots.txt.
// Run: npm run sitemap   (Node 20.6+; reads VITE_SITE_URL and VITE_API_URL from .env)
import { writeFile } from "node:fs/promises";

const SITE_URL = (process.env.VITE_SITE_URL || "").replace(/\/$/, "");
const API_URL = (process.env.VITE_API_URL || "").replace(/\/$/, "");
const PAGE_LIMIT = 100;

const STATIC_PATHS = [
  "/", "/shop", "/shop?category=men", "/shop?category=women", "/shop?category=kids",
  "/shop?onSale=true", "/about", "/contact", "/faq", "/size-guide", "/terms", "/privacy",
];

const PRIVATE_PATHS = [
  "/cart", "/checkout", "/account", "/login", "/register", "/forgot-password", "/reset-password",
];

const escapeXml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function fetchAllProducts() {
  const products = [];
  let page = 1;
  let pages = 1;
  do {
    const response = await fetch(`${API_URL}/products?page=${page}&limit=${PAGE_LIMIT}`);
    if (!response.ok) throw new Error(`API responded with ${response.status}`);
    const data = await response.json();
    products.push(...(data.products ?? []));
    pages = data.pages ?? 1;
    page += 1;
  } while (page <= pages);
  return products;
}

const urlEntry = (path, lastmod) =>
  `  <url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;

async function main() {
  if (!SITE_URL || !API_URL) {
    console.warn("[sitemap] VITE_SITE_URL and VITE_API_URL are required. Skipping.");
    return;
  }

  let products = [];
  try {
    products = await fetchAllProducts();
  } catch (error) {
    // never break a build because the API is down: keep the existing files
    console.warn(`[sitemap] Could not load products (${error.message}). Keeping the existing files.`);
    return;
  }

  const entries = [
    ...STATIC_PATHS.map((path) => urlEntry(path)),
    ...products.map((product) =>
      urlEntry(`/product/${encodeURIComponent(product.slug)}`, product.updatedAt?.slice(0, 10))
    ),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
  const robots = `User-agent: *\nAllow: /\n${PRIVATE_PATHS.map((path) => `Disallow: ${path}`).join("\n")}\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

  await writeFile(new URL("../public/sitemap.xml", import.meta.url), sitemap);
  await writeFile(new URL("../public/robots.txt", import.meta.url), robots);
  console.log(`[sitemap] Wrote ${entries.length} URLs and robots.txt for ${SITE_URL}`);
}

main();