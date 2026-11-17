import { h } from '../components/dom.js';
import { screenHead, DAYS } from '../components/ui.js';
import { disc, soundwave } from '../components/art.js';
import { addLog, logsForExercise } from '../domain/operations.js';

const LABEL = { reps: 'Reps', load: 'Carga (kg)', time: 'Tempo (s)', distance: 'Distância (m)', assist: 'Assistência (kg)' };
const pad = (n) => String(n).padStart(2, '0');
function targetText(t) {
  const p = [];
  if (t.sets != null) p.push(t.sets + ' séries');
  if (t.repsMin != null) p.push(t.repsMin + (t.repsMax != null ? '–' + t.repsMax : '') + ' reps');
  if (t.time != null) p.push(t.time + ' s');
  if (t.distance != null) p.push(t.distance + ' m');
  if (t.load != null) p.push(t.load + ' kg');
  return p.join(' · ') || 'sem alvo definido';
}

// Frame "02 Treinos": visão da semana + tracklist.
function lista(app) {
  const plan = app.state.plan;
  return h('div', {}, screenHead('Programação  ·  02', 'Treinos.', 'Uma semana de cada vez.', 't40'),
    h('section', { class: 'card overview', 'aria-labelledby': 'wk-t' },
      h('p', { class: 'micro' }, 'Week index  /  01'), h('h2', { id: 'wk-t' }, 'SEG  —  SEX'),
      h('p', { class: 'note' }, '5 dias previstos · ' + (plan ? 'plano carregado' : 'sessões a configurar')), soundwave('wave')),
    h('div', { class: 'track-head' }, h('h2', { class: 'label', style: 'font-family:var(--y-font-label)' }, 'Tracklist  /  programação'),
      h('p', { class: 'note' }, plan ? 'Escolha uma sessão.' : 'A ordem e o conteúdo ainda não foram definidos.')),
    h('ul', { class: 'tracklist' }, DAYS.map(([n, , nome]) => {
      const sess = plan?.sessions.find((x) => x.weekday === n);
      return h('li', {}, h('a', { class: 'track' + (sess ? ' has' : ''), href: '#/treinos/' + (sess ? sess.id : 'dia-' + n) },
        h('span', { class: 'num' }, pad(n)),
        h('span', {}, h('span', { class: 'day-name' }, nome), h('span', { class: 'status' }, 'Sessão  ·  ' + (sess ? sess.title : 'a definir'))),
        h('span', { class: 'marker', 'aria-hidden': 'true' })));
    })),
    plan ? null : h('p', { class: 'footnote' }, 'A ficha será estruturada após avaliação e validação.'));
}

// Frame "03 Sessão": sessão ainda sem prescrição (estado do design).
function placeholder(n) {
  return h('div', {}, screenHead([h('a', { href: '#/treinos', 'aria-label': 'Voltar para Treinos' }, 'Treinos'), '  /  sessão ' + pad(n)], 'Detalhes.', 'Uma sessão ainda sem prescrição.', 't39'),
    h('section', { class: 'card plum cover', 'aria-labelledby': 'cv-t' }, h('p', { class: 'micro' }, 'Side A   /   Movement archive'),
      h('h2', { id: 'cv-t' }, 'Em construção.'), h('p', { class: 'desc' }, 'Os movimentos e a prescrição serão adicionados depois.'), disc('disc')),
    h('div', { class: 'section-head' }, h('h2', { class: 'label', style: 'font-family:var(--y-font-label)' }, 'Tracklist  /  movimentos')),
    h('article', { class: 'card movement' }, h('span', { class: 'num', 'aria-hidden': 'true' }, '01'),
      h('div', {}, h('p', { class: 'name' }, 'Movimento a definir'), h('p', { class: 'desc' }, 'O primeiro exercício será configurado aqui.'), h('span', { class: 'pill blush' }, 'Pendente'))),
    h('section', { class: 'card alt logging', 'aria-hidden': 'true' }, h('p', { class: 'label' }, 'Registro de execução'),
      h('div', { class: 'fields' }, ['Séries', 'Reps', 'Carga'].map((t) => h('div', { class: 'field' }, h('span', { class: 'micro' }, t), h('span', { class: 'placeholder' }, '—'))))),
    h('p', { class: 'micro session-note' }, 'Campos ilustrativos · sem prescrição cadastrada'));
}

export function renderTreinos(app, arg) {
  if (!arg) return lista(app);
  if (/^dia-[1-5]$/.test(arg)) return placeholder(arg.slice(4));
  const sess = app.state.plan?.sessions.find((x) => x.id === arg);
  if (!sess) return h('div', {}, h('p', { class: 'empty' }, 'Sessão não encontrada.'), h('a', { class: 'btn', href: '#/treinos' }, 'Voltar'));
  const exMap = new Map(app.state.exercises.map((e) => [e.id, e]));
  return h('div', {}, screenHead([h('a', { href: '#/treinos', 'aria-label': 'Voltar para Treinos' }, 'Treinos'), '  /  sessão ' + pad(sess.weekday)], 'Detalhes.', sess.title, 't39'),
    h('section', { class: 'card plum cover', 'aria-labelledby': 'cv-t' }, h('p', { class: 'micro' }, 'Side A   /   Movement archive'),
      h('h2', { id: 'cv-t' }, sess.title), h('p', { class: 'desc' }, sess.prescriptions.length + ' movimento(s) nesta sessão.'), disc('disc')),
    h('div', { class: 'section-head' }, h('h2', { class: 'label', style: 'font-family:var(--y-font-label)' }, 'Tracklist  /  movimentos')),
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
      }, h('div', { class: 'fields' }, fields), h('div', { class: 'form-actions' }, h('button', { class: 'btn', type: 'submit' }, 'Registrar série')), msg);
      const hist = logsForExercise(app.state, ex.id).slice(0, 5);
      return h('article', { class: 'card movement', style: 'grid-template-columns:44px 1fr' },
        h('span', { class: 'num', 'aria-hidden': 'true' }, pad(i + 1)),
        h('div', {}, h('h3', { class: 'name', style: 'font-family:var(--y-font-label)' }, ex.name), h('p', { class: 'desc' }, 'Prescrito: ' + targetText(rx.target)),
          rx.target.notes ? h('p', { class: 'desc' }, rx.target.notes) : null),
        h('div', { style: 'grid-column:1 / -1;margin-top:10px' }, h('p', { class: 'label' }, 'Registro de execução'), form,
          hist.length ? h('details', {}, h('summary', { class: 'label' }, 'Histórico recente (' + hist.length + ')'),
            h('ul', {}, hist.map((l) => h('li', {}, l.date + ' — ' + l.sets.map((s) => Object.entries(s).map(([k, v]) => LABEL[k] + ': ' + v).join(', ')).join(' | '))))) : h('p', { class: 'micro' }, 'Sem registros ainda.')));
    }));
}
