import { createApp } from './app-state.js';
import { browserStorage } from './services/storage.js';
import { initTheme, toggleTheme, currentTheme } from './services/theme.js';
import { h, clear } from './components/dom.js';
import { renderHoje } from './pages/hoje.js';
import { renderTreinos } from './pages/treinos.js';
import { renderDados } from './pages/dados.js';
import { renderTrilhas, renderMob } from './pages/outras.js';
import { initInstall, onInstallChange } from './services/install.js';

initTheme();
initInstall();
const app = createApp(browserStorage());
const root = document.getElementById('app');
const TABS = [['hoje', 'Hoje'], ['treinos', 'Treinos'], ['trilhas', 'Trilhas'], ['mob', 'Mob.']];
const PAGES = { hoje: renderHoje, treinos: renderTreinos, trilhas: renderTrilhas, mob: renderMob, dados: renderDados };

function route() {
  const [name = 'hoje', arg] = location.hash.replace(/^#\/?/, '').split('/');
  return { name: PAGES[name] ? name : 'hoje', arg };
}

function render() {
  const { name, arg } = route();
  const dark = currentTheme() === 'dark';
  const toggle = h('button', { class: 'theme-toggle', type: 'button', 'aria-label': dark ? 'Mudar para tema claro' : 'Mudar para tema escuro',
    onclick: () => { toggleTheme(); render(); } }, h('i', { 'aria-hidden': 'true' }));
  clear(root).append(...[
    h('header', { class: 'masthead' }, h('span', { class: 'seal', 'aria-hidden': 'true' }),
      h('div', { class: 'brandbox' }, h('p', { class: 'brand', lang: 'ja' }, 'ヨシムラ'), h('p', { class: 'micro' }, 'Training / field notes')),
      h('p', { class: 'micro vol' }, 'Vol. 01'), toggle),
    app.state.demo ? h('p', { class: 'banner' }, 'Dados de demonstração — sintéticos, não são treino real.') : null,
    app.loadError ? h('p', { class: 'msg error', role: 'alert' }, app.loadError) : null,
    app.notice ? h('p', { class: 'msg ' + app.notice.kind, role: 'status' }, app.notice.text) : null,
    h('main', { id: 'conteudo', tabindex: '-1' }, PAGES[name](app, arg)),
    h('footer', { class: 'fieldnote' }, h('span', { class: 'micro' }, 'Field note 01 · protocolo em preparação'),
      h('a', { class: 'micro', href: '#/dados' }, 'Dados'), h('a', { class: 'micro', href: '../' }, 'Protocolos')),
    h('nav', { class: 'nav', 'aria-label': 'Principal' }, h('ul', {}, TABS.map(([k, l]) =>
      h('li', {}, h('a', { href: '#/' + k, 'aria-current': k === name ? 'page' : false }, l)))))].filter(Boolean));
}
app.subscribe(render);
onInstallChange(render);
window.addEventListener('hashchange', () => { app.notice = null; render(); window.scrollTo(0, 0); });
render();
