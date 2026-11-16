import { createApp } from './app-state.js';
import { browserStorage } from './services/storage.js';
import { initTheme, toggleTheme, currentTheme } from './services/theme.js';
import { h, clear } from './components/dom.js';
import { renderHoje } from './pages/hoje.js';
import { renderTreinos } from './pages/treinos.js';
import { renderDados } from './pages/dados.js';
import { renderTrilhas, renderMob } from './pages/outras.js';

initTheme();
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
    onclick: () => { toggleTheme(); render(); } }, dark ? 'CLARO' : 'ESCURO');
  clear(root).append(...[
    h('header', { class: 'masthead' }, h('span', { class: 'brand', lang: 'ja' }, 'ヨシムラ'),
      h('div', { class: 'meta' }, h('span', { class: 'label' }, 'Vol. 01'), h('span', { class: 'label' }, 'Training / field notes')), toggle),
    app.state.demo ? h('p', { class: 'banner' }, 'Dados de demonstração — sintéticos, não são treino real.') : null,
    app.loadError ? h('p', { class: 'msg error', role: 'alert' }, app.loadError) : null,
    app.notice ? h('p', { class: 'msg ' + app.notice.kind, role: 'status' }, app.notice.text) : null,
    h('main', { id: 'conteudo', tabindex: '-1' }, PAGES[name](app, arg)),
    h('footer', { class: 'fieldnote' }, h('span', { class: 'label' }, 'Field note 01 · protocolo em preparação'),
      h('a', { class: 'label', href: '#/dados' }, 'Dados'), h('a', { class: 'label', href: '../' }, 'Protocolos')),
    h('nav', { class: 'nav', 'aria-label': 'Principal' }, h('ul', {}, TABS.map(([k, l]) =>
      h('li', {}, h('a', { href: '#/' + k, 'aria-current': k === name ? 'page' : false }, l)))))].filter(Boolean));
}
app.subscribe(render);
window.addEventListener('hashchange', () => { app.notice = null; render(); window.scrollTo(0, 0); });
render();
