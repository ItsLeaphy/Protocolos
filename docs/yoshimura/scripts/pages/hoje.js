import { h } from '../components/dom.js';
import { screenHead, DAYS } from '../components/ui.js';
import { disc } from '../components/art.js';
import { findSessionForWeekday } from '../domain/operations.js';

// Tela "Hoje" — frame "01 Hoje" do Figma. Sem plano: estado vazio do próprio design. Com plano/demonstração: dados reais.
export function renderHoje(app) {
  const s = app.state, wd = new Date().getDay();
  const sess = s.plan ? findSessionForWeekday(s, wd) : null;
  const featured = h('section', { class: 'card plum featured', 'aria-labelledby': 'feat-t' },
    h('p', { class: 'micro overline' }, 'Side A / sessão ' + String(sess ? sess.weekday : 1).padStart(2, '0')),
    h('h2', { id: 'feat-t' }, sess ? sess.title : ['A próxima', h('br'), 'sessão.']),
    h('p', { class: 'desc' }, sess ? sess.prescriptions.length + ' exercício(s)' : (s.plan ? 'Sem sessão programada para hoje.' : 'A programação ainda está em definição.')),
    sess ? h('a', { class: 'pill', href: '#/treinos/' + sess.id }, 'Abrir sessão') : h('span', { class: 'pill' }, 'A definir'),
    h('p', { class: 'micro signoff' }, 'Play / Move / Repeat'),
    disc('disc'));
  const days = h('div', { class: 'days', role: 'list', 'aria-label': 'Semana' }, DAYS.map(([n, ab]) => {
    const has = s.plan?.sessions.some((x) => x.weekday === n);
    return h('span', { role: 'listitem', class: 'day' + (has ? ' has' : ''), 'aria-current': s.plan && n === wd ? 'date' : false }, ab);
  }));
  return h('div', {}, screenHead('Visão geral · 01', 'Hoje.', 'Seu espaço para treinar e evoluir.'), featured,
    h('div', { class: 'week-head' }, h('p', { class: 'label' }, 'A semana'),
      h('p', { class: 'note' }, '5 dias previstos · ' + (s.plan ? 'plano carregado' : 'divisão em definição'))),
    days,
    h('section', { class: 'card progress-card', 'aria-labelledby': 'prog-t' },
      h('p', { class: 'micro' }, 'Trilhas de habilidade'), h('h2', { id: 'prog-t', style: 'font-size:1.4375rem;margin-top:3px' }, 'Progressões.'),
      h('p', { class: 'text' }, 'As etapas aparecerão aqui quando forem definidas.'),
      h('span', { class: 'orbital', 'aria-hidden': 'true' }, h('i'))));
}
