# Diario alimentare

Web app (PWA) per iPhone per registrare i pasti seguendo il proprio piano alimentare: si spuntano le opzioni mangiate e l'app calcola calorie e macro.

- **I dati restano sul telefono** (IndexedDB). Nessun account, nessun server.
- Funziona **offline** una volta aggiunta alla schermata Home.
- Ognuno carica **il proprio piano**: nel repository c'è solo un piano di esempio inventato.

## Come si usa su iPhone

1. Apri il link in **Safari**.
2. Tocca **Condividi → Aggiungi alla schermata Home**.
3. Apri l'app dall'icona sulla Home e registra i pasti da lì (i dati di Safari e quelli dell'app installata sono separati).

## Sviluppo

Serve [Node.js](https://nodejs.org) (versione LTS). Nessuna dipendenza da installare.

```bash
npm run serve   # avvia l'app su http://localhost:8080
npm test        # esegue i test
```

A ogni rilascio aumentare `VERSIONE` in `sw.js` (e `version` in `package.json`), altrimenti i telefoni continuano a usare i file salvati.

## Privacy

Non committare mai piani reali, PDF o backup: sono esclusi da `.gitignore`.
