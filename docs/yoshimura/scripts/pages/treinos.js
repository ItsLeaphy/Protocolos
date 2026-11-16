import { h } from '../components/dom.js';
import { WEEKDAYS } from '../domain/schema.js';
import { addLog, logsForExercise } from '../domain/operations.js';

const LABEL = { reps: 'Repetições', load: 'Carga (kg)', time: 'Tempo (s)', distance: 'Distância (m)', assist: 'Assistência (kg)' };

function targetText(t) {
  const p = [];
  if (t.sets != null) p.push(t.sets + ' séries');
  if (t.repsMin != null) p.push(t.repsMin + (t.repsMax != null ? '–' + t.repsMax : '') + ' reps');
  if (t.time != null) p.push(t.time + ' s');
  if (t.distance != null) p.push(t.distance + ' m');
  if (t.load != null) p.push(t.load + ' kg');
  return p.join(' · ') || 'sem alvo definido';
}

export function renderTreinos(app, sessionId) {
  const plan = app.state.plan;
  if (!plan) return h('section', {}, h('h2', {}, 'Treinos'), h('p', { class: 'empty' }, 'Sem programação cadastrada.'));
  if (!sessionId) return h('section', {}, h('h2', {}, 'Treinos'),
    h('ul', { class: 'list' }, [...plan.sessions].sort((a, b) => a.weekday - b.weekday).map((s) =>
      h('li', {}, h('a', { href: '#/treinos/' + s.id }, WEEKDAYS[s.weekday] + ' — ' + s.title)))));
  const sess = plan.sessions.find((x) => x.id === sessionId);
  if (!sess) return h('section', {}, h('p', { class: 'empty' }, 'Sessão não encontrada.'), h('a', { href: '#/treinos' }, 'Voltar'));
  const exMap = new Map(app.state.exercises.map((e) => [e.id, e]));
  return h('section', {}, h('a', { href: '#/treinos' }, '← Treinos'), h('h2', {}, WEEKDAYS[sess.weekday] + ' — ' + sess.title),
    [...sess.prescriptions].sort((a, b) => a.order - b.order).map((rx) => {
      const ex = exMap.get(rx.exerciseId);
      const fields = ex.tracking.map((t) => {
        const id = 'f-' + rx.id + '-' + t;
        return h('div', { class: 'field' }, h('label', { for: id }, LABEL[t]), h('input', { id, name: t, type: 'number', inputmode: 'decimal', min: '0', step: 'any' }));
      });
      const msg = h('p', { class: 'msg', role: 'status' });
      const form = h('form', {
        onsubmit: (e) => {
          e.preventDefault();
          const set = {};
          for (const t of ex.tracking) { const v = form.elements[t].value; if (v !== '') set[t] = Number(v); }
          if (!Object.keys(set).length) { msg.textContent = 'Preencha ao menos um campo.'; msg.className = 'msg error'; return; }
          app.set(addLog(app.state, { sessionId: sess.id, prescription: rx, exerciseId: ex.id, sets: [set] }), { kind: 'ok', text: 'Série registrada em ' + new Date().toLocaleDateString('pt-BR') + '.' });
        },
      }, h('fieldset', {}, h('legend', {}, 'Registrar execução real'), fields, h('button', { class: 'btn', type: 'submit' }, 'Registrar série')), msg);
      const hist = logsForExercise(app.state, ex.id).slice(0, 5);
      return h('article', { class: 'card' }, h('h3', {}, ex.name), h('p', { class: 'kicker' }, 'Prescrito: ' + targetText(rx.target)),
        rx.target.notes ? h('p', {}, rx.target.notes) : null, form,
        hist.length ? h('details', {}, h('summary', {}, 'Histórico recente (' + hist.length + ')'),
          h('ul', {}, hist.map((l) => h('li', {}, l.date + ' — ' + l.sets.map((s) => Object.entries(s).map(([k, v]) => LABEL[k] + ': ' + v).join(', ')).join(' | ')))))
          : h('p', { class: 'kicker' }, 'Sem registros ainda.'));
    }));
}
