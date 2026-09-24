import { defineConfig } from "vite";
import { resolve } from "node:path";

const FONT_PRELOAD = `
    <link rel="preload" href="/fonts/outfit-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/outfit-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/images/logo-header.webp" as="image" type="image/webp" />`;

const HERO_PRELOAD = `
    <link
      rel="preload"
      as="image"
      type="image/webp"
      href="/images/osteo-hero-w800.webp"
      imagesrcset="/images/osteo-hero-w480.webp 480w, /images/osteo-hero-w800.webp 800w, /images/osteo-hero.webp 1024w"
      imagesizes="100vw"
      fetchpriority="high"
    />`;

export default defineConfig({
  root: ".",
  publicDir: "public",
  server: {
    host: "127.0.0.1",
    port: 5177,
    allowedHosts: [".trycloudflare.com", "localhost", "127.0.0.1"],
  },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        chiSono: resolve(__dirname, "chi-sono.html"),
        osteopatia: resolve(__dirname, "osteopatia.html"),
        valutazione: resolve(__dirname, "valutazione-funzionale.html"),
        rtp: resolve(__dirname, "return-to-play.html"),
        preparazione: resolve(__dirname, "preparazione-atletica.html"),
        contatti: resolve(__dirname, "contatti.html"),
        sede: resolve(__dirname, "milano-forlanini.html"),
        problemi: resolve(__dirname, "problemi.html"),
        blog: resolve(__dirname, "blog.html"),
        schiena: resolve(__dirname, "mal-di-schiena-milano.html"),
        cervicale: resolve(__dirname, "cervicalgia-milano.html"),
        ginocchio: resolve(__dirname, "dolore-ginocchio.html"),
        spalla: resolve(__dirname, "dolore-spalla.html"),
        caviglia: resolve(__dirname, "distorsione-caviglia.html"),
        tendinopatie: resolve(__dirname, "tendinopatie.html"),
        recupero: resolve(__dirname, "recupero-infortunio-sportivo.html"),
        privacy: resolve(__dirname, "privacy.html"),
        notFound: resolve(__dirname, "404.html"),
        reportGp: resolve(__dirname, "esempio-report-generale.html"),
        reportAthlete: resolve(__dirname, "esempio-report-atleta.html"),
      },
    },
  },
  plugins: [
    {
      name: "inject-perf-hints",
      transformIndexHtml(html, ctx) {
        const isHome =
          ctx.filename?.endsWith("index.html") ||
          ctx.path === "/" ||
          ctx.path === "/index.html";
        const inject = FONT_PRELOAD + (isHome ? HERO_PRELOAD : "");
        return html.replace(/<head>/i, `<head>${inject}`);
      },
    },
  ],
});
