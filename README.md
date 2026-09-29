# Passione Fantascienza

Prototipo editoriale statico del magazine e community hub **Passione Fantascienza**. Il sito affianca il [gruppo Telegram](https://t.me/fantascienza1): Telegram ospita la conversazione, mentre il sito cura e conserva i contenuti pubblici.

Il progetto usa Astro, Content Collections, Markdown e CSS nativo. Non richiede backend, database o JavaScript client-side per la navigazione e la lettura.

## Requisiti

- Node.js `>=22.12.0`; per allinearsi al deploy è consigliato Node.js 24 LTS;
- npm, incluso con Node.js;
- Git.

## Installazione e sviluppo locale

```sh
npm ci
npm run dev
```

Il server di sviluppo indica l'indirizzo locale nel terminale. Per impostazione predefinita il sito è raggiungibile da questo computer su:

<http://localhost:4321/passionefantascienza/>

Per renderlo visibile anche da un altro dispositivo nella stessa rete locale:

```sh
npm run dev -- --host 0.0.0.0
```

Poi aprire dal dispositivo `http://IP-DEL-COMPUTER:4321/passionefantascienza/`. Il firewall locale deve consentire connessioni in ingresso sulla porta 4321.

## Controlli e build

```sh
npm run check
npm run build
npm run preview
```

- `npm run check` valida componenti, TypeScript e Content Collections;
- `npm run build` genera il sito statico in `dist/`;
- `npm run preview` serve localmente la build su <http://localhost:4321/passionefantascienza/>.

`dist/` è output riproducibile e non viene versionata.

## Struttura del repository

```text
src/
  components/       componenti riutilizzabili dell'interfaccia
  content/
    blog/            articoli Markdown o MDX
    authors/         profili autore Markdown o MDX
  layouts/           layout di pagina e degli articoli
  pages/             route statiche e dinamiche
  styles/            design system e stili globali
  utils/             URL base-aware, date, tassonomia e filtri
  content.config.ts  schemi validati delle collezioni
public/
  downloads/docs/    PDF pubblici conservati agli URL storici
documentazione/
  mandati/           mandati operativi
  specifiche/        specifiche funzionali e tecniche sorgente
```

La configurazione GitHub Pages è in `astro.config.mjs`:

- `site`: `https://giordanosognatore.github.io`
- `base`: `/passionefantascienza`

Link e asset interni devono passare dalle utility base-aware oppure includere esplicitamente il sottopercorso di pubblicazione.

## Aggiungere un autore

Creare un file in `src/content/authors/`, per esempio `nome-autore.md`:

```md
---
name: Nome Autore
slug: nome-autore
bio: Breve descrizione verificata dell'autore.
website: https://example.com
email: autore@example.com
---

Biografia estesa facoltativa in Markdown.
```

`website`, `email` e `avatar` sono facoltativi. Non inventare informazioni biografiche. Lo slug deve essere minuscolo, con parole separate da trattini, e deve coincidere con quello usato negli URL.

## Aggiungere un articolo

Creare un file Markdown o MDX in `src/content/blog/`:

```md
---
title: Titolo dell'articolo
description: Descrizione breve usata nelle card e nei metadata SEO.
pubDate: 2026-10-04
updatedDate: 2026-10-06
author: nome-autore
category: Libri
tags:
  - Classici
  - Robotica
featured: false
draft: true
cover: images/nome-cover.webp
coverAlt: Descrizione significativa dell'immagine
---

Testo dell'articolo in Markdown.
```

Categorie ammesse inizialmente:

- `Libri`
- `Cinema`
- `Serie TV`
- `Community`
- `Approfondimenti`

Regole principali:

- `author` deve riferirsi all'ID di un file presente nella collezione `authors`;
- `tags` è un elenco estendibile liberamente;
- se è presente `cover`, `coverAlt` è obbligatorio;
- `cover` indica un percorso relativo al base path, normalmente un file ottimizzato collocato in `public/images/`;
- lo slug pubblico deriva dal percorso del file: dopo la pubblicazione non va cambiato senza pianificare un redirect;
- prima di pubblicare eseguire almeno `npm run check` e `npm run build`.

## Articoli in bozza

Con `draft: true` l'articolo rimane nel repository ma viene escluso da:

- archivio e homepage;
- route articolo generata;
- pagine autore;
- feed RSS.

Per pubblicarlo, impostare `draft: false` e verificare nuovamente il progetto.

## RSS, sitemap e SEO

- feed RSS: `/passionefantascienza/rss.xml`
- sitemap: `/passionefantascienza/sitemap-index.xml`
- robots: `/passionefantascienza/robots.txt`

Ogni pagina usa title, description, canonical e metadata Open Graph di base. Gli articoli ereditano i metadati dalla Content Collection.

## Deploy su GitHub Pages

Il workflow `.github/workflows/pages.yml`, attivato su `main` o manualmente, usa l'azione ufficiale Astro per:

1. installare le dipendenze dal lockfile;
2. eseguire validazione e build;
3. caricare l'artefatto statico;
4. pubblicarlo tramite GitHub Pages.

Il repository Pages deve avere **GitHub Actions** selezionato come sorgente di pubblicazione. La pipeline richiede soltanto i permessi `contents: read`, `pages: write` e `id-token: write`.

## Specifiche e documenti statici

Le fonti di progetto sono in `documentazione/specifiche/`; il mandato della migrazione è in `documentazione/mandati/`.

I due PDF pubblici sono conservati in `public/downloads/docs/` e la build li copia in `dist/downloads/docs/`. Restano raggiungibili agli URL storici, ma non sono promossi o elencati nell'interfaccia pubblica. I DOCX sorgente restano soltanto in `documentazione/`.
