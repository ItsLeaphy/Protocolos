// Valida estado e importações. Retorna { ok, errors } sem lançar exceção e sem mutar.
import { SCHEMA_VERSION, MODALITIES, LIMITS } from './schema.js';

const ID_RE = /^[a-z]{2}_[A-Za-z0-9-]{4,40}$/;
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TRACKING = ['reps', 'load', 'time', 'distance', 'assist'];
const SET_FIELDS = { reps: [0, 1000], load: [0, 2000], time: [0, 86400], distance: [0, 1000000], assist: [0, 2000] };
const TOP_KEYS = ['schema', 'demo', 'exercises', 'plan', 'logs'];

export function isRealDate(s) {
  const m = DATE_RE.exec(s || '');
  if (!m) return false;
  const [y, mo, d] = [+m[1], +m[2], +m[3]];
  const dt = new Date(y, mo - 1, d);
  return y >= 2000 && y <= 2100 && dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d;
}
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const str = (v, max) => typeof v === 'string' && v.length <= max;
const num = (v, [lo, hi]) => typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi;

export function validateState(s) {
  const e = [];
  const err = (m) => { if (e.length < 50) e.push(m); };
  if (!isObj(s)) return { ok: false, errors: ['Estado não é um objeto.'] };
  for (const k of Object.keys(s)) if (!TOP_KEYS.includes(k)) err('Campo desconhecido: ' + k);
  if (s.schema !== SCHEMA_VERSION) err('Versão de esquema não suportada: ' + String(s.schema));
  if (typeof s.demo !== 'boolean') err('Campo "demo" deve ser booleano.');

  const exIds = new Set();
  if (!Array.isArray(s.exercises) || s.exercises.length > LIMITS.exercises) err('Lista de exercícios inválida ou grande demais.');
  else for (const x of s.exercises) {
    if (!isObj(x) || !ID_RE.test(x.id) || exIds.has(x.id)) { err('Exercício com id inválido ou repetido.'); continue; }
    exIds.add(x.id);
    if (!str(x.name, LIMITS.text) || !x.name.trim()) err('Exercício ' + x.id + ': nome inválido.');
    if (!MODALITIES.includes(x.modality)) err('Exercício ' + x.id + ': modalidade inválida.');
    if (!Array.isArray(x.tracking) || !x.tracking.length || !x.tracking.every((t) => TRACKING.includes(t))) err('Exercício ' + x.id + ': tipos de registro inválidos.');
  }

  const sessionIds = new Set();
  const rxById = new Map();
  if (s.plan !== null) {
    if (!isObj(s.plan) || !ID_RE.test(s.plan.id) || !str(s.plan.name, LIMITS.text) || !Array.isArray(s.plan.sessions) || s.plan.sessions.length > LIMITS.sessions) err('Plano inválido.');
    else for (const ss of s.plan.sessions) {
      if (!isObj(ss) || !ID_RE.test(ss.id) || sessionIds.has(ss.id)) { err('Sessão com id inválido ou repetido.'); continue; }
      sessionIds.add(ss.id);
      if (!Number.isInteger(ss.weekday) || ss.weekday < 1 || ss.weekday > 5) err('Sessão ' + ss.id + ': dia da semana deve ser 1–5.');
      if (!str(ss.title, LIMITS.text)) err('Sessão ' + ss.id + ': título inválido.');
      if (!Array.isArray(ss.prescriptions) || ss.prescriptions.length > LIMITS.prescriptions) { err('Sessão ' + ss.id + ': prescrições inválidas.'); continue; }
      for (const p of ss.prescriptions) {
        if (!isObj(p) || !ID_RE.test(p.id) || rxById.has(p.id)) { err('Prescrição com id inválido ou repetido.'); continue; }
        rxById.set(p.id, ss.id);
        if (!exIds.has(p.exerciseId)) err('Prescrição ' + p.id + ': exercício inexistente.');
        if (!Number.isInteger(p.order) || p.order < 0) err('Prescrição ' + p.id + ': ordem inválida.');
        if (!isObj(p.target)) err('Prescrição ' + p.id + ': alvo inválido.');
        else for (const [k, v] of Object.entries(p.target)) {
          if (k === 'notes') { if (!str(v, LIMITS.notes)) err('Prescrição ' + p.id + ': notas inválidas.'); }
          else if (k === 'sets') { if (!num(v, [0, 100])) err('Prescrição ' + p.id + ': séries inválidas.'); }
          else if (k === 'repsMin' || k === 'repsMax') { if (!num(v, SET_FIELDS.reps)) err('Prescrição ' + p.id + ': ' + k + ' inválido.'); }
          else if (k === 'restSec') { if (!num(v, [0, 3600])) err('Prescrição ' + p.id + ': descanso inválido.'); }
          else if (SET_FIELDS[k]) { if (!num(v, SET_FIELDS[k])) err('Prescrição ' + p.id + ': ' + k + ' inválido.'); }
          else err('Prescrição ' + p.id + ': campo de alvo desconhecido (' + k + ').');
        }
      }
    }
  }

  const logIds = new Set();
  if (!Array.isArray(s.logs) || s.logs.length > LIMITS.logs) err('Lista de logs inválida ou grande demais.');
  else for (const l of s.logs) {
    if (!isObj(l) || !ID_RE.test(l.id) || logIds.has(l.id)) { err('Log com id inválido ou repetido.'); continue; }
    logIds.add(l.id);
    if (!isRealDate(l.date)) err('Log ' + l.id + ': data inválida (esperado AAAA-MM-DD local).');
    if (!exIds.has(l.exerciseId)) err('Log ' + l.id + ': exercício inexistente.');
    if (l.sessionId !== null && !sessionIds.has(l.sessionId)) err('Log ' + l.id + ': sessão inexistente.');
    if (!str(l.notes, LIMITS.notes)) err('Log ' + l.id + ': notas inválidas.');
    if (l.prescribed !== null && !isObj(l.prescribed)) err('Log ' + l.id + ': snapshot inválido.');
    if (!Array.isArray(l.sets) || l.sets.length > LIMITS.sets) { err('Log ' + l.id + ': séries inválidas.'); continue; }
    for (const st of l.sets) {
      if (!isObj(st)) { err('Log ' + l.id + ': série inválida.'); continue; }
      for (const [k, v] of Object.entries(st)) {
        if (!SET_FIELDS[k] || !num(v, SET_FIELDS[k])) err('Log ' + l.id + ': campo de série inválido (' + k + ').');
      }
    }
  }
  return { ok: e.length === 0, errors: e };
}
