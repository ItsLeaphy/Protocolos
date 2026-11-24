// Operações puras de domínio: retornam NOVO estado, nunca mutam o anterior.
// As operações de edição devolvem { ok:true, state, id? } ou { ok:false, error } (mensagem em português para a UI).
// Histórico: logs guardam exerciseId e um snapshot da prescrição; nenhuma operação aqui associa log a outro exercício.
import { makeLog, makeExercise, makePrescription, makeSession, newId, LIMITS, MODALITIES, TRACKING, WEEKDAYS } from './schema.js';

const fail = (error) => ({ ok: false, error });
const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const norm = (s) => clean(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const byOrder = (a, b) => a.order - b.order;
const renumber = (list) => list.map((p, i) => ({ ...p, order: i }));

// ---------- Prescrição e registro (já existentes) ----------

// patch: campos com null/undefined são REMOVIDOS do alvo; os demais são gravados.
export function updatePrescription(state, prescriptionId, patch) {
  if (!state.plan) return state;
  const plan = {
    ...state.plan,
    sessions: state.plan.sessions.map((ss) => ({
      ...ss,
      prescriptions: ss.prescriptions.map((p) => {
        if (p.id !== prescriptionId) return p;
        const target = { ...p.target };
        for (const [k, v] of Object.entries(patch)) { if (v === null || v === undefined) delete target[k]; else target[k] = v; }
        return { ...p, target };
      }),
    })),
  };
  return { ...state, plan }; // logs intocados: cada log guarda seu próprio snapshot
}

export function addLog(state, input) {
  return { ...state, logs: [...state.logs, makeLog(input)] };
}

export function findSessionForWeekday(state, weekday) {
  return state.plan?.sessions.find((s) => s.weekday === weekday) ?? null;
}

export function logsForExercise(state, exerciseId) {
  return state.logs.filter((l) => l.exerciseId === exerciseId).sort((a, b) => (a.date < b.date ? 1 : -1));
}

// ---------- Sessões ----------

function checkSessionInput(state, { title, weekday }, selfId) {
  const t = clean(title);
  if (!t) return { error: 'Dê um nome à sessão.' };
  if (t.length > LIMITS.text) return { error: 'O nome da sessão passa de ' + LIMITS.text + ' caracteres.' };
  const wd = Number(weekday);
  if (!Number.isInteger(wd) || !WEEKDAYS[wd]) return { error: 'Escolha um dia, de segunda a sexta.' };
  const other = state.plan?.sessions.find((s) => s.weekday === wd && s.id !== selfId);
  if (other) return { error: 'Já existe a sessão "' + other.title + '" na ' + WEEKDAYS[wd].toLowerCase() + '. Escolha outro dia ou edite aquela.' };
  return { value: { title: t, weekday: wd } };
}

export function createSession(state, input) {
  const c = checkSessionInput(state, input, null);
  if (c.error) return fail(c.error);
  if ((state.plan?.sessions.length ?? 0) >= LIMITS.sessions) return fail('Limite de ' + LIMITS.sessions + ' sessões atingido.');
  const plan = state.plan ?? { id: newId('pl'), name: 'Minha programação', sessions: [] };
  const ss = makeSession(c.value.weekday, c.value.title);
  const sessions = [...plan.sessions, ss].sort((a, b) => a.weekday - b.weekday);
  return { ok: true, id: ss.id, state: { ...state, plan: { ...plan, sessions } } };
}

export function updateSession(state, sessionId, input) {
  const cur = state.plan?.sessions.find((s) => s.id === sessionId);
  if (!cur) return fail('Sessão não encontrada.');
  const c = checkSessionInput(state, input, sessionId);
  if (c.error) return fail(c.error);
  const sessions = state.plan.sessions.map((s) => (s.id === sessionId ? { ...s, ...c.value } : s)).sort((a, b) => a.weekday - b.weekday);
  return { ok: true, id: sessionId, state: { ...state, plan: { ...state.plan, sessions } } };
}

// Excluir a sessão NÃO apaga registros: os logs ficam com o exercício e o snapshot, só perdem o vínculo (sessionId = null).
export function deleteSession(state, sessionId) {
  if (!state.plan?.sessions.some((s) => s.id === sessionId)) return fail('Sessão não encontrada.');
  const sessions = state.plan.sessions.filter((s) => s.id !== sessionId);
  const logs = state.logs.map((l) => (l.sessionId === sessionId ? { ...l, sessionId: null } : l));
  return { ok: true, state: { ...state, plan: { ...state.plan, sessions }, logs } };
}

// ---------- Exercícios ----------

function checkExerciseInput(state, { name, modality, tracking }, selfId) {
  const n = clean(name);
  if (!n) return { error: 'Dê um nome ao exercício.' };
  if (n.length > LIMITS.text) return { error: 'O nome do exercício passa de ' + LIMITS.text + ' caracteres.' };
  if (!MODALITIES.includes(modality)) return { error: 'Escolha uma modalidade.' };
  const tr = TRACKING.filter((t) => (tracking ?? []).includes(t));
  if (!tr.length) return { error: 'Marque ao menos um tipo de registro.' };
  if (state.exercises.some((e) => e.id !== selfId && norm(e.name) === norm(n))) return { error: 'Já existe um exercício chamado "' + n + '".' };
  return { value: { name: n, modality, tracking: tr } };
}

export function createExercise(state, input) {
  const c = checkExerciseInput(state, input, null);
  if (c.error) return fail(c.error);
  if (state.exercises.length >= LIMITS.exercises) return fail('Limite de ' + LIMITS.exercises + ' exercícios atingido.');
  const ex = makeExercise(c.value.name, c.value.modality, c.value.tracking);
  return { ok: true, id: ex.id, state: { ...state, exercises: [...state.exercises, ex] } };
}

// O id nunca muda; nome, modalidade e tipos de registro mudam em todos os lugares que o usam, e o histórico continua ligado ao id.
export function updateExercise(state, exerciseId, input) {
  if (!state.exercises.some((e) => e.id === exerciseId)) return fail('Exercício não encontrado.');
  const c = checkExerciseInput(state, input, exerciseId);
  if (c.error) return fail(c.error);
  return { ok: true, id: exerciseId, state: { ...state, exercises: state.exercises.map((e) => (e.id === exerciseId ? { ...e, ...c.value } : e)) } };
}

export function exerciseUsage(state, exerciseId) {
  const logs = state.logs.filter((l) => l.exerciseId === exerciseId).length;
  const sessions = (state.plan?.sessions ?? []).filter((s) => s.prescriptions.some((p) => p.exerciseId === exerciseId)).length;
  return { logs, sessions };
}

// Exclusão definitiva só para exercício sem histórico e fora de qualquer sessão.
export function deleteExercise(state, exerciseId) {
  const ex = state.exercises.find((e) => e.id === exerciseId);
  if (!ex) return fail('Exercício não encontrado.');
  const u = exerciseUsage(state, exerciseId);
  if (u.logs > 0) return fail('"' + ex.name + '" tem ' + u.logs + ' registro(s) no histórico e não pode ser excluído.');
  if (u.sessions > 0) return fail('"' + ex.name + '" ainda está em ' + u.sessions + ' sessão(ões). Remova-o delas antes de excluir.');
  return { ok: true, state: { ...state, exercises: state.exercises.filter((e) => e.id !== exerciseId) } };
}

// ---------- Prescrições na sessão ----------

function mapSession(state, sessionId, fn) {
  const ss = state.plan?.sessions.find((s) => s.id === sessionId);
  if (!ss) return fail('Sessão não encontrada.');
  const r = fn(ss);
  if (r.error) return fail(r.error);
  const sessions = state.plan.sessions.map((s) => (s.id === sessionId ? { ...s, prescriptions: r.prescriptions } : s));
  return { ok: true, id: r.id, state: { ...state, plan: { ...state.plan, sessions } } };
}

// Alvo começa vazio: nenhum número é inventado; quem edita define a prescrição.
export function addPrescription(state, sessionId, exerciseId, target = {}) {
  if (!state.exercises.some((e) => e.id === exerciseId)) return fail('Exercício não encontrado.');
  return mapSession(state, sessionId, (ss) => {
    if (ss.prescriptions.length >= LIMITS.prescriptions) return { error: 'Limite de ' + LIMITS.prescriptions + ' exercícios por sessão atingido.' };
    const rx = makePrescription(exerciseId, ss.prescriptions.length, target);
    return { prescriptions: [...[...ss.prescriptions].sort(byOrder), rx], id: rx.id };
  });
}

// Remove só da sessão. Logs e exercício continuam existindo.
export function removePrescription(state, sessionId, prescriptionId) {
  return mapSession(state, sessionId, (ss) => {
    if (!ss.prescriptions.some((p) => p.id === prescriptionId)) return { error: 'Exercício não está nesta sessão.' };
    return { prescriptions: renumber([...ss.prescriptions].sort(byOrder).filter((p) => p.id !== prescriptionId)) };
  });
}

// delta: -1 sobe, +1 desce.
export function movePrescription(state, sessionId, prescriptionId, delta) {
  return mapSession(state, sessionId, (ss) => {
    const list = [...ss.prescriptions].sort(byOrder);
    const i = list.findIndex((p) => p.id === prescriptionId);
    if (i < 0) return { error: 'Exercício não está nesta sessão.' };
    const j = i + delta;
    if (j < 0 || j >= list.length) return { error: delta < 0 ? 'Já é o primeiro da sessão.' : 'Já é o último da sessão.' };
    [list[i], list[j]] = [list[j], list[i]];
    return { prescriptions: renumber(list), id: prescriptionId };
  });
}

// ---------- Formulário da prescrição ----------

const TARGET_RULES = {
  sets: { label: 'Séries', max: 100, int: true },
  repsMin: { label: 'Repetições (mínimo)', max: 1000, int: true },
  repsMax: { label: 'Repetições (máximo)', max: 1000, int: true },
  load: { label: 'Carga (kg)', max: 2000 },
  time: { label: 'Tempo (s)', max: 86400 },
  distance: { label: 'Distância (m)', max: 1000000 },
  assist: { label: 'Assistência (kg)', max: 2000 },
};

// raw: textos do formulário, só com as chaves exibidas. Vazio remove o campo. Devolve { ok, patch } ou { ok:false, errors:{campo: mensagem} }.
export function buildTarget(raw) {
  const patch = {}, errors = {};
  for (const [k, rule] of Object.entries(TARGET_RULES)) {
    if (!(k in raw)) continue;
    const t = String(raw[k] ?? '').trim().replace(',', '.');
    if (t === '') { patch[k] = null; continue; }
    const v = Number(t);
    if (!/^\d+(\.\d+)?$/.test(t) || !Number.isFinite(v)) errors[k] = rule.label + ': digite um número, sem sinal.';
    else if (rule.int && !Number.isInteger(v)) errors[k] = rule.label + ': use um número inteiro.';
    else if (v > rule.max) errors[k] = rule.label + ': máximo ' + rule.max + '.';
    else patch[k] = v;
  }
  if (typeof patch.repsMin === 'number' && typeof patch.repsMax === 'number' && patch.repsMin > patch.repsMax) errors.repsMax = 'Repetições: o máximo não pode ser menor que o mínimo.';
  if ('notes' in raw) {
    const n = String(raw.notes ?? '').trim();
    if (n.length > LIMITS.notes) errors.notes = 'Observações: máximo ' + LIMITS.notes + ' caracteres.';
    else patch.notes = n === '' ? null : n;
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, patch };
}
