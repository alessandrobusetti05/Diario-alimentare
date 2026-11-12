// Server minimo per provare l'app sul PC: `npm run serve`, poi apri http://localhost:8080
// Nessuna libreria esterna. Non serve in produzione (lì c'è GitHub Pages).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const RADICE = resolve(import.meta.dirname, '..');
const PORTA = Number(process.env.PORT) || 8080;
const TIPI = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.wasm': 'application/wasm',
};
// cartelle da non servire mai (dati personali o strumenti)
const VIETATE = ['docs', 'privato', 'node_modules', '.git', '.claude'];

createServer(async (req, res) => {
  try {
    const percorso = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^[\\/]+/, '');
    if (VIETATE.some((d) => percorso === d || percorso.startsWith(d + '\\') || percorso.startsWith(d + '/'))) throw new Error('vietato');
    let file = join(RADICE, percorso);
    if (!file.startsWith(RADICE)) throw new Error('fuori radice');
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    const corpo = await readFile(file);
    res.writeHead(200, { 'Content-Type': TIPI[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(corpo);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Non trovato');
  }
}).listen(PORTA, () => console.log(`Diario alimentare su http://localhost:${PORTA}`));
