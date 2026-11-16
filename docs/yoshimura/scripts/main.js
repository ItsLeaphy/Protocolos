import { createApp } from './app-state.js';
import { browserStorage } from './services/storage.js';
import { h, clear } from './components/dom.js';
import { renderHoje } from './pages/hoje.js';
import { renderTreinos } from './pages/treinos.js';
import { renderDados } from './pages/dados.js';

const app = createApp(browserStorage());
const root = document.getElementById('app');
const ROUTES = [['hoje', 'Hoje'], ['treinos', 'Treinos'], ['dados', 'Dados']];

function route() {
  const [name = 'hoje', arg] = location.hash.replace(/^#\/?/, '').split('/');
  return { name: ROUTES.some((r) => r[0] === name) ? name : 'hoje', arg };
}

function render() {
  const { name, arg } = route();
  const page = name === 'treinos' ? renderTreinos(app, arg) : name === 'dados' ? renderDados(app) : renderHoje(app);
  clear(root).append(
    app.state.demo ? h('p', { class: 'banner' }, 'DADOS DE DEMONSTRAÇÃO — sintéticos, não são treino real.') : null,
    app.loadError ? h('p', { class: 'msg error', role: 'alert' }, app.loadError) : null,
    app.notice ? h('p', { class: 'msg ' + app.notice.kind, role: 'status' }, app.notice.text) : null,
    h('nav', { 'aria-label': 'Principal' }, ROUTES.map(([k, l]) => h('a', { href: '#/' + k, 'aria-current': k === name ? 'page' : false }, l))),
    h('main', { id: 'conteudo', tabindex: '-1' }, page));
}
app.subscribe(render);
window.addEventListener('hashchange', () => { app.notice = null; render(); });
render();
