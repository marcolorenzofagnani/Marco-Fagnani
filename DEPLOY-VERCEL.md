# Deploy Marco Fagnani — Vercel + GitHub (dominio su Aruba)

Stack consigliato: **sito su Vercel**, **codice su GitHub**, **dominio di proprietà su Aruba** (solo DNS).

## 1. GitHub

Opzione A — monorepo attuale (`progetto-ai-pt`):

1. Push del branch su GitHub.
2. In Vercel: *Import* del repo.
3. **Root Directory** = `sites/marco-fagnani-osteopata`
4. Framework: Other · Build = `npm run build` · Output = `dist`

Opzione B — repo dedicato (più pulito a lungo):

```bash
# dalla cartella del sito
git init
git add .
git commit -m "Site: Marco Fagnani osteopata"
git remote add origin git@github.com:TUO_USER/marco-fagnani-osteopata.git
git push -u origin main
```

Poi Vercel Root Directory = `.`

## 2. Vercel

1. vercel.com → New Project → collega GitHub.
2. Root Directory come sopra.
3. Build Command: `npm run build` (il `prebuild` genera zone, sitemap, `vercel.json`).
4. Output Directory: `dist`
5. Deploy.

`vercel.json` include:

- `cleanUrls` + `trailingSlash` (URL `/osteopatia/` senza `.html`)
- redirect 301 dalle URL WordPress vecchie
- security headers
- noindex su 404 e facsimile report

## 3. DNS Aruba → Vercel (dominio resta tuo)

In Vercel → Project → Settings → Domains → aggiungi:

- `www.marcofagnaniosteopata.it`
- `marcofagnaniosteopata.it`

Vercel ti mostra i record. Su **Aruba** (gestione DNS del dominio), tipicamente:

| Tipo | Nome | Valore |
|------|------|--------|
| A | `@` | `76.76.21.21` (IP Vercel — verifica in dashboard) |
| CNAME | `www` | `cname.vercel-dns.com` (o valore mostrato da Vercel) |

Oppure nameserver Vercel se preferisci delega completa (meno comune se vuoi tenere email su Aruba).

**Non** serve caricare file via File Manager Aruba per il sito: Aruba = proprietà dominio (+ eventuale email).

TTL: dopo il cambio DNS attendi propagazione (spesso 15 min–2 h).

## 4. Checklist post-go-live

- [ ] `https://www.marcofagnaniosteopata.it/` → 200
- [ ] URL inventato → 404 (non home)
- [ ] `/osteopatia.html` → 301 a `/osteopatia/`
- [ ] Nessun `X-Robots-Tag: none` sulle pagine pubbliche
- [ ] Search Console → proprietà + sitemap `https://www.marcofagnaniosteopata.it/sitemap.xml`
- [ ] Prova una landing zona, es. `/osteopata-lambrate-milano/`

## 5. Landing zona (amo SEO)

Generate da `src/zone-landings.js` → `npm run zones`.

**Non sono nel menu.** Sono in sitemap e collegate dal blog.  
Wording: solo **osteopata / chinesiologo** (mai “fisioterapia”).

Aggiungere una zona: modifica `zone-landings.js`, poi `npm run zones` (o build).
