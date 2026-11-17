/* Service worker do Yoshimura (arquivo real, escopo = esta pasta). Não toca nos outros protocolos.
   Estratégia: pré-cache do app shell na instalação; depois, rede primeiro com fallback ao cache
   (atualizações aparecem quando há rede; sem rede o app abre do cache). Dados do usuário (localStorage)
   nunca passam pelo cache. Ao alterar a lista, atualize SHELL e (opcional) incremente VERSION. */
const VERSION = 'v4';
const PREFIX = 'yoshimura-shell-';
const CACHE = PREFIX + VERSION;
const SHELL = [
  './', 'index.html', 'manifest.webmanifest',
  'styles/fonts.css', 'styles/tokens.css', 'styles/base.css', 'styles/components.css',
  'scripts/main.js', 'scripts/app-state.js',
  'scripts/domain/schema.js', 'scripts/domain/validators.js', 'scripts/domain/operations.js',
  'scripts/data/demo-data.js',
  'scripts/data/plano-integracao.js',
  'scripts/services/storage.js', 'scripts/services/export-import.js', 'scripts/services/theme.js', 'scripts/services/install.js',
  'scripts/components/dom.js', 'scripts/components/ui.js', 'scripts/components/art.js',
  'scripts/pages/hoje.js', 'scripts/pages/treinos.js', 'scripts/pages/outras.js', 'scripts/pages/dados.js',
  'assets/fonts/cormorant-garamond-latin-600-normal.woff2', 'assets/fonts/cormorant-garamond-latin-400-italic.woff2',
  'assets/fonts/space-grotesk-latin-400-normal.woff2', 'assets/fonts/space-grotesk-latin-500-normal.woff2',
  'assets/fonts/chakra-petch-latin-700-normal.woff2', 'assets/fonts/zen-maru-gothic-brand-subset.woff2',
  'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/icon-maskable-512.png', 'assets/icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()))),
  );
});
