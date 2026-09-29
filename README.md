# Fantascienza e dintorni

Sito statico del magazine indipendente **Fantascienza e dintorni**, dedicato a libri, cinema, serie TV, videogames, approfondimenti e alla futura community del progetto.

Il progetto usa Astro, Content Collections, Markdown e CSS nativo. Non richiede backend, database o JavaScript client-side per la navigazione e la lettura.

## Requisiti

- Node.js `>=24.0.0`;
- npm, incluso con Node.js;
- Git.

## Installazione e sviluppo locale

```sh
npm ci
npm run dev
```

Il server di sviluppo indica l'indirizzo locale nel terminale. Per impostazione predefinita il sito è raggiungibile su:

<http://localhost:4321/fantascienzaedintorni/>

Per renderlo visibile anche da un altro dispositivo nella stessa rete locale:

```sh
npm run dev -- --host 0.0.0.0
```

Poi aprire `http://IP-DEL-COMPUTER:4321/fantascienzaedintorni/`. Il firewall locale deve consentire connessioni in ingresso sulla porta 4321.

## Controlli e build

```sh
npm run check
npm run build
npm run test:site
npm run preview
```

- `npm run check` valida componenti, TypeScript e Content Collections;
- `npm run build` genera il sito statico in `dist/`;
- `npm run test:site` controlla output, metadata, link, asset e base path della build già generata;
- `npm run preview` serve la build su <http://localhost:4321/fantascienzaedintorni/>.

`dist/` è un output riproducibile e non viene versionato.

## Struttura del repository

```text
site.config.mjs       nome, origine e base path pubblici
src/
  components/         componenti riutilizzabili dell'interfaccia
  content/
    blog/              articoli Markdown o MDX
    authors/           profili autore Markdown o MDX
  layouts/             layout di pagina e degli articoli
  pages/               route statiche e dinamiche
  styles/              design system e stili globali
  utils/               URL base-aware, date, tassonomia e filtri
  content.config.ts    schemi validati delle collezioni
public/                favicon, robots e altri asset pubblici
scripts/               verifiche automatiche della build
documentazione/
  archivio/
    passione-fantascienza/  documenti della precedente fase progettuale
```

La configurazione GitHub Pages usa:

- `site`: `https://giordanosognatore.github.io`
- `base`: `/fantascienzaedintorni`

Link e asset interni devono passare dalle utility base-aware oppure includere esplicitamente il sottopercorso di pubblicazione.

## Tassonomia editoriale

Le categorie ammesse sono:

- `Libri`
- `Cinema`
- `Serie TV`
- `Videogames`
- `Approfondimenti`
- `Community`

Le quattro aree principali — Libri, Cinema, Serie TV e Videogames — hanno ingressi distinti in homepage. Approfondimenti e Community restano sezioni autonome nell'archivio.

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
category: Videogames
tags:
  - Mondi virtuali
  - Game design
featured: false
draft: true
cover: images/nome-cover.webp
coverAlt: Descrizione significativa dell'immagine
---

Testo dell'articolo in Markdown.
```

Regole principali:

- `author` deve riferirsi all'ID di un file presente nella collezione `authors`;
- `category` deve appartenere alla tassonomia editoriale;
- `tags` è un elenco estendibile liberamente;
- se è presente `cover`, `coverAlt` è obbligatorio;
- `cover` indica un percorso relativo al base path, normalmente un file in `public/images/`;
- lo slug pubblico deriva dal percorso del file e non va cambiato dopo la pubblicazione senza pianificare un redirect;
- prima di pubblicare eseguire `npm run check`, `npm run build` e `npm run test:site`.

## Articoli in bozza

Con `draft: true` l'articolo rimane nel repository ma viene escluso da:

- archivio e homepage;
- route articolo generata;
- pagine autore;
- feed RSS.

Il contenuto dimostrativo presente nel repository resta in bozza e non rappresenta un articolo editoriale pubblicato.

## RSS, sitemap e SEO

- sito: <https://giordanosognatore.github.io/fantascienzaedintorni/>
- feed RSS: `/fantascienzaedintorni/rss.xml`
- sitemap: `/fantascienzaedintorni/sitemap-index.xml`
- robots: `/fantascienzaedintorni/robots.txt`

Ogni pagina usa title, description, canonical e metadata Open Graph. Gli articoli ereditano i metadati dalla Content Collection.

## Deploy su GitHub Pages

Il workflow `.github/workflows/pages.yml`, attivato su `main` o manualmente, usa l'azione ufficiale Astro per:

1. installare le dipendenze dal lockfile con Node.js 24;
2. eseguire check, build e test del sito generato;
3. caricare l'artefatto statico;
4. pubblicarlo tramite GitHub Pages.

Il repository Pages deve avere **GitHub Actions** selezionato come sorgente di pubblicazione. La pipeline usa i permessi `contents: read`, `pages: write` e `id-token: write`.

## Documentazione storica

I documenti relativi alla precedente fase progettuale sono conservati senza riscrittura retroattiva in `documentazione/archivio/passione-fantascienza/`. DOCX e PDF restano nel repository come archivio, ma non sono copiati nell'output web né promossi dal sito corrente.
