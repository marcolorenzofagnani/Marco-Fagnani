/* CSS via <link> in HTML head — evita doppio inject Vite e flash dello skip-link */
import { SITE, formatAddressOneLine } from "./site-info.js";
import { mountSchema } from "./schema.js";
import { mountSampleRadars } from "./sample-radar.js";

const WA =
  SITE.waBase +
  "?text=" +
  encodeURIComponent("Ciao Marco, vorrei prenotare una seduta.");

const NAV = [
  ["chi-sono.html", "Chi sono"],
  ["osteopatia.html", "Osteopatia"],
  ["valutazione-funzionale.html", "Valutazione"],
  ["return-to-play.html", "Return to play"],
  ["preparazione-atletica.html", "Preparazione"],
  ["blog.html", "Blog"],
  ["milano-forlanini.html", "Sede"],
  ["contatti.html", "Contatti"],
];

function waIcon(size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.86 11.86 0 0 0 5.76 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.44ZM12.07 21.15h-.01a9.3 9.3 0 0 1-4.74-1.3l-.34-.2-3.74.98 1-3.64-.22-.37a9.27 9.27 0 0 1-1.42-4.93c0-5.12 4.17-9.29 9.3-9.29a9.24 9.24 0 0 1 9.28 9.29c0 5.12-4.17 9.28-9.28 9.28Zm5.1-6.96c-.28-.14-1.65-.81-1.9-.9-.26-.1-.44-.14-.63.14-.19.28-.72.9-.88 1.08-.16.19-.33.21-.6.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.38-1.64-1.54-1.91-.16-.28-.02-.43.12-.57.13-.12.28-.33.42-.49.14-.16.19-.28.28-.47.1-.19.05-.35-.02-.49-.07-.14-.63-1.51-.86-2.07-.23-.55-.46-.47-.63-.48h-.54c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.34s1.01 2.71 1.15 2.9c.14.19 1.98 3.02 4.8 4.23 1.79.77 2.3.77 2.72.66.42-.1 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.26-.19-.54-.33Z"/></svg>`;
}

function setMenuOpen(toggle, panel, open) {
  panel.classList.toggle("open", open);
  if (open) panel.removeAttribute("hidden");
  else panel.setAttribute("hidden", "");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
  if (open) {
    // focus after un-hiding so the link is focusable
    requestAnimationFrame(() => panel.querySelector("a")?.focus());
  } else {
    toggle.focus();
  }
}

function mountChrome() {
  const header = document.querySelector("[data-header]");
  const footer = document.querySelector("[data-footer]");
  if (header) {
    header.innerHTML = `
      <div class="container header-inner">
        <a class="brand" href="index.html" aria-label="${SITE.personName} — home">
          <picture>
            <source type="image/webp" srcset="/images/logo-header.webp" />
            <img class="brand-logo" src="/images/logo-header.png" alt="" width="280" height="66" decoding="async" />
          </picture>
        </a>
        <nav class="nav" aria-label="Principale">
          ${NAV.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}
        </nav>
        <div class="header-actions">
          <a class="btn btn-wa" href="${WA}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp — apre una nuova scheda">${waIcon()}<span class="wa-label" aria-hidden="true">WhatsApp</span></a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Apri menu">Menu</button>
        </div>
      </div>
      <nav class="nav-panel" id="mobile-nav" aria-label="Menu mobile" hidden>
        <div class="container">
          ${NAV.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}
        </div>
      </nav>
    `;
    const toggle = header.querySelector(".nav-toggle");
    const panel = header.querySelector(".nav-panel");

    toggle?.addEventListener("click", () => {
      const open = !panel.classList.contains("open");
      setMenuOpen(toggle, panel, open);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("open")) {
        setMenuOpen(toggle, panel, false);
      }
    });
  }

  if (footer) {
    footer.innerHTML = `
      <div class="container footer-grid">
          <div>
            <strong>${SITE.personName}</strong><br />
            ${SITE.jobTitle}<br />
            Studente di Fisioterapia — Alma Mater Europaea<br />
            ${formatAddressOneLine()} · ${SITE.zone}
          </div>
        <div>
          <strong>Contatti</strong><br />
          <a href="${WA}" target="_blank" rel="noopener noreferrer">WhatsApp ${SITE.phoneDisplay}</a><br />
          <a href="${SITE.phoneHref}">${SITE.phoneDisplay}</a><br />
          <a href="mailto:${SITE.email}">${SITE.email}</a><br />
          ${SITE.transitNote}
        </div>
        <nav aria-label="Pagine nel piè di pagina">
          <strong>Pagine</strong><br />
          <a href="milano-forlanini.html">Sede Forlanini</a> ·
          <a href="chi-sono.html">Chi sono</a> ·
          <a href="osteopatia.html">Osteopatia</a> ·
          <a href="valutazione-funzionale.html">Valutazione</a> ·
          <a href="return-to-play.html">Return to play</a> ·
          <a href="preparazione-atletica.html">Preparazione</a> ·
          <a href="blog.html">Blog</a> ·
          <a href="problemi.html">Guide</a> ·
          <a href="contatti.html">Contatti</a> ·
          <a href="privacy.html">Privacy</a>
        </nav>
      </div>
      <div class="container" style="margin-top:1.25rem">
        P.IVA ${SITE.vat} · Tutti i diritti riservati
      </div>
    `;
  }

  if (!document.querySelector(".wa-float")) {
    const float = document.createElement("a");
    float.className = "wa-float";
    float.href = WA;
    float.target = "_blank";
    float.rel = "noopener noreferrer";
    float.setAttribute("aria-label", "Scrivi su WhatsApp — apre una nuova scheda");
    float.innerHTML = waIcon(28);
    document.body.appendChild(float);
  }
}

mountChrome();
mountSchema();
mountSampleRadars();

export { WA, SITE };
