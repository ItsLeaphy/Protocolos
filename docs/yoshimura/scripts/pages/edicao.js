// Telas de edição da programação: sessões, exercícios da sessão, prescrição e biblioteca de exercícios.
// Toda regra de negócio fica em domain/operations.js; aqui só formulários, mensagens e navegação. Nenhum innerHTML.
import { h } from '../components/dom.js';
import { screenHead, DAYS, pad, targetText } from '../components/ui.js';
import { WEEKDAYS, MODALITIES, MODALITY_LABEL, TRACKING, TRACKING_LABEL } from '../domain/schema.js';
import * as op from '../domain/operations.js';

const byOrder = (a, b) => a.order - b.order;
const byName = (a, b) => a.name.localeCompare(b.name, 'pt-BR');
const crumbs = (...parts) => parts.flatMap((p, i) => [i ? '  /  ' : null, p.href ? h('a', { href: p.href }, p.label) : p]).filter(Boolean);
const TREINOS = { label: 'Treinos', href: '#/treinos' };

// Mensagem inline do formulário (erros ficam ao lado de quem preenche; sucesso vai para o aviso fixo do topo).
function status() {
  const el = h('p', { class: 'msg', role: 'status' });
  return {
    el,
    err(t) { el.className = 'msg error'; el.setAttribute('role', 'alert'); el.textContent = t; },
  };
}
const row = (id, label, control, hint) => h('div', { class: 'form-row' }, h('label', { for: id }, label), control, hint ? h('p', { class: 'hint' }, hint) : null);

