/**
 * JSON-LD from visible page content only.
 * - WebSite (site-wide @id)
 * - WebPage (every page)
 * - BreadcrumbList (only if nav.breadcrumb is in the DOM)
 * - FAQPage (only if an H2 like “Domande frequenti” + details Q&A exist)
 * Does NOT invent reviews, ratings, hours clocks, or qualifications.
 * LocalBusiness / Person stay in static HTML where already authored.
 */
import { SITE } from "./site-info.js";

function injectJsonLd(data) {
  const el = document.createElement("script");
  el.type = "application/ld+json";
  el.setAttribute("data-schema", "auto");
  el.textContent = JSON.stringify(data);
  document.head.appendChild(el);
}

function cleanText(node) {
  return (node?.textContent || "").replace(/\s+/g, " ").trim();
}

function canonicalUrl() {
  const link = document.querySelector('link[rel="canonical"]');
  if (link?.href) return link.href.replace(/\/$/, "") === SITE.siteUrl
    ? `${SITE.siteUrl}/`
    : link.href;
  return `${SITE.siteUrl}/`;
}

function metaDescription() {
  return document.querySelector('meta[name="description"]')?.content?.trim() || undefined;
}

function buildWebSite() {
  return {
    "@type": "WebSite",
    "@id": `${SITE.siteUrl}/#website`,
    url: `${SITE.siteUrl}/`,
    name: SITE.businessName,
    inLanguage: "it-IT",
    publisher: { "@id": `${SITE.siteUrl}/#business` },
  };
}

function buildWebPage(canon) {
  const page = {
    "@type": "WebPage",
    "@id": `${canon}#webpage`,
    url: canon,
    name: document.title,
    isPartOf: { "@id": `${SITE.siteUrl}/#website` },
    inLanguage: "it-IT",
  };
  const desc = metaDescription();
  if (desc) page.description = desc;
  const h1 = cleanText(document.querySelector("main h1, h1"));
  if (h1) page.headline = h1;
  return page;
}

function buildBreadcrumbList(canon) {
  const nav = document.querySelector("nav.breadcrumb");
  if (!nav) return null;

  const parts = [];
  nav.childNodes.forEach((node) => {
    if (node.nodeType !== 1) return;
    const el = /** @type {HTMLElement} */ (node);
    if (el.getAttribute("aria-hidden") === "true") return;
    const label = cleanText(el);
    if (!label || label === "/") return;
    if (el.tagName === "A") {
      const href = el.getAttribute("href") || "";
      let itemUrl;
      if (/^https?:/i.test(href)) itemUrl = href;
      else if (href === "index.html" || href === "/" || href === "")
        itemUrl = `${SITE.siteUrl}/`;
      else
        itemUrl = `${SITE.siteUrl}/${href.replace(/\.html$/, "/").replace(/^\//, "")}`;
      parts.push({ name: label, item: itemUrl });
    } else if (el.tagName === "SPAN") {
      parts.push({ name: label, item: canon });
    }
  });

  if (parts.length < 2) return null;

  return {
    "@type": "BreadcrumbList",
    "@id": `${canon}#breadcrumb`,
    itemListElement: parts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      item: p.item,
    })),
  };
}

function buildFaqPage(canon) {
  const headings = [...document.querySelectorAll("h2")];
  const faqH2 = headings.find((h) =>
    /domande\s+frequenti|domande\s+sulla\s+sede|^faq$/i.test(cleanText(h)),
  );
  if (!faqH2) return null;

  const section = faqH2.closest("section") || faqH2.parentElement;
  if (!section) return null;

  const panels = section.querySelectorAll("details.topic-panel");
  const mainEntity = [];
  panels.forEach((panel) => {
    const q = cleanText(
      panel.querySelector(".topic-title") || panel.querySelector("summary"),
    );
    const a = cleanText(panel.querySelector(".topic-body"));
    if (!q || !a) return;
    // Skip non-question teasers (home accordion lives under a different H2)
    mainEntity.push({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    });
  });

  if (mainEntity.length === 0) return null;

  return {
    "@type": "FAQPage",
    "@id": `${canon}#faq`,
    url: canon,
    mainEntity,
  };
}

/**
 * Optional Service node when the page is a priced service and the price
 * is visible in the hero (matches on-page content).
 */
function buildServiceIfVisible(canon) {
  const path = new URL(canon).pathname.replace(/\/$/, "") || "/";
  const map = {
    "/osteopatia": { name: "Osteopatia", price: "70" },
    "/valutazione-funzionale": {
      name: "Valutazione funzionale",
      price: "70",
    },
    "/return-to-play": {
      name: "Return to Play e recupero sportivo",
      price: "60",
    },
    "/preparazione-atletica": {
      name: "Preparazione atletica e Strength & Conditioning",
      price: "60",
    },
  };
  const conf = map[path];
  if (!conf) return null;

  const visible = document.body.innerText || "";
  const priceRe = new RegExp(`${conf.price}\\s*€`);
  if (!priceRe.test(visible)) return null;

  return {
    "@type": "Service",
    "@id": `${canon}#service`,
    name: conf.name,
    url: canon,
    provider: { "@id": `${SITE.siteUrl}/#business` },
    areaServed: {
      "@type": "City",
      name: SITE.addressLocality,
    },
    offers: {
      "@type": "Offer",
      price: conf.price,
      priceCurrency: "EUR",
      url: canon,
    },
  };
}

export function mountSchema() {
  if (document.querySelector('script[data-schema="auto"]')) return;

  const canon = canonicalUrl();
  const graph = [buildWebSite(), buildWebPage(canon)];

  const crumbs = buildBreadcrumbList(canon);
  if (crumbs) {
    graph.push(crumbs);
    graph[1].breadcrumb = { "@id": crumbs["@id"] };
  }

  const faq = buildFaqPage(canon);
  if (faq) {
    graph.push(faq);
    graph[1].mainEntity = { "@id": faq["@id"] };
  }

  const service = buildServiceIfVisible(canon);
  if (service) {
    graph.push(service);
    if (!graph[1].mainEntity) graph[1].mainEntity = { "@id": service["@id"] };
  }

  injectJsonLd({
    "@context": "https://schema.org",
    "@graph": graph,
  });
}
