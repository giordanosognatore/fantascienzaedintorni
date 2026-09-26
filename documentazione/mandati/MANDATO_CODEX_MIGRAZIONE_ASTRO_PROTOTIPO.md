# MANDATO CODEX — Migrazione ad Astro e prototipo editoriale di Passione Fantascienza

**Repository:** `giordanosognatore/passionefantascienza`  
**Base canonica:** ultimo `origin/main`  
**Branch di lavoro richiesto:** `feat/astro-blog-prototype`  
**Sito attuale:** `https://giordanosognatore.github.io/passionefantascienza/`  
**Lingua del sito:** italiano

## 1. Contesto

Il repository contiene attualmente una landing page statica pubblicata con GitHub Pages. L'obiettivo è trasformarla nel primo prototipo funzionante del magazine/community hub **Passione Fantascienza**, mantenendo GitHub Pages come hosting e usando **Astro** come static site generator.

Il sito deve essere concepito fin dall'inizio come base riutilizzabile per il sito definitivo: non una demo usa-e-getta. Telegram resta il luogo della conversazione; il sito diventa la parte pubblica, permanente, ordinata e indicizzabile della community.

Prima di intervenire leggere e rispettare:

- `AGENTS.md`
- `README.md`
- `documentazione/specifiche/funzionali/Passione_Fantascienza_Proposta_Giordano_Sognatore_a_Riccardo.docx`
- `documentazione/specifiche/tecniche/Passione_Fantascienza_Piano_Tecnico_Implementazione.docx`

I PDF presenti in `dist/downloads/docs/` sono derivati pubblici dei due documenti sopra e devono restare raggiungibili allo stesso URL anche dopo la migrazione.

## 2. Obiettivo del mandato

Realizzare una migrazione minima ma completa da landing statica a progetto Astro con un blog realmente funzionante, mantenendo l'identità visiva corrente come base e predisponendo l'architettura editoriale per la crescita successiva.

A fine lavoro devono esistere almeno:

- homepage editoriale responsive;
- archivio blog;
- pagina articolo dinamica;
- modello autori;
- categorie e tag;
- pagina Community/Telegram;
- pagina Risorse, anche inizialmente essenziale;
- RSS;
- sitemap;
- metadata SEO/Open Graph di base;
- build e deploy automatici su GitHub Pages;
- documentazione aggiornata per sviluppo e pubblicazione dei contenuti.

## 3. Vincoli architetturali

1. Usare **Astro stabile corrente** senza framework UI client-side aggiuntivi salvo necessità dimostrata.
2. Il sito deve restare **static-first** e compatibile con GitHub Pages.
3. Non introdurre backend, database, CMS, autenticazione, analytics o servizi esterni in questa fase.
4. Gli articoli devono essere file Markdown/MDX gestiti con **Astro Content Collections** e schema validato.
5. Gli autori devono essere contenuti strutturati, non dati duplicati manualmente nelle pagine.
6. Evitare JavaScript client-side quando HTML/CSS statici sono sufficienti.
7. Mantenere dipendenze al minimo.
8. Non aggiungere React, Vue, Svelte o librerie CSS pesanti.
9. Curare accessibilità semantica, navigazione da tastiera, contrasto e responsive design.
10. Non inserire il nome reale del proprietario/autore del repository in file, metadata, esempi, commit message o documentazione. L'identità pubblica del progetto è **Giordano Sognatore** (`giordanosognatore`, `giordano.sognatore@gmail.com`).

## 4. Configurazione GitHub Pages

Il progetto è una GitHub Project Page e viene pubblicato sotto:

`https://giordanosognatore.github.io/passionefantascienza/`

Configurare Astro tenendo conto del sottopercorso:

- `site`: `https://giordanosognatore.github.io`
- `base`: `/passionefantascienza`

Tutti i link interni e gli asset devono funzionare correttamente sotto il `base`. Evitare path assoluti fragili come `/blog/...` quando ignorano il base path.

La build finale deve produrre `dist/`, ma dopo la migrazione **`dist/` non deve più essere sorgente versionata**: va considerata output di build e aggiunta a `.gitignore`.

## 5. Conservazione dei download esistenti

Attualmente i PDF pubblici sono sotto:

`dist/downloads/docs/`

Durante la migrazione spostarli nella sorgente statica appropriata, preferibilmente:

`public/downloads/docs/`

La build deve continuare a produrre esattamente questi URL pubblici:

- `/passionefantascienza/downloads/docs/Passione_Fantascienza_Proposta_Giordano_Sognatore_a_Riccardo.pdf`
- `/passionefantascienza/downloads/docs/Passione_Fantascienza_Piano_Tecnico_Implementazione.pdf`

