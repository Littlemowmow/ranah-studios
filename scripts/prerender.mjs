// Post-build static prerender (SEO snapshot) for the single-page Rana Studio site.
//
// Why: the built dist/index.html ships an empty <div id="root"></div>, so bots /
// social scrapers that don't run JS see no content. This script boots a headless
// Chrome against the built dist/, lets React render the page, then writes the
// rendered markup back into <div id="root"> so the static HTML carries real
// headings + copy. The hashed <script type="module"> tags are kept untouched, so
// the browser still hydrates and the page stays fully interactive.
//
// It deliberately preserves the existing <head> (title, description, canonical,
// og:*, twitter:*, JSON-LD) verbatim by editing the built file in place rather
// than dumping documentElement.outerHTML.

import http from 'node:http';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const INDEX = join(DIST, 'index.html');
const PORT = 4178;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
        let filePath = normalize(join(DIST, urlPath));
        if (!filePath.startsWith(DIST)) {
          res.writeHead(403).end('forbidden');
          return;
        }
        let s = await stat(filePath).catch(() => null);
        if (s && s.isDirectory()) {
          filePath = join(filePath, 'index.html');
          s = await stat(filePath).catch(() => null);
        }
        // SPA fallback to index.html for unknown routes (single-page site).
        if (!s) {
          filePath = INDEX;
        }
        res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
        createReadStream(filePath).pipe(res);
      } catch (err) {
        res.writeHead(500).end(String(err));
      }
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function main() {
  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    const warnings = [];
    page.on('console', (msg) => {
      const t = msg.text();
      if (/error|warn|hydrat/i.test(t)) warnings.push(`[${msg.type()}] ${t}`);
    });
    page.on('pageerror', (e) => warnings.push(`[pageerror] ${e.message}`));

    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0', timeout: 60000 });

    // Wait until React has actually rendered something into #root.
    await page.waitForFunction(
      () => {
        const r = document.getElementById('root');
        return r && r.children.length > 0 && r.textContent.trim().length > 200;
      },
      { timeout: 60000 },
    );

    const rootHtml = await page.evaluate(() => document.getElementById('root').innerHTML);
    const rootTextLen = await page.evaluate(() => document.getElementById('root').textContent.trim().length);

    // Edit the built index.html in place: only swap the empty root for the
    // rendered markup. Head (SEO tags) and the module script tags stay intact.
    const original = await readFile(INDEX, 'utf8');
    const emptyRoot = /<div id="root">\s*<\/div>/;
    if (!emptyRoot.test(original)) {
      throw new Error('Could not find empty <div id="root"></div> in dist/index.html to inject into.');
    }
    const out = original.replace(emptyRoot, `<div id="root">${rootHtml}</div>`);
    await writeFile(INDEX, out, 'utf8');

    console.log(`[prerender] injected ${rootHtml.length} chars of markup (${rootTextLen} chars of visible text) into dist/index.html`);
    if (warnings.length) {
      console.log(`[prerender] ${warnings.length} console warning(s) captured (non-fatal):`);
      for (const w of warnings.slice(0, 20)) console.log('   ' + w);
    } else {
      console.log('[prerender] no console errors/warnings captured.');
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  // On Vercel's remote builder, Chromium's system libs (libnspr4 etc.) are
  // absent, so puppeteer can't launch. Prod is deployed via `vercel --prebuilt`
  // (built locally, where Chrome works), so a remote build never needs to
  // prerender — skip gracefully there instead of failing the deploy. Locally
  // (and any non-Vercel CI) the prerender is required, so fail loudly.
  if (process.env.VERCEL) {
    console.warn('[prerender] skipped on Vercel remote builder (no system Chromium):', err.message);
    process.exit(0);
  }
  console.error('[prerender] FAILED:', err);
  process.exit(1);
});
