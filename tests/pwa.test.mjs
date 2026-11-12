// Controlli sulla PWA: se uno di questi fallisce, l'app offline o l'installazione non funzionano.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const RADICE = resolve(import.meta.dirname, '..');
const leggi = (f) => readFileSync(join(RADICE, f), 'utf8');

test('ogni file della cache del service worker esiste', () => {
  const sw = leggi('sw.js');
  const elenco = sw.match(/const FILE_APP = \[([\s\S]*?)\];/)[1];
  const file = [...elenco.matchAll(/'([^']+)'/g)].map((m) => m[1]).filter((f) => f !== './');
  assert.ok(file.length > 0);
  for (const f of file) assert.ok(existsSync(join(RADICE, f)), `manca ${f}`);
});

test('il manifest è valido e le sue icone esistono', () => {
  const m = JSON.parse(leggi('manifest.webmanifest'));
  assert.equal(m.display, 'standalone');
  assert.equal(m.lang, 'it');
  assert.ok(m.icons.some((i) => i.sizes === '512x512'));
  for (const i of m.icons) assert.ok(existsSync(join(RADICE, i.src)), `manca ${i.src}`);
});

test('index.html collega manifest, icona iOS e script', () => {
  const html = leggi('index.html');
  for (const atteso of ['manifest.webmanifest', 'apple-touch-icon', 'js/app.js', 'css/app.css']) {
    assert.ok(html.includes(atteso), `index.html non contiene ${atteso}`);
  }
});

test('la versione nel service worker coincide con package.json', () => {
  const versioneSw = leggi('sw.js').match(/const VERSIONE = '([^']+)'/)[1];
  assert.equal(versioneSw, JSON.parse(leggi('package.json')).version);
});

test('i percorsi sono relativi (funziona anche in /nome-repo/ su GitHub Pages)', () => {
  const testi = [leggi('index.html'), leggi('manifest.webmanifest'), leggi('sw.js'), leggi('js/app.js')];
  for (const t of testi) assert.doesNotMatch(t, /["'`]\/(?!\/)[a-z]/i, 'trovato un percorso che inizia con /');
});
