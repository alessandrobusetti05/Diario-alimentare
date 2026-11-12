// Avvio dell'app (Fase 0): service worker, archiviazione persistente, invito a installare.

const $ = (sel) => document.querySelector(sel);

/** true se l'app è aperta dall'icona sulla Home (PWA installata) */
function isInstallata() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

/** true su iPhone/iPad (anche iPad che si presenta come Mac) */
function isIOS() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function riga(etichetta, valore, ok) {
  const li = document.createElement('li');
  const a = document.createElement('span');
  a.textContent = etichetta;
  const b = document.createElement('span');
  b.textContent = valore;
  if (ok !== undefined) b.className = ok ? 'ok' : 'no';
  li.append(a, b);
  $('#stato').append(li);
}

/**
 * Chiede al browser di non cancellare i dati dell'app quando manca spazio.
 * Su iOS di solito viene concesso solo all'app installata sulla Home.
 */
async function chiediArchiviazionePersistente() {
  if (!navigator.storage || !navigator.storage.persist) return null;
  if (await navigator.storage.persisted()) return true;
  try { return await navigator.storage.persist(); } catch { return false; }
}

async function registraServiceWorker() {
  if (!('serviceWorker' in navigator)) return false;
  const reg = await navigator.serviceWorker.register('sw.js');

  // Mostra "Aggiorna ora" quando c'è una nuova versione in attesa
  const mostraAggiornamento = (sw) => {
    $('#aggiornamento').hidden = false;
    $('#btn-aggiorna').onclick = () => sw.postMessage('attiva-nuova-versione');
  };
  if (reg.waiting && navigator.serviceWorker.controller) mostraAggiornamento(reg.waiting);
  reg.addEventListener('updatefound', () => {
    const nuovo = reg.installing;
    nuovo.addEventListener('statechange', () => {
      if (nuovo.state === 'installed' && navigator.serviceWorker.controller) mostraAggiornamento(nuovo);
    });
  });

  // Quando la nuova versione prende il controllo, ricarica una sola volta
  let ricaricato = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (ricaricato) return;
    ricaricato = true;
    location.reload();
  });

  // Chiede la versione al service worker attivo, per mostrarla in alto
  navigator.serviceWorker.addEventListener('message', (e) => {
    if (e.data && e.data.versione) $('#versione').textContent = 'v' + e.data.versione;
  });
  const sw = navigator.serviceWorker.controller || (await navigator.serviceWorker.ready).active;
  if (sw) sw.postMessage('versione');
  return true;
}

async function avvio() {
  const installata = isInstallata();
  if (!installata && isIOS()) $('#installa').hidden = false;

  riga('Installata sulla Home', installata ? 'sì' : 'no', installata);

  let sw = false;
  try { sw = await registraServiceWorker(); } catch (e) { console.error(e); }
  riga('Funziona offline', sw ? 'sì' : 'no', sw);

  const persistente = await chiediArchiviazionePersistente();
  riga('Dati protetti dalla cancellazione', persistente === null ? 'non supportato' : (persistente ? 'sì' : 'non ancora'), !!persistente);

  if (navigator.storage && navigator.storage.estimate) {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    riga('Spazio usato', `${(usage / 1e6).toFixed(1)} MB su ${(quota / 1e9).toFixed(1)} GB`);
  }
  riga('Connessione', navigator.onLine ? 'online' : 'offline');
}

avvio();
