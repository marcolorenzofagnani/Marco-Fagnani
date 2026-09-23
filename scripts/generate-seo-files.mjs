#!/usr/bin/env node
/**
 * Writes public/robots.txt and public/sitemap.xml from src/seo-urls.js
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  SITE_ORIGIN,
  INDEXABLE_PATHS,
} from "../src/seo-urls.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
mkdirSync(pub, { recursive: true });

const today = new Date().toISOString().slice(0, 10);

const robots = `# Marco Fagnani Osteopata — https://www.marcofagnaniosteopata.it
User-agent: *
Allow: /

# Non bloccare risorse di rendering
Allow: /assets/
Allow: /images/
Allow: /fonts/

# Utility (la meta noindex sulla pagina 404 è la protezione principale)
Disallow: /404.html

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;

const urls = INDEXABLE_PATHS.map((path) => {
  const loc = path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
  const priority =
    path === "/" ? "1.0" : path.split("/").filter(Boolean).length <= 1 ? "0.8" : "0.7";
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(join(pub, "robots.txt"), robots);
writeFileSync(join(pub, "sitemap.xml"), sitemap);
console.log(
  `SEO files written: robots.txt, sitemap.xml (${INDEXABLE_PATHS.length} URLs)`,
);
