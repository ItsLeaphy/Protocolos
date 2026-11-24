import { h } from '../components/dom.js';
import { screenHead, DAYS, pad, targetText, FIELD_LABEL as LABEL } from '../components/ui.js';
import { disc, soundwave } from '../components/art.js';
import { addLog, logsForExercise } from '../domain/operations.js';
import { renderEditarSessao, renderNovaSessao, renderEditarProgramacao, renderExercicios } from './edicao.js';

// Frame "02 Treinos": visão da semana + tracklist. Sem programação: estado vazio com orientação para criar.
function lista(app) {
  const plan = app.state.plan;
  const n = plan?.sessions.length ?? 0;
  return h('div', {}, screenHead('Programação  ·  02', 'Treinos.', 'Uma semana de cada vez.', 't40'),
    h('section', { class: 'card overview', 'aria-labelledby': 'wk-t' },
      h('p', { class: 'micro' }, 'Week index  /  01'), h('h2', { id: 'wk-t' }, 'SEG  —  SEX'),
      h('p', { class: 'note' }, n ? n + ' de 5 dias com sessão' : 'Nenhuma sessão criada ainda'), soundwave('wave')),
    n ? null : h('section', { class: 'card alt', 'aria-labelledby': 'vz-t' }, h('h2', { id: 'vz-t', class: 'label' }, 'Comece sua programação'),
      h('p', { class: 'desc' }, 'Crie uma sessão para cada dia de treino e adicione os exercícios. Tudo pode ser editado depois.'),
      h('div', { class: 'actions' }, h('a', { class: 'btn', href: '#/treinos/nova' }, 'Criar primeira sessão'))),
    h('div', { class: 'track-head' }, h('h2', { class: 'label', style: 'font-family:var(--y-font-label)' }, 'Tracklist  /  programação'),
      h('p', { class: 'note' }, n ? 'Escolha uma sessão.' : 'Toque em um dia para criar a sessão.')),
    h('ul', { class: 'tracklist' }, DAYS.map(([d, , nome]) => {
      const sess = plan?.sessions.find((x) => x.weekday === d);
      return h('li', {}, h('a', { class: 'track' + (sess ? ' has' : ''), href: '#/treinos/' + (sess ? sess.id : 'dia-' + d) },
        h('span', { class: 'num' }, pad(d)),
        h('span', {}, h('span', { class: 'day-name' }, nome), h('span', { class: 'status' }, 'Sessão  ·  ' + (sess ? sess.title : 'a definir'))),
        h('span', { class: 'marker', 'aria-hidden': 'true' })));
    })),
    h('div', { class: 'actions' }, h('a', { class: 'btn', href: '#/treinos/editar' }, 'Editar programação'), h('a', { class: 'btn ghost', href: '#/treinos/exercicios' }, 'Exercícios')));
}

export function renderTreinos(app, arg, sub) {
  if (!arg) return lista(app);
  if (arg === 'editar') return renderEditarProgramacao(app);
  if (arg === 'nova') return renderNovaSessao(app);
  if (arg === 'exercicios') return renderExercicios(app);
  if (/^dia-[1-5]$/.test(arg)) return renderNovaSessao(app, Number(arg.slice(4)));
  const sess = app.state.plan?.sessions.find((x) => x.id === arg);
  if (!sess) return h('div', {}, h('p', { class: 'empty' }, 'Sessão não encontrada.'), h('a', { class: 'btn', href: '#/treinos' }, 'Voltar'));
  if (sub === 'editar') return renderEditarSessao(app, sess);
  const exMap = new Map(app.state.exercises.map((e) => [e.id, e]));
  return h('div', {}, screenHead([h('a', { href: '#/treinos', 'aria-label': 'Voltar para Treinos' }, 'Treinos'), '  /  sessão ' + pad(sess.weekday)], 'Detalhes.', sess.title, 't39'),
    h('section', { class: 'card plum cover', 'aria-labelledby': 'cv-t' }, h('p', { class: 'micro' }, 'Side A   /   Movement archive'),
      h('h2', { id: 'cv-t' }, sess.title), h('p', { class: 'desc' }, sess.prescriptions.length + ' movimento(s) nesta sessão.'), disc('disc')),
    h('div', { class: 'actions' }, h('a', { class: 'btn', href: '#/treinos/' + sess.id + '/editar' }, 'Editar sessão')),
    h('div', { class: 'section-head' }, h('h2', { class: 'label', style: 'font-family:var(--y-font-label)' }, 'Tracklist  /  movimentos')),
    sess.prescriptions.length ? null : h('p', { class: 'empty' }, 'Esta sessão ainda não tem exercícios. Toque em "Editar sessão" para adicionar.'),
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
