#!/usr/bin/env node
/**
 * Writes vercel.json for production on Vercel.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LEGACY_REDIRECTS } from "../src/seo-urls.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const redirects = [
  { source: "/index.html", destination: "/", permanent: true },
  {
    source: "/traumi-sportivi-milano",
    destination: "/recupero-infortunio-sportivo/",
    permanent: true,
  },
  {
    source: "/traumi-sportivi-milano/",
    destination: "/recupero-infortunio-sportivo/",
    permanent: true,
  },
];

for (const [from, to] of LEGACY_REDIRECTS) {
  const withSlash = from.endsWith("/") ? from : `${from}/`;
  const noSlash = withSlash.slice(0, -1);
  redirects.push(
    { source: withSlash, destination: to, permanent: true },
    { source: noSlash, destination: to, permanent: true },
  );
}

const seen = new Set();
const uniqueRedirects = redirects.filter((r) => {
  if (seen.has(r.source)) return false;
  seen.add(r.source);
  return true;
});

const vercel = {
  $schema: "https://openapi.vercel.sh/vercel.json",
  cleanUrls: true,
  trailingSlash: true,
  headers: [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        {
          key: "Permissions-Policy",
          value: "geolocation=(), microphone=(), camera=()",
        },
      ],
    },
    {
      source: "/404",
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    },
    {
      source: "/esempio-report-atleta",
      headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
    },
    {
      source: "/esempio-report-generale",
      headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
    },
  ],
  redirects: uniqueRedirects,
};

writeFileSync(join(root, "vercel.json"), `${JSON.stringify(vercel, null, 2)}\n`);
console.log(`vercel.json written (${uniqueRedirects.length} redirects)`);
