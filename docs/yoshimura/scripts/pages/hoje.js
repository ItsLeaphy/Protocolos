import { h } from '../components/dom.js';
import { findSessionForWeekday } from '../domain/operations.js';
import { WEEKDAYS } from '../domain/schema.js';

export function renderHoje(app) {
  const s = app.state;
  if (!s.plan) return h('section', {}, h('h2', {}, 'Hoje'),
    h('p', { class: 'empty' }, 'Sem programação. Ainda não há plano cadastrado.'),
    h('p', {}, 'Você pode carregar dados de demonstração (sintéticos) na aba Dados.'));
  const wd = new Date().getDay(); // dia local
  const sess = findSessionForWeekday(s, wd);
  return h('section', {}, h('h2', {}, 'Hoje'),
    sess ? h('div', { class: 'card' }, h('p', { class: 'kicker' }, WEEKDAYS[wd]), h('h3', {}, sess.title),
      h('p', {}, sess.prescriptions.length + ' exercício(s)'), h('a', { class: 'btn', href: '#/treinos/' + sess.id }, 'Abrir sessão'))
    : h('p', { class: 'empty' }, 'Sem sessão programada para hoje (o plano cobre segunda a sexta).'),
    h('p', { class: 'kicker' }, 'Último registro: ' + (s.logs.length ? [...s.logs].sort((a, b) => (a.date < b.date ? 1 : -1))[0].date : 'nenhum')));
}