// ---------- Formulário de sessão (criar e editar) ----------
function sessionForm(app, { session = null, weekday = null, prefix }) {
  const st = status();
  const taken = new Map((app.state.plan?.sessions ?? []).filter((s) => s.id !== session?.id).map((s) => [s.weekday, s.title]));
  const name = h('input', { id: prefix + '-nome', name: 'title', type: 'text', maxlength: '200', autocomplete: 'off', value: session?.title ?? '' });
  const want = session?.weekday ?? weekday;
  const sel = h('select', { id: prefix + '-dia', name: 'weekday' }, DAYS.map(([n, , nome]) =>
    h('option', { value: n, disabled: taken.has(n), selected: n === want && !taken.has(n) }, nome + (taken.has(n) ? ' — em uso por ' + taken.get(n) : ''))));
  return h('form', {
    novalidate: true,
    onsubmit: (e) => {
      e.preventDefault();
      const input = { title: name.value, weekday: sel.value };
      const r = session ? op.updateSession(app.state, session.id, input) : op.createSession(app.state, input);
      if (!r.ok) { st.err(r.error); if (!name.value.trim()) name.focus(); return; }
      if (session) app.set(r.state, { kind: 'ok', text: 'Sessão atualizada.' });
      else if (app.set(r.state, { kind: 'ok', text: 'Sessão criada. Agora adicione os exercícios.' })) app.go('#/treinos/' + r.id + '/editar');
    },
  }, row(prefix + '-nome', 'Nome da sessão', name, 'Ex.: o nome que você usa para o treino do dia.'), row(prefix + '-dia', 'Dia da semana', sel),
  h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit' }, session ? 'Salvar sessão' : 'Criar sessão')), st.el);
}

// ---------- Formulário de exercício (criar e editar) ----------
function exerciseForm(app, { exercise = null, prefix, addToSession = null }) {
  const st = status();
  const name = h('input', { id: prefix + '-nome', name: 'name', type: 'text', maxlength: '200', autocomplete: 'off', value: exercise?.name ?? '' });
  const sel = h('select', { id: prefix + '-mod', name: 'modality' },
    exercise ? null : h('option', { value: '' }, 'Escolha a modalidade'),
    MODALITIES.map((m) => h('option', { value: m, selected: exercise?.modality === m }, MODALITY_LABEL[m])));
  const boxes = {};
  const checks = TRACKING.map((t) => {
    boxes[t] = h('input', { id: prefix + '-tr-' + t, type: 'checkbox', name: t, checked: exercise ? exercise.tracking.includes(t) : t === 'reps' });
    return h('label', { class: 'check', for: prefix + '-tr-' + t }, boxes[t], TRACKING_LABEL[t]);
  });
  return h('form', {
    novalidate: true,
    onsubmit: (e) => {
      e.preventDefault();
      const input = { name: name.value, modality: sel.value, tracking: TRACKING.filter((t) => boxes[t].checked) };
      let r = exercise ? op.updateExercise(app.state, exercise.id, input) : op.createExercise(app.state, input);
      if (r.ok && !exercise && addToSession) {
        const r2 = op.addPrescription(r.state, addToSession, r.id);
        r = r2.ok ? { ...r2, id: r.id } : r2;
      }
      if (!r.ok) { st.err(r.error); if (!name.value.trim()) name.focus(); return; }
      const nm = input.name.trim().replace(/\s+/g, ' ');
      app.set(r.state, { kind: 'ok', text: exercise ? 'Exercício "' + nm + '" atualizado.' : addToSession ? 'Exercício "' + nm + '" criado e adicionado à sessão. Defina a prescrição.' : 'Exercício "' + nm + '" criado.' });
    },
  }, row(prefix + '-nome', 'Nome do exercício', name), row(prefix + '-mod', 'Modalidade', sel),
  h('fieldset', {}, h('legend', {}, 'Tipos de registro'), h('p', { class: 'hint' }, 'O que você anota a cada série.'), checks),
  exercise ? h('p', { class: 'hint' }, 'Nome e tipos de registro valem para todas as sessões que usam este exercício. O histórico continua ligado a ele.') : null,
  h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit' }, exercise ? 'Salvar exercício' : addToSession ? 'Criar e adicionar' : 'Criar exercício')), st.el);
}

// ---------- Formulário da prescrição ----------
const TARGET_LABEL = { sets: 'Séries', repsMin: 'Reps mín.', repsMax: 'Reps máx.', load: 'Carga (kg)', time: 'Tempo (s)', distance: 'Distância (m)', assist: 'Assistência (kg)' };
function prescriptionForm(app, rx, ex) {
  const st = status(), t = rx.target;
  const show = ['sets'];
  if (ex.tracking.includes('reps') || t.repsMin != null || t.repsMax != null) show.push('repsMin', 'repsMax');
  for (const k of ['load', 'time', 'distance', 'assist']) if (ex.tracking.includes(k) || t[k] != null) show.push(k);
  const inputs = {};
  const fields = show.map((k) => {
    inputs[k] = h('input', { id: 'rx-' + rx.id + '-' + k, name: k, type: 'text', inputmode: 'decimal', autocomplete: 'off', value: t[k] != null ? String(t[k]).replace('.', ',') : '' });
    return row('rx-' + rx.id + '-' + k, TARGET_LABEL[k], inputs[k]);
  });
  const notes = h('textarea', { id: 'rx-' + rx.id + '-notes', name: 'notes', maxlength: '1000', rows: '3' }, t.notes ?? '');
  return h('form', {
    novalidate: true,
    onsubmit: (e) => {
      e.preventDefault();
      Object.values(inputs).forEach((i) => i.removeAttribute('aria-invalid'));
      const raw = Object.fromEntries(show.map((k) => [k, inputs[k].value]));
      raw.notes = notes.value;
      const r = op.buildTarget(raw);
      if (!r.ok) {
        const keys = Object.keys(r.errors);
        for (const k of keys) inputs[k]?.setAttribute('aria-invalid', 'true');
        st.err(Object.values(r.errors).join(' '));
        (inputs[keys[0]] ?? notes).focus();
        return;
      }
      app.set(op.updatePrescription(app.state, rx.id, r.patch), { kind: 'ok', text: 'Prescrição de "' + ex.name + '" salva.' });
    },
  }, h('div', { class: 'row2' }, fields), row('rx-' + rx.id + '-notes', 'Observações', notes),
  h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit' }, 'Salvar prescrição')), st.el);
}

// ---------- Item de exercício dentro da sessão ----------
function prescriptionItem(app, sess, rx, ex, i, n) {
  const key = (k) => k + '-' + rx.id;
  const move = (delta) => () => {
    const r = op.movePrescription(app.state, sess.id, rx.id, delta);
    if (!r.ok) { app.notice = { kind: 'error', text: r.error }; app.emit(); return; }
    const j = i + delta;
    app.focusKey = key(delta < 0 ? (j > 0 ? 'up' : 'down') : (j < n - 1 ? 'down' : 'up'));
    app.set(r.state, { kind: 'ok', text: '"' + ex.name + '" agora é o ' + (j + 1) + 'º de ' + n + '.' });
  };
  const empty = Object.keys(rx.target).length === 0;
  return h('li', { class: 'card alt edit-item' },
    h('div', { class: 'edit-top' }, h('span', { class: 'num', 'aria-hidden': 'true' }, pad(i + 1)),
      h('div', {}, h('h3', { class: 'name' }, ex.name), h('p', { class: 'desc' }, targetText(rx.target)), rx.target.notes ? h('p', { class: 'desc' }, rx.target.notes) : null)),
    h('div', { class: 'actions' },
      h('button', { class: 'btn ghost', type: 'button', 'data-fk': key('up'), 'aria-label': 'Subir ' + ex.name, disabled: i === 0, onclick: move(-1) }, 'Subir'),
      h('button', { class: 'btn ghost', type: 'button', 'data-fk': key('down'), 'aria-label': 'Descer ' + ex.name, disabled: i === n - 1, onclick: move(1) }, 'Descer'),
      h('button', { class: 'btn ghost', type: 'button', 'aria-label': 'Remover ' + ex.name + ' da sessão', onclick: () => {
        if (!confirm('Remover "' + ex.name + '" desta sessão? O exercício e os registros anteriores continuam salvos.')) return;
        const r = op.removePrescription(app.state, sess.id, rx.id);
        if (!r.ok) { app.notice = { kind: 'error', text: r.error }; app.emit(); return; }
        app.focusKey = 'lista-ex';
        app.set(r.state, { kind: 'ok', text: '"' + ex.name + '" removido da sessão. Os registros foram mantidos.' });
      } }, 'Remover')),
    h('details', { open: empty }, h('summary', { class: 'label' }, 'Editar prescrição'), prescriptionForm(app, rx, ex)));
}

// ---------- Páginas ----------

export function renderEditarSessao(app, sess) {
  const exMap = new Map(app.state.exercises.map((e) => [e.id, e]));
  const list = [...sess.prescriptions].sort(byOrder);
  const st = status();
  const select = h('select', { id: 'add-ex', name: 'exercise', 'data-fk': 'add-ex' }, h('option', { value: '' }, 'Escolha um exercício'),
    [...app.state.exercises].sort(byName).map((e) => h('option', { value: e.id }, e.name + ' — ' + MODALITY_LABEL[e.modality] + (list.some((p) => p.exerciseId === e.id) ? ' (já na sessão)' : ''))));
  return h('div', {},
    screenHead(crumbs(TREINOS, { label: 'sessão ' + pad(sess.weekday), href: '#/treinos/' + sess.id }, 'editar'), 'Editar.', sess.title, 't40'),
    h('section', { class: 'card alt', 'aria-labelledby': 'ed-ss' }, h('h2', { id: 'ed-ss', class: 'label' }, 'Sessão'), sessionForm(app, { session: sess, prefix: 'ss' })),
    h('div', { class: 'section-head' }, h('h2', { class: 'label', tabindex: '-1', 'data-fk': 'lista-ex' }, 'Exercícios da sessão (' + list.length + ')')),
    list.length
      ? h('ul', { class: 'edit-list' }, list.map((rx, i) => prescriptionItem(app, sess, rx, exMap.get(rx.exerciseId), i, list.length)))
      : h('p', { class: 'empty' }, 'Esta sessão ainda não tem exercícios. Adicione um abaixo.'),
    h('section', { class: 'card alt', 'aria-labelledby': 'ed-add' }, h('h2', { id: 'ed-add', class: 'label' }, 'Adicionar exercício'),
      app.state.exercises.length
        ? h('form', {
          novalidate: true,
          onsubmit: (e) => {
            e.preventDefault();
            if (!select.value) { st.err('Escolha um exercício da lista.'); select.focus(); return; }
            const r = op.addPrescription(app.state, sess.id, select.value);
            if (!r.ok) { st.err(r.error); return; }
            app.focusKey = 'add-ex';
            app.set(r.state, { kind: 'ok', text: '"' + exMap.get(select.value).name + '" adicionado à sessão. Defina a prescrição.' });
          },
        }, row('add-ex', 'Exercício já cadastrado', select), h('div', { class: 'actions' }, h('button', { class: 'btn', type: 'submit' }, 'Adicionar à sessão')), st.el)
        : h('p', { class: 'hint' }, 'Ainda não há exercícios cadastrados. Crie o primeiro logo abaixo.'),
      h('details', { open: !app.state.exercises.length }, h('summary', { class: 'label' }, 'Criar novo exercício'), exerciseForm(app, { prefix: 'nx', addToSession: sess.id }))),
    h('div', { class: 'actions' }, h('a', { class: 'btn', href: '#/treinos/' + sess.id }, 'Concluir e ver a sessão')));
}

export function renderNovaSessao(app, weekday = null) {
  const used = new Set((app.state.plan?.sessions ?? []).map((s) => s.weekday));
  const full = DAYS.every(([n]) => used.has(n));
  return h('div', {},
    screenHead(crumbs(TREINOS, 'nova sessão'), 'Nova.', 'Uma sessão por dia, de segunda a sexta.', 't40'),
    full
      ? h('p', { class: 'empty' }, 'Todos os dias, de segunda a sexta, já têm sessão. Edite ou exclua uma delas para liberar um dia.')
      : h('section', { class: 'card alt', 'aria-labelledby': 'nv-t' }, h('h2', { id: 'nv-t', class: 'label' }, 'Dados da sessão'), sessionForm(app, { weekday, prefix: 'nv' })),
    h('div', { class: 'actions' }, h('a', { class: 'btn ghost', href: '#/treinos' }, 'Voltar')));
}

export function renderEditarProgramacao(app) {
  const sessions = app.state.plan?.sessions ?? [];
  return h('div', {},
    screenHead(crumbs(TREINOS, 'editar programação'), 'Editar.', 'Sessões da semana.', 't40'),
    sessions.length
      ? h('ul', { class: 'edit-list' }, sessions.map((s) => h('li', { class: 'card alt edit-item' },
        h('h3', { class: 'name' }, s.title), h('p', { class: 'desc' }, WEEKDAYS[s.weekday] + ' · ' + s.prescriptions.length + ' exercício(s)'),
        h('div', { class: 'actions' }, h('a', { class: 'btn', href: '#/treinos/' + s.id + '/editar' }, 'Editar sessão'),
          h('button', { class: 'btn ghost', type: 'button', 'aria-label': 'Excluir a sessão ' + s.title, onclick: () => {
            if (!confirm('Excluir a sessão "' + s.title + '"? Os exercícios e os registros já feitos continuam salvos, sem vínculo com a sessão. Não dá para desfazer.')) return;
            const r = op.deleteSession(app.state, s.id);
            if (!r.ok) { app.notice = { kind: 'error', text: r.error }; app.emit(); return; }
            app.set(r.state, { kind: 'ok', text: 'Sessão "' + s.title + '" excluída. Exercícios e registros foram mantidos.' });
          } }, 'Excluir')))))
      : h('p', { class: 'empty' }, 'Nenhuma sessão ainda. Crie a primeira para montar sua programação.'),
    h('div', { class: 'actions' },
      sessions.length < DAYS.length ? h('a', { class: 'btn', href: '#/treinos/nova' }, 'Nova sessão') : null,
      h('a', { class: 'btn ghost', href: '#/treinos/exercicios' }, 'Exercícios'),
      h('a', { class: 'btn ghost', href: '#/treinos' }, 'Voltar')));
}

export function renderExercicios(app) {
  const exs = [...app.state.exercises].sort(byName);
  return h('div', {},
    screenHead(crumbs(TREINOS, 'exercícios'), 'Exercícios.', 'Cadastro usado pelas sessões e pelo histórico.', 't40'),
    exs.length
      ? h('ul', { class: 'edit-list' }, exs.map((ex) => {
        const u = op.exerciseUsage(app.state, ex.id);
        const locked = u.logs > 0 || u.sessions > 0;
        return h('li', { class: 'card alt edit-item' },
          h('h3', { class: 'name' }, ex.name),
          h('p', { class: 'desc' }, MODALITY_LABEL[ex.modality] + ' · registra: ' + ex.tracking.map((t) => TRACKING_LABEL[t].toLowerCase()).join(', ')),
          h('p', { class: 'desc' }, u.sessions + ' sessão(ões) · ' + u.logs + ' registro(s) no histórico'),
          h('div', { class: 'actions' }, h('button', { class: 'btn ghost', type: 'button', disabled: locked, 'aria-label': 'Excluir o exercício ' + ex.name, onclick: () => {
            if (!confirm('Excluir "' + ex.name + '" definitivamente? Não dá para desfazer.')) return;
            const r = op.deleteExercise(app.state, ex.id);
            if (!r.ok) { app.notice = { kind: 'error', text: r.error }; app.emit(); return; }
            app.set(r.state, { kind: 'ok', text: 'Exercício "' + ex.name + '" excluído.' });
          } }, 'Excluir')),
          locked ? h('p', { class: 'hint' }, u.logs > 0 ? 'Tem registros no histórico: não pode ser excluído.' : 'Está em sessões: remova-o delas para poder excluir.') : null,
          h('details', {}, h('summary', { class: 'label' }, 'Editar exercício'), exerciseForm(app, { exercise: ex, prefix: 'ex-' + ex.id })));
      }))
      : h('p', { class: 'empty' }, 'Nenhum exercício cadastrado ainda.'),
    h('section', { class: 'card alt', 'aria-labelledby': 'nx-t' }, h('h2', { id: 'nx-t', class: 'label' }, 'Novo exercício'),
      h('details', { open: !exs.length }, h('summary', { class: 'label' }, 'Criar exercício'), exerciseForm(app, { prefix: 'nx' }))),
    h('div', { class: 'actions' }, h('a', { class: 'btn ghost', href: '#/treinos' }, 'Voltar')));
}
