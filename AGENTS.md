# AGENTS.md — Regole operative del repository Fantascienza e dintorni

Queste regole si applicano a qualunque agente, assistente o automazione che operi sul repository `giordanosognatore/fantascienzaedintorni`.

## 1. Identità pubblica

L'identità pubblica e tecnica da usare per questo progetto è:

- nome/autore: **Giordano Sognatore**
- account GitHub: `giordanosognatore`
- email: `giordano.sognatore@gmail.com`

Non inserire il nome reale del proprietario in file, metadata, commit, documentazione, esempi o output di build.

Quando si producono documenti o altri artefatti che supportano metadata autore/creator, usare **Giordano Sognatore** salvo istruzione diversa.

## 2. Trasferimenti vietati tramite connettori e API

È vietato usare connettori GitHub, gateway, API o sistemi equivalenti per trasferire, caricare, aggiornare o sostituire file binari oppure per aggirare il normale workflow Git.

Il divieto comprende, a titolo esemplificativo:

- `.docx`, `.pdf`, `.epub`;
- immagini (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg` quando trattato come asset binario);
- archivi (`.zip`, `.tar`, `.tgz`, `.gz`);
- font, audio, video e altri artefatti non testuali.

Non aggirare il divieto codificando file binari in Base64 o in altri contenitori testuali per inviarli attraverso connettori, gateway o API.

## 3. Operazioni Git native consentite

Quando l'agente opera in un ambiente locale reale, per esempio tramite Pi, Herdr o Codex, e dispone di accesso Git nativo via SSH o HTTPS, sono consentiti:

- `git fetch` e `git pull`;
- creazione e aggiornamento di branch di lavoro;
- commit;
- push di branch di lavoro;
- normale trasferimento di file binari tramite Git.

Il merge su `main` e il force-push su `main` restano vietati salvo autorizzazione esplicita del proprietario. Non modificare la history già pubblicata.

## 4. Git bundle

Il Git bundle è:

- il metodo di fallback quando non è disponibile accesso Git nativo;
- il metodo di handoff quando è richiesto esplicitamente;
- facoltativo quando Pi, Herdr o Codex dispone di normale accesso Git.

Quando si usa un bundle:

1. creare commit validi e coerenti su un branch dedicato;
2. esporre preferibilmente una ref descrittiva, per esempio `handoff/<task>`;
3. verificare il bundle con `git bundle verify`;
4. calcolare il checksum SHA-256;
5. fornire istruzioni con base attesa, ref, SHA finale, checksum, comandi di importazione e controlli consigliati.

## 5. Controlli prima della consegna

Prima di consegnare o pubblicare un branch:

- eseguire i test e le build previsti dal mandato;
- eseguire `git diff --check` quando applicabile;
- verificare `git status --short`;
- assicurarsi che non siano inclusi segreti, token, credenziali, `.env` o file temporanei;
- verificare che i file binari siano file reali Git e non rappresentazioni Base64 o testuali;
- verificare metadata autore/creator degli artefatti quando rilevanti.

## 6. Precedenza

Queste regole hanno precedenza sulle abitudini operative generiche degli agenti. Un mandato specifico può aggiungere vincoli ulteriori, ma non può autorizzare il trasferimento di file binari tramite connettori, gateway o API salvo esplicito override scritto del proprietario.
