# Marco Fagnani — sito personale

Sito statico (Vite) per `marcofagnaniosteopata.it`.
Separato da Perform Therapy / KinHealth.

## Dev

```bash
cd sites/marco-fagnani-osteopata
npm install
npm run dev
```

Apri http://127.0.0.1:5177

## Build

```bash
npm run build
```

`prebuild` genera `public/robots.txt` e `public/sitemap.xml`.
Output in `dist/` (include `.htaccess` da `public/`).

### Checklist rilascio Aruba (produzione file statici)

> **Consigliato:** Vercel + GitHub, dominio su Aruba solo come DNS — vedi
> [`DEPLOY-VERCEL.md`](./DEPLOY-VERCEL.md).

Se resti su File Manager Aruba:

1. Caricare **solo** il contenuto di `dist/` nella root del dominio.
2. Verificare `.htaccess` e `mod_rewrite`.
3. Controllare 200 / 301 / 404 come sotto.
4. Nessun `X-Robots-Tag: none` sulle pagine pubbliche.
5. Sitemap in Search Console.
6. Backup WP prima del cutover.

### URL canoniche (produzione)

- Host: `https://www.marcofagnaniosteopata.it`
- Path con **trailing slash** (home = `/`)
- I file `*.html` vengono serviti come `/slug/` via Apache rewrite
- Redirect 301 dalle URL WordPress vecchie (vedi `public/.htaccess`)

Pagine **noindex**: `404.html`, facsimile `esempio-report-*`.
`/traumi-sportivi-milano/` fa **301** a `/recupero-infortunio-sportivo/`.
Le vecchie landing `osteopata-*-milano` fanno **301** a `/milano-forlanini/`.

Lista URL sitemap: `src/seo-urls.js` → `npm run seo`.

## Blog e guide

- Hub: `blog.html` (menu **Blog**) — guide + landing Forlanini/RTP/preparazione/valutazione.
- Indice guide: `problemi.html` (ancora in footer).

Indice: `problemi.html`. Ogni guida segue lo stesso schema H2:

1. Che cos’è  
2. Presentazioni comuni  
3. Possibili fattori coinvolti  
4. Cosa può essere utile valutare  
5. Movimento / carico  
6. Quando rivolgersi a un medico  
7. Come può inserirsi il lavoro di Marco  
8. FAQ · servizi correlati · CTA  

Per aggiungerne una: crea `slug.html` con breadcrumb → `problemi.html`,
registrala in `vite.config.js` e nell’indice `problemi.html`.
Link interni solo se semanticamente pertinenti.