Non aggiungere link a questi PDF nell'interfaccia pubblica in questa fase. Devono essere raggiungibili conoscendo l'URL, ma non promossi o elencati nel sito.

I DOCX sorgente restano solo in `documentazione/` e non devono essere copiati nell'output web.

## 6. Struttura di progetto attesa

La struttura può essere adattata se motivato, ma deve restare semplice e leggibile. Riferimento:

```text
src/
  components/
    Header.astro
    Footer.astro
    ArticleCard.astro
    HeroArticle.astro
    TelegramCTA.astro
    AuthorCard.astro
  content/
    blog/
    authors/
    config.ts
  layouts/
    BaseLayout.astro
    ArticleLayout.astro
  pages/
    index.astro
    blog/
      index.astro
      [...slug].astro
    autori/
    community.astro
    risorse.astro
    rss.xml.js
  styles/
    global.css
public/
  images/
  downloads/docs/
```

Usare la convenzione Astro corrente per le Content Collections se nel frattempo è cambiata rispetto a questo esempio; privilegiare la documentazione ufficiale e spiegare nella PR eventuali scostamenti.

## 7. Modello contenuti

### Blog

Definire almeno i seguenti campi validati:

- `title`
- `description`
- `pubDate`
- `updatedDate` opzionale
- `author`
- `category`
- `tags`
- `featured` booleano
- `draft` booleano
- `cover` opzionale
- `coverAlt` obbligatorio se esiste `cover`

Categorie iniziali:

- Libri
- Cinema
- Serie TV
- Community
- Approfondimenti

Predisporre la struttura in modo che categorie e tag possano essere estesi senza rifare i template.

### Autori

Campi minimi:

- nome visualizzato;
- slug;
- breve biografia;
- eventuale sito/link esterno;
- eventuale avatar;
- email opzionale.

Creare il profilo iniziale di **Giordano Sognatore** senza inventare dati biografici non presenti nel repository o nel mandato. Usare solo informazioni esplicitamente disponibili e una descrizione neutra/minimale se necessaria.

## 8. Homepage

Evolvere la landing corrente, non sostituirla con un tema generico.

Mantenere come concetto identitario:

**«La fantascienza è una conversazione.»**

La homepage deve mostrare, con buon comportamento anche quando gli articoli sono pochi o zero:

1. hero e CTA verso Telegram;
2. articolo principale/in evidenza, quando disponibile;
3. ultimi articoli;
4. sezione **Dalla community** / **Questa settimana in Passione Fantascienza**;
5. ingressi verso Libri, Cinema/TV, Approfondimenti e Community;
6. eventuale autore ospite/profilo autore se disponibile;
7. nuova CTA Telegram a fine pagina.

Non riempire la home con lorem ipsum esteso.

## 9. Contenuto dimostrativo

Per verificare tecnicamente routing, card e layout è consentito creare **un solo articolo dimostrativo chiaramente marcato come contenuto di prototipo**, destinato a essere sostituito dai primi articoli reali.

Non inventare recensioni, citazioni, interviste, dichiarazioni della community o fatti editoriali attribuiti a persone reali.

L'articolo demo deve essere breve, neutro e inequivocabilmente etichettato come dimostrativo.

## 10. Pagine e navigazione

Implementare almeno:

- `/`
- `/blog/`
- `/blog/<slug>/`
- `/autori/` e almeno la pagina autore di Giordano Sognatore;
- `/community/`
- `/risorse/`

Se vengono implementate pagine categoria/tag già in questa fase, farlo in modo statico e semplice. Non è obbligatorio introdurre una ricerca interna nel primo prototipo.

La navigazione deve funzionare con il base path di GitHub Pages.

## 11. SEO e feed

Aggiungere:

- title e description per pagina;
- canonical URL coerenti;
- Open Graph di base;
- `robots` appropriato;
- sitemap tramite integrazione ufficiale Astro o soluzione equivalente leggera;
- RSS tramite pacchetto ufficiale Astro o soluzione equivalente;
- HTML semantico.

Non introdurre tracking.

## 12. CSS e identità visiva

Riutilizzare come punto di partenza l'attuale `dist/assets/site.css` e l'aspetto della landing.

Obiettivi:

- atmosfera fantascientifica/editoriale, non template SaaS;
- niente estetica cliché «neon + astronave generica» come unica identità;
- leggibilità prioritaria per articoli lunghi;
- layout responsive mobile-first;
- larghezza di lettura controllata per il corpo articolo;
- componenti coerenti per card, badge, CTA e metadata;
- preferire CSS nativo e custom properties.

## 13. GitHub Actions

Sostituire l'attuale workflow che pubblica direttamente `dist/` versionata con una pipeline che:

