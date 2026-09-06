/* ============================================================================
   HEADLESS TEST RUNNER
   Serves the site, opens tests/tests.html in headless Chromium, waits for the
   suite to finish and reports the result.

   Exit code 0 = safe to deploy. Exit code 1 = blocking failure.
   Warnings are printed but never block.

   Run: npm test
   ========================================================================== */

import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { join, extname, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.pdf': 'application/pdf',
    '.xml': 'application/xml',
    '.txt': 'text/plain; charset=utf-8',
    '.ico': 'image/x-icon'
};

function startServer() {
    const server = createServer(async (req, res) => {
        const url = decodeURIComponent(req.url.split('?')[0]);
        let filePath = normalize(join(ROOT, url === '/' ? 'index.html' : url));

        // Refuse anything that escapes the site root.
        if (!filePath.startsWith(normalize(ROOT + sep)) && filePath !== normalize(ROOT)) {
            res.writeHead(403).end('Forbidden');
            return;
        }

        try {
            const body = await readFile(filePath);
            res.writeHead(200, {
                'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
                'Cache-Control': 'no-store'
            });
            res.end(body);
        } catch {
            // The suite relies on real 404s to detect missing assets.
            res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
        }
    });

    return new Promise(resolve => {
        server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
    });
}

const COLOUR = { pass: '\x1b[32m', fail: '\x1b[31m', warn: '\x1b[33m', skip: '\x1b[33m', dim: '\x1b[2m', reset: '\x1b[0m' };
const paint = (state, text) => `${COLOUR[state] || ''}${text}${COLOUR.reset}`;

const { server, port } = await startServer();
const browser = await chromium.launch();
let exitCode = 1;

try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });

    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(String(err)));

    await page.goto(`http://127.0.0.1:${port}/tests/tests.html`, { waitUntil: 'load' });

    const handle = await page.waitForFunction(() => window.__TEST_RESULTS__, null, { timeout: 120000 });
    const results = await handle.jsonValue();

    let currentGroup = null;
    for (const entry of results.report) {
        if (entry.group !== currentGroup) {
            currentGroup = entry.group;
            console.log(`\n${COLOUR.dim}${currentGroup}${COLOUR.reset}`);
        }
        const label = entry.state.toUpperCase().padEnd(4);
        console.log(`  ${paint(entry.state, label)}  ${entry.name}`);
        if (entry.detail) console.log(`        ${COLOUR.dim}${entry.detail}${COLOUR.reset}`);
    }

    const { passed, failed, warned = 0, skipped = 0 } = results;
    console.log('\n' + '-'.repeat(64));
    console.log(`  ${paint('pass', passed + ' passed')}   ${paint(failed ? 'fail' : 'dim', failed + ' failed')}   ${paint(warned ? 'warn' : 'dim', warned + ' warnings')}   ${COLOUR.dim}${skipped} skipped${COLOUR.reset}`);

    if (pageErrors.length) {
        console.log(`\n${paint('fail', 'Uncaught page errors:')}`);
        pageErrors.forEach(e => console.log('  ' + e));
    }

    await writeFile(join(ROOT, 'tests', 'results.json'), JSON.stringify(results, null, 2));

    if (failed > 0) {
        console.log(`\n${paint('fail', `✗ ${failed} blocking failure(s) — deploy stopped.`)}\n`);
    } else {
        const suffix = warned ? ` (${warned} warning(s) — not blocking)` : '';
        console.log(`\n${paint('pass', `✓ All blocking checks passed${suffix}. Safe to deploy.`)}\n`);
        exitCode = 0;
    }
} catch (err) {
    console.error(`\n${paint('fail', 'Runner crashed:')} ${err.message}\n`);
} finally {
    await browser.close();
    server.close();
}

process.exit(exitCode);
