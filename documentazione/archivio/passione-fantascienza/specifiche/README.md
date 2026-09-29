# Specifiche di Passione Fantascienza

Questa area raccoglie i documenti di progetto e le specifiche funzionali e tecniche del sito **Passione Fantascienza**.

## Struttura

- `funzionali/`: visione di prodotto, proposta editoriale e specifiche funzionali.
- `tecniche/`: architettura, stack, pipeline e dettagli implementativi.

Le versioni DOCX costituiscono documenti di lavoro conservati nel repository.

Nella configurazione statica attuale, i PDF destinati alla condivisione tramite URL sono pubblicati separatamente in `dist/downloads/docs/` e non sono linkati dalla navigazione del sito. Durante la migrazione ad Astro dovranno essere trasferiti nella sorgente statica `public/downloads/docs/`, mantenendo invariati gli URL pubblici.