1. fa checkout;
2. installa Node con versione LTS adatta alla versione Astro selezionata;
3. installa dipendenze con lockfile (`npm ci`);
4. esegue la build Astro;
5. pubblica l'artefatto su GitHub Pages.

Preferire l'azione ufficiale Astro/GitHub Pages quando appropriata e versioni correnti/stabili delle Actions.

Preservare i permessi minimi necessari (`contents: read`, `pages: write`, `id-token: write`).

## 14. README e workflow editoriale

Aggiornare `README.md` documentando almeno:

- prerequisiti;
- installazione (`npm ci`);
- sviluppo locale;
- build;
- preview;
- struttura del repository;
- come aggiungere un articolo;
- come aggiungere un autore;
- comportamento `draft`;
- deploy GitHub Pages;
- posizione delle specifiche e dei download statici.

Il workflow editoriale deve rendere possibile pubblicare in futuro un articolo principalmente aggiungendo un file Markdown e gli eventuali asset.

## 15. Cose esplicitamente fuori scope

Non implementare in questo mandato:

- database;
- login/account utenti;
- commenti proprietari;
- newsletter;
- analytics;
- CMS visuale;
- Pagefind/ricerca interna;
- calendario eventi avanzato;
- e-commerce/affiliazioni;
- API Telegram o bot;
- importazione automatica delle chat;
- votazioni persistenti;
- backend serverless.

Queste funzioni saranno valutate solo dopo il prototipo.

## 16. Controlli obbligatori

Prima della consegna eseguire almeno:

```sh
npm ci
npm run build
```

E verificare che nell'output esistano e siano coerenti almeno:

- homepage;
- archivio blog;
- pagina articolo demo;
- pagina autore;
- pagina Community;
- pagina Risorse;
- RSS;
- sitemap;
- i due PDF in `dist/downloads/docs/`.

Controllare inoltre:

- assenza di link rotti evidenti;
- asset e link corretti sotto `/passionefantascienza/`;
- nessun riferimento al nome reale del proprietario;
- nessun segreto/token/file `.env` versionato;
- `git diff --check` pulito;
- `git status --short` coerente con la consegna.

Se possibile eseguire anche una preview locale e un controllo responsive almeno su larghezze mobile e desktop.

## 17. Git e consegna

1. Partire dall'ultimo `origin/main` e annotare lo SHA della base effettivamente usata.
2. Creare il branch locale `feat/astro-blog-prototype`.
3. Non lavorare direttamente su `main`.
4. Usare commit piccoli e descrittivi.
5. Non riscrivere la storia esistente.
6. Non fare merge.
7. **Non usare il connettore GitHub per trasferire file e non fare push automatico.** In particolare, è vietato usare connettori/API GitHub per caricare o sostituire file binari.
8. A fine lavoro creare un **Git bundle** di handoff secondo `AGENTS.md`, verificarlo con `git bundle verify` e calcolarne il checksum SHA-256.
9. Consegnare insieme al bundle un file `COME_APPLICARE_*.txt` con i comandi esatti per applicare le modifiche nel clone locale del proprietario.
10. Il proprietario effettuerà localmente l'applicazione, l'eventuale push e l'eventuale apertura della Pull Request.

La consegna deve includere, nel bundle o nelle istruzioni:

- SHA della base `origin/main` usata;
- branch/ref di handoff;
- SHA del commit finale;
- checksum SHA-256 del bundle;
- sintesi dell'architettura adottata;
- principali file aggiunti/rimossi;
- eventuali decisioni diverse dal mandato e relativa motivazione;
- comandi di test eseguiti e relativo esito;
- URL attesi dopo l'applicazione/merge;
- eventuali limiti noti del prototipo;
- comandi di applicazione del bundle e controlli finali (`git status --short`, build/test pertinenti).

## 18. Criteri di accettazione

Il mandato è completato quando:

- il repository è un progetto Astro riproducibile da sorgente;
- `dist/` è output di build e non più sorgente mantenuta a mano;
- il sito mantiene e sviluppa l'identità della landing iniziale;
- il blog è realmente alimentato da Content Collections Markdown/MDX;
- le pagine richieste vengono generate staticamente;
- GitHub Pages funziona sotto il sottopercorso corretto;
- RSS e sitemap sono generati;
- i due PDF restano scaricabili agli URL previsti senza link pubblici nell'interfaccia;
- il README permette a un nuovo collaboratore tecnico di eseguire e aggiornare il progetto;
- il bundle di handoff è verificato, corredato da SHA-256 e istruzioni di applicazione; Codex non effettua push o merge.

---

**Principio guida:** implementare il minimo necessario per ottenere una base editoriale solida, leggibile e facilmente estendibile. Evitare funzionalità premature e dipendenze superflue.
