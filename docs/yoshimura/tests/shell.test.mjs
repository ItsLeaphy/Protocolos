// Garante que a lista SHELL do sw.js bate com os arquivos reais do app (evita cache offline quebrado).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const root = new URL('..', import.meta.url).pathname;
const sw = readFileSync(join(root, 'sw.js'), 'utf8');
const shell = [...sw.match(/const SHELL = \[([\s\S]*?)\];/)[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
const walk = (d) => readdirSync(join(root, d)).flatMap((n) => { const p = d + '/' + n; return statSync(join(root, p)).isDirectory() ? walk(p) : [p]; });

test('todo arquivo do SHELL existe', () => { for (const f of shell) if (f !== './') assert.ok(existsSync(join(root, f)), 'falta ' + f); });
test('todo arquivo do app está no SHELL', () => {
  const all = [...walk('scripts'), ...walk('styles'), ...walk('assets').filter((f) => !f.endsWith('LICENSES.md')), 'index.html', 'manifest.webmanifest'];
  assert.deepEqual(all.filter((f) => !shell.includes(f)), []);
});
test('sw.js não usa Blob e tem prefixo próprio', () => {
  assert.ok(!/new Blob|createObjectURL/.test(sw)); assert.ok(sw.includes("'yoshimura-shell-'"));
});
test('manifesto aponta só para arquivos existentes', () => {
  const m = JSON.parse(readFileSync(join(root, 'manifest.webmanifest'), 'utf8'));
  for (const i of m.icons) assert.ok(existsSync(join(root, i.src)), i.src);
});
