# Diario alimentare — istruzioni per Claude Code

## Cos'è
Web app (PWA) per iPhone per registrare i pasti seguendo il piano della propria nutrizionista: si spuntano le opzioni mangiate e l'app calcola calorie e macro. Deve poter essere condivisa con altre persone tramite un link.

## Documenti da leggere prima di iniziare
- `docs/brief-claude-code.md`: obiettivi, requisiti, architettura, modello dati, criteri di accettazione.
- `docs/decisioni-utente.md`: decisioni dell'utente. **Se c'è conflitto con il brief, vale questo.**
- `docs/prototype/`: prototipo funzionante (data.js, ui.js, head.html) da cui partire per la logica di calcolo.
- `docs/piano-alimentare-2026-09.txt`: piano attuale.
- `docs/corpus-piani/`: 18 piani storici, usati come test per l'import PDF.

## Decisioni fisse
- Dispositivo: iPhone, Safari iOS e PWA aggiunta alla Home. Interfaccia mobile-first.
- Dati solo locali sul telefono (IndexedDB), nessun account, nessun backend. Il livello dati passa da un adapter, così in futuro si può aggiungere la sincronizzazione.
- Obbligatori: export/import JSON e backup facile. Chiedere `navigator.storage.persist()`.
- Quantità flessibili: grammi, porzioni, stima a occhio. Ogni voce è "pesata" o "stimata".
- Import del piano da PDF con pdf.js in locale, parser su misura per il formato della nutrizionista (tutti gli utenti previsti seguono la stessa). Nel codice non scrivere mai nome, telefono o email della nutrizionista: intestazioni e piè di pagina si riconoscono con schemi generici. Le righe non riconosciute vanno segnalate, mai ignorate. Revisione nell'editor del piano.
- Lo schema JSON del piano è il contratto tra editor, import PDF, lista spesa e calcoli.
- Scanner codici a barre con libreria JS (su iOS Safari non esiste BarcodeDetector).
- Notifiche: rimandate, non implementarle.
- Hosting: GitHub Pages.

## Funzioni previste
A scanner, B ricerca alimenti, C quantità flessibili, D recenti/preferiti/copia da ieri, E peso e composizione corporea ai check, G note, H statistiche di aderenza, J lista della spesa, K pianificazione settimana, L import PDF, M editor del piano. Non per ora: F, I, N.

## Regole
- **Privacy:** il repository sarà pubblico. Non committare mai piani reali, PDF o dati personali. `docs/corpus-piani/` e qualsiasi piano reale stanno in `.gitignore`. Nel repository va solo un piano di esempio inventato.
- Lavorare per fasi piccole: dopo ciascuna, spiegare come provarla sul telefono e proporre un commit.
- Prima di scrivere codice nuovo, proporre un piano e aspettare l'ok.
- Verificare con test: il parser deve girare su tutti i piani del corpus e riportare le righe non riconosciute.
- Niente librerie pesanti senza motivo. Preferire codice semplice e leggibile.
- Rispondere all'utente in italiano, con spiegazioni semplici: sta imparando a usare Claude Code.
- Strumenti: Node.js e Git sono installati in `C:\Program Files\nodejs` e `C:\Program Files\Git\cmd` (se non sono nel PATH della shell, aggiungerli). Test: `npm test`. Server locale: `npm run serve` (porta 8080).
- A ogni rilascio aumentare `VERSIONE` in `sw.js` e `version` in `package.json` (un test controlla che coincidano).

## Da chiarire con la nutrizionista (non bloccante)
Kcal e macro obiettivo, lista delle verdure consentite, eventuale piano in digitale. Nel frattempo "verdura consentita" = voce libera a 0 kcal, con lista modificabile.
