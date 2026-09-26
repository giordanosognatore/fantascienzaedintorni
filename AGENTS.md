# AGENTS.md — Regole operative del repository Passione Fantascienza

Queste regole si applicano a qualunque agente, assistente o automazione che operi sul repository `giordanosognatore/passionefantascienza`.

## 1. Identità pubblica

L'identità pubblica e tecnica da usare per questo progetto è:

- nome/autore: **Giordano Sognatore**
- account GitHub: `giordanosognatore`
- email: `giordano.sognatore@gmail.com`

Non inserire il nome reale del proprietario in file, metadata, commit, documentazione, esempi o output di build.

Quando si producono documenti o altri artefatti che supportano metadata autore/creator, usare **Giordano Sognatore** salvo istruzione diversa.

## 2. Divieto di trasferimento tramite connettore GitHub

È vietato usare il connettore GitHub di ChatGPT o strumenti equivalenti basati su API/connettori per trasferire, caricare, aggiornare o sostituire file binari nel repository.

Il divieto comprende, a titolo esemplificativo:

- `.docx`, `.pdf`, `.epub`;
- immagini (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg` quando trattato come asset binario);
- archivi (`.zip`, `.tar`, `.tgz`, `.gz`);
- font, audio, video e altri artefatti non testuali.

Non aggirare il divieto codificando file binari in Base64 o in altri contenitori testuali per inviarli attraverso API/connettori GitHub.

Per prudenza, gli handoff di modifiche al repository devono usare il workflow a bundle descritto sotto anche quando le modifiche comprendono file testuali, salvo esplicita istruzione contraria del proprietario.

## 3. Workflow di handoff obbligatorio: Git bundle

Quando un agente completa modifiche che devono essere trasferite al repository del proprietario:

1. lavorare in un clone/worktree Git locale, partendo dalla base canonica indicata nel mandato;
2. creare uno o più commit validi e coerenti;
3. non fare push automatico sul repository remoto e non fare merge;
4. creare un **Git bundle** contenente i commit da consegnare;
5. verificare il bundle con `git bundle verify`;
6. calcolare il checksum **SHA-256** del bundle;
7. consegnare insieme al bundle un file di istruzioni, ad esempio `COME_APPLICARE_<nome>.txt`;
8. nelle istruzioni riportare almeno:
   - repository e base attesa;
   - branch/ref contenuto nel bundle;
   - SHA del commit finale;
   - checksum SHA-256 del bundle;
   - comandi esatti per importare/applicare le modifiche;
   - controlli finali consigliati (`git status --short`, eventuali build/test);
9. il proprietario applica localmente il bundle e decide successivamente se effettuare push e aprire una Pull Request.

## 4. Forma consigliata del bundle

Preferire un bundle che esponga una ref descrittiva, ad esempio:

```text
handoff/<task>
```

Esempio di applicazione tramite cherry-pick:

```sh
git switch main
git pull --ff-only origin main
git switch -c <branch-di-lavoro>
git fetch /percorso/consegna.bundle \
  handoff/<task>:refs/remotes/bundle/<task>
git cherry-pick <commit-o-range-indicato-nelle-istruzioni>
git status --short
```

Se il mandato richiede un bundle cumulativo o basato direttamente su una specifica base canonica, seguire la forma indicata nel mandato e riportarla chiaramente nelle istruzioni.

## 5. Controlli prima della consegna

Prima di creare il bundle:

- eseguire i test/build previsti dal mandato;
- eseguire `git diff --check` quando applicabile;
- verificare `git status --short`;
- assicurarsi che non siano inclusi segreti, token, credenziali, `.env` o file temporanei;
- verificare che i file binari siano file reali Git e non rappresentazioni Base64/testuali;
- verificare metadata autore/creator degli artefatti quando rilevanti.

## 6. Precedenza

Queste regole hanno precedenza sulle abitudini operative generiche degli agenti. Un mandato specifico può aggiungere vincoli ulteriori, ma non può usare il connettore GitHub per il trasferimento di file binari salvo esplicito override scritto del proprietario.
