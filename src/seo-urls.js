import { ZONE_LANDINGS } from "./zone-landings.js";

/**
 * Canonical, indexable URLs for marcofagnaniosteopata.it
 * Host: https://www.… · path with trailing slash (home = /)
 */
export const SITE_ORIGIN = "https://www.marcofagnaniosteopata.it";

/** Slugs of retired geographic landings (301 → /milano-forlanini/). */
export const RETIRED_ZONE_SLUGS = [
  "osteopata-mecenate-milano",
  "osteopata-ortica-milano",
  "osteopata-lambrate-milano",
  "osteopata-citta-studi-milano",
  "osteopata-taliedo-linate-milano",
  "osteopata-porta-vittoria-milano",
  "osteopata-santa-giulia-milano",
  "osteopata-rogoredo-milano",
];

/** Pages included in sitemap.xml (must match <link rel="canonical">). */
export const INDEXABLE_PATHS = [
  "/",
  "/chi-sono/",
  "/osteopatia/",
  "/valutazione-funzionale/",
  "/return-to-play/",
  "/preparazione-atletica/",
  "/contatti/",
  "/milano-forlanini/",
  "/blog/",
  "/problemi/",
  "/mal-di-schiena-milano/",
  "/cervicalgia-milano/",
  "/dolore-ginocchio/",
  "/dolore-spalla/",
  "/distorsione-caviglia/",
  "/tendinopatie/",
  "/recupero-infortunio-sportivo/",
  "/privacy/",
  ...ZONE_LANDINGS.map((z) => `/${z.slug}/`),
];

/**
 * Old WordPress (or alias) paths → new canonical path.
 * Applied as 301 in public/.htaccess and vercel.json
 * Both /path and /path/ are emitted to avoid trailingSlash chains on Vercel.
 */
export const LEGACY_REDIRECTS = [
  ["/ginnastica-posturale-e-riatletizzazione/", "/preparazione-atletica/"],
  ["/privacy-policy/", "/privacy/"],
  ["/2022/11/28/lombalgia/", "/mal-di-schiena-milano/"],
  ["/2022/12/17/mal-di-testa/", "/cervicalgia-milano/"],
  ["/2022/12/19/dolore-alla-caviglia/", "/distorsione-caviglia/"],
  ["/2022/12/19/dolore-alla-spalla/", "/dolore-spalla/"],
  ["/2022/12/19/prevenzione-sportiva/", "/recupero-infortunio-sportivo/"],
  ["/2022/12/19/acufene/", "/osteopatia/"],
  ["/2022/12/19/coccigodinia/", "/mal-di-schiena-milano/"],
  ["/2022/12/19/colpo-di-frusta/", "/cervicalgia-milano/"],
  ["/2022/12/19/dismenorrea/", "/osteopatia/"],
  ["/2022/12/19/fibromialgia/", "/osteopatia/"],
  ["/2022/12/19/reflusso-gastroesofageo/", "/osteopatia/"],
  ["/2022/12/19/scoliosi/", "/osteopatia/"],
  ["/2022/12/19/stipsi/", "/osteopatia/"],
  ["/2022/12/19/vertigini/", "/cervicalgia-milano/"],
  ["/traumi-sportivi-milano/", "/recupero-infortunio-sportivo/"],
  ...RETIRED_ZONE_SLUGS.map((slug) => [`/${slug}/`, "/milano-forlanini/"]),
];

/** HTML files that must not be indexed (noindex + out of sitemap). */
export const NOINDEX_HTML = [
  "404.html",
  "esempio-report-generale.html",
  "esempio-report-atleta.html",
];
