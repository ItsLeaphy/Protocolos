import { h } from '../components/dom.js';
import { screenHead, DAYS } from '../components/ui.js';
import { addLog, logsForExercise } from '../domain/operations.js';

const LABEL = { reps: 'Reps', load: 'Carga (kg)', time: 'Tempo (s)', distance: 'Distância (m)', assist: 'Assistência (kg)' };
function targetText(t) {
  const p = [];
  if (t.sets != null) p.push(t.sets + ' séries');
  if (t.repsMin != null) p.push(t.repsMin + (t.repsMax != null ? '–' + t.repsMax : '') + ' reps');
  if (t.time != null) p.push(t.time + ' s');
  if (t.distance != null) p.push(t.distance + ' m');
  if (t.load != null) p.push(t.load + ' kg');
  return p.join(' · ') || 'sem alvo definido';
}

function lista(app) {
  const plan = app.state.plan;
  return h('section', {}, screenHead('Programação · 02', 'Treinos.', 'Uma semana de cada vez.'),
    h('p', { class: 'label' }, 'Week index / 01'), h('p', { class: 'sub' }, 'SEG — SEX · 5 dias previstos · ' + (plan ? 'plano carregado' : 'sessões a configurar')),
    h('p', { class: 'label' }, 'Tracklist / programação'),
    h('ul', { class: 'tracklist' }, DAYS.map(([n, , nome]) => {
      const sess = plan?.sessions.find((x) => x.weekday === n);
      return h('li', {}, h('a', { class: 'track', href: '#/treinos/' + (sess ? sess.id : 'dia-' + n) },
        h('span', { class: 'label' }, nome), h('span', { class: 'num' }, String(n).padStart(2, '0')),
        h('span', {}, sess ? sess.title : 'Sessão · a definir')));
    })),
    plan ? null : h('p', { class: 'sub' }, 'A ficha será estruturada após avaliação e validação.'));
}

function placeholder(n) {
  return h('section', {}, h('a', { class: 'label', href: '#/treinos' }, '← Treinos'),
    screenHead('Treinos / sessão ' + String(n).padStart(2, '0'), 'Detalhes.', 'Uma sessão ainda sem prescrição.'),
    h('div', { class: 'card plum' }, h('h3', {}, 'Em construção.'), h('p', {}, 'Os movimentos e a prescrição serão adicionados depois.')),
    h('p', { class: 'label' }, 'Registro de execução'),
    h('div', { class: 'illus', 'aria-hidden': 'true' }, ['Séries', 'Reps', 'Carga'].map((t) => h('div', { class: 'cell' }, h('span', { class: 'label' }, t), h('span', {}, '—')))),
    h('p', { class: 'sub' }, 'Campos ilustrativos · sem prescrição cadastrada.'));
}

export function renderTreinos(app, arg) {
  if (!arg) return lista(app);
  if (/^dia-[1-5]$/.test(arg)) return placeholder(arg.slice(4));
  const sess = app.state.plan?.sessions.find((x) => x.id === arg);
  if (!sess) return h('section', {}, h('p', { class: 'empty' }, 'Sessão não encontrada.'), h('a', { class: 'btn', href: '#/treinos' }, 'Voltar'));
  const exMap = new Map(app.state.exercises.map((e) => [e.id, e]));
  return h('section', {}, h('a', { class: 'label', href: '#/treinos' }, '← Treinos'),
    screenHead('Treinos / sessão ' + String(sess.weekday).padStart(2, '0'), 'Detalhes.', sess.title),
    [...sess.prescriptions].sort((a, b) => a.order - b.order).map((rx, i) => {
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
      }, h('fieldset', {}, h('legend', {}, 'Registro de execução'), fields, h('button', { class: 'btn', type: 'submit' }, 'Registrar série')), msg);
      const hist = logsForExercise(app.state, ex.id).slice(0, 5);
      return h('article', { class: 'card' }, h('p', { class: 'label' }, 'Movimento ' + String(i + 1).padStart(2, '0')), h('h3', {}, ex.name),
        h('p', { class: 'sub' }, 'Prescrito: ' + targetText(rx.target)), rx.target.notes ? h('p', {}, rx.target.notes) : null, form,
        hist.length ? h('details', {}, h('summary', {}, 'Histórico recente (' + hist.length + ')'),
          h('ul', {}, hist.map((l) => h('li', {}, l.date + ' — ' + l.sets.map((s) => Object.entries(s).map(([k, v]) => LABEL[k] + ': ' + v).join(', ')).join(' | ')))))
          : h('p', { class: 'label' }, 'Sem registros ainda.'));
    }));
}
