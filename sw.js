// Service worker: salva i file dell'app sul telefono così funziona anche senza rete.
// IMPORTANTE: a ogni rilascio aumentare VERSIONE, altrimenti i telefoni tengono i file vecchi.
const VERSIONE = '0.0.1';
const CACHE = 'diario-' + VERSIONE;

// Tutti i file necessari per aprire l'app offline (percorsi relativi: funziona anche in /nome-repo/).
const FILE_APP = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'js/app.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILE_APP)));
});

self.addEventListener('activate', (event) => {
  // elimina le cache delle versioni precedenti
  event.waitUntil(
    caches.keys()
      .then((nomi) => Promise.all(nomi.filter((n) => n.startsWith('diario-') && n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// La pagina chiede di attivare subito la nuova versione (pulsante "Aggiorna ora")
self.addEventListener('message', (event) => {
  if (event.data === 'attiva-nuova-versione') self.skipWaiting();
  if (event.data === 'versione') event.source.postMessage({ versione: VERSIONE });
});

// Prima la copia salvata (veloce e offline), altrimenti la rete.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((salvata) => {
      if (salvata) return salvata;
      return fetch(req).catch(() =>
        // offline e pagina non in cache: mostra comunque l'app
        req.mode === 'navigate' ? caches.match('index.html') : Response.error()
      );
    })
  );
});
