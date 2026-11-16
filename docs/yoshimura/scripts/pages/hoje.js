import { h } from '../components/dom.js';
import { screenHead, DAYS } from '../components/ui.js';
import { findSessionForWeekday } from '../domain/operations.js';

export function renderHoje(app) {
  const s = app.state, wd = new Date().getDay();
  const sess = s.plan ? findSessionForWeekday(s, wd) : null;
  const next = sess
    ? h('div', { class: 'card plum' }, h('p', { class: 'label' }, 'Side A / sessão ' + String(sess.weekday).padStart(2, '0')),
        h('h3', {}, sess.title), h('p', {}, sess.prescriptions.length + ' exercício(s)'),
        h('a', { class: 'btn ghost', style: 'color:var(--y-white);border-color:var(--y-white)', href: '#/treinos/' + sess.id }, 'Abrir sessão'))
    : h('div', { class: 'card plum' }, h('p', { class: 'label' }, 'Side A / sessão 01'), h('h3', {}, 'A próxima sessão.'),
        h('p', {}, s.plan ? 'Sem sessão programada para hoje.' : 'A programação ainda está em definição.'), h('span', { class: 'badge' }, 'A definir'));
  return h('section', {}, screenHead('Visão geral · 01', 'Hoje.', 'Seu espaço para treinar e evoluir.'), next,
    h('p', { class: 'label' }, 'A semana'),
    h('p', { class: 'sub' }, '5 dias previstos · ' + (s.plan ? 'plano carregado' : 'divisão em definição')),
    h('div', { class: 'days' }, DAYS.map(([n, ab]) => h('span', { class: 'day', 'aria-current': n === wd ? 'date' : false }, ab))),
    h('p', { class: 'label' }, 'Trilhas de habilidade'), h('h3', {}, 'Progressões.'),
    h('p', { class: 'sub' }, 'As etapas aparecerão aqui quando forem definidas.'),
    h('p', { class: 'label' }, 'Último registro: ' + (s.logs.length ? [...s.logs].sort((a, b) => (a.date < b.date ? 1 : -1))[0].date : 'nenhum')));
}
