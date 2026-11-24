// Gerenciamento de programação: sessões, exercícios, prescrições, integridade de histórico, persistência.
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDemoState } from '../scripts/data/demo-data.js';
import { validateState } from '../scripts/domain/validators.js';
import * as op from '../scripts/domain/operations.js';
import { emptyState } from '../scripts/domain/schema.js';
import { createStorage, MemoryBackend, KEY_STATE, NAMESPACE } from '../scripts/services/storage.js';

const ok = (r) => { assert.equal(r.ok, true, r.error); return r; };
const bad = (r, re) => { assert.equal(r.ok, false); if (re) assert.match(r.error, re); };
const EX = { name: 'Remada curvada', modality: 'musculacao', tracking: ['reps', 'load'] };

function base() {
  let s = emptyState();
  const a = ok(op.createSession(s, { title: 'Treino A', weekday: 1 })); s = a.state;
  const e1 = ok(op.createExercise(s, EX)); s = e1.state;
  const e2 = ok(op.createExercise(s, { name: 'Prancha', modality: 'core', tracking: ['time'] })); s = e2.state;
  s = ok(op.addPrescription(s, a.id, e1.id)).state;
  s = ok(op.addPrescription(s, a.id, e2.id)).state;
  return { s, ss: a.id, e1: e1.id, e2: e2.id };
}

test('instalação nova: estado vazio válido e nada gravado', () => {
  const b = new MemoryBackend(); const r = createStorage(b).load();
  assert.equal(r.error, null); assert.equal(r.state.plan, null); assert.equal(r.state.exercises.length, 0); assert.equal(r.state.demo, false);
  assert.equal(validateState(r.state).ok, true); assert.equal(b.m.size, 0);
});

test('sessões: criar, editar, ordenar por dia, validar e excluir', () => {
  let s = emptyState();
  const a = ok(op.createSession(s, { title: '  Treino   A ', weekday: 3 })); s = a.state;
  assert.equal(s.plan.sessions[0].title, 'Treino A'); assert.equal(validateState(s).ok, true);
  s = ok(op.createSession(s, { title: 'B', weekday: 1 })).state;
  assert.deepEqual(s.plan.sessions.map((x) => x.weekday), [1, 3]);
  bad(op.createSession(s, { title: 'C', weekday: 3 }), /Já existe/);
  bad(op.createSession(s, { title: '  ', weekday: 2 }), /nome/);
  bad(op.createSession(s, { title: 'C', weekday: 6 }), /dia/);
  bad(op.createSession(s, { title: 'x'.repeat(300), weekday: 2 }), /caracteres/);
  s = ok(op.updateSession(s, a.id, { title: 'Novo', weekday: 5 })).state;
  const ss = s.plan.sessions.find((x) => x.id === a.id);
  assert.equal(ss.title, 'Novo'); assert.equal(ss.weekday, 5); assert.equal(ss.id, a.id);
  bad(op.updateSession(s, a.id, { title: 'Novo', weekday: 1 }), /Já existe/);
  ok(op.updateSession(s, a.id, { title: 'Só renomear', weekday: 5 }));
  bad(op.updateSession(s, 'ss_naoexiste', { title: 'x', weekday: 2 }), /não encontrada/);
  s = ok(op.deleteSession(s, a.id)).state;
  assert.equal(s.plan.sessions.length, 1); bad(op.deleteSession(s, a.id));
  assert.equal(validateState(s).ok, true);
});

test('exercícios: criar, validar, editar mantendo o id', () => {
  let s = emptyState();
  const e = ok(op.createExercise(s, EX)); s = e.state;
  bad(op.createExercise(s, { ...EX, name: ' remada  CURVADA ' }), /Já existe/);
  bad(op.createExercise(s, { ...EX, name: '' }), /nome/);
  bad(op.createExercise(s, { ...EX, modality: 'x' }), /modalidade/);
  bad(op.createExercise(s, { ...EX, name: 'Outro', tracking: [] }), /registro/);
  s = ok(op.updateExercise(s, e.id, { name: 'Remada unilateral', modality: 'calistenia', tracking: ['reps'] })).state;
  assert.equal(s.exercises[0].id, e.id); assert.equal(s.exercises[0].name, 'Remada unilateral'); assert.deepEqual(s.exercises[0].tracking, ['reps']);
  assert.equal(validateState(s).ok, true);
});

test('exercício: exclusão só sem histórico e fora de sessões', () => {
  const { s, ss, e1, e2 } = base();
  bad(op.deleteExercise(s, e1), /sessão/);
  const rx = s.plan.sessions[0].prescriptions.find((p) => p.exerciseId === e2);
  let s2 = ok(op.removePrescription(s, ss, rx.id)).state;
  s2 = op.addLog(s2, { sessionId: ss, prescription: rx, exerciseId: e2, sets: [{ time: 30 }] });
  bad(op.deleteExercise(s2, e2), /histórico/);
  const e3 = ok(op.createExercise(s2, { name: 'Livre', modality: 'outro', tracking: ['reps'] }));
  const s3 = ok(op.deleteExercise(e3.state, e3.id)).state;
  assert.equal(s3.exercises.some((e) => e.id === e3.id), false); assert.equal(validateState(s3).ok, true);
});

test('prescrições: adicionar, mover, remover e renumerar', () => {
  let { s, ss, e1, e2 } = base();
  let list = s.plan.sessions[0].prescriptions;
  assert.deepEqual(list.map((p) => p.order), [0, 1]); assert.deepEqual(list[0].target, {});
  const [r1, r2] = list.map((p) => p.id);
  bad(op.movePrescription(s, ss, r1, -1), /primeiro/); bad(op.movePrescription(s, ss, r2, 1), /último/);
  s = ok(op.movePrescription(s, ss, r1, 1)).state;
  list = [...s.plan.sessions[0].prescriptions].sort((a, b) => a.order - b.order);
  assert.deepEqual(list.map((p) => p.exerciseId), [e2, e1]);
  assert.deepEqual(list.map((p) => p.order), [0, 1]);
  s = ok(op.removePrescription(s, ss, r2)).state;
  assert.equal(s.plan.sessions[0].prescriptions.length, 1); assert.equal(s.plan.sessions[0].prescriptions[0].order, 0);
  bad(op.removePrescription(s, ss, r2), /não está/);
  bad(op.addPrescription(s, ss, 'ex_naoexiste'), /não encontrado/);
  assert.equal(validateState(s).ok, true);
});

test('buildTarget: converte, valida e remove campos vazios', () => {
  assert.deepEqual(op.buildTarget({ sets: '3', repsMin: '8', repsMax: '12', load: '22,5', time: '', notes: ' ok ' }).patch, { sets: 3, repsMin: 8, repsMax: 12, load: 22.5, time: null, notes: 'ok' });
  const e = op.buildTarget({ sets: '-1', repsMin: '10', repsMax: '5', load: 'abc', time: '-2' });
  assert.equal(e.ok, false); assert.deepEqual(Object.keys(e.errors).sort(), ['load', 'repsMax', 'sets', 'time']);
  assert.equal(op.buildTarget({ sets: '2.5' }).ok, false);
  let { s } = base(); const rx = s.plan.sessions[0].prescriptions[0];
  s = op.updatePrescription(s, rx.id, op.buildTarget({ sets: '4', repsMin: '6', notes: 'n' }).patch);
  assert.deepEqual(s.plan.sessions[0].prescriptions[0].target, { sets: 4, repsMin: 6, notes: 'n' });
  s = op.updatePrescription(s, rx.id, op.buildTarget({ sets: '', notes: '' }).patch);
  assert.deepEqual(s.plan.sessions[0].prescriptions[0].target, { repsMin: 6 });
  assert.equal(validateState(s).ok, true);
});

test('histórico íntegro: reordenar, remover, renomear e excluir sessão não troca o exercício do log', () => {
  let { s, ss, e1, e2 } = base();
  const rx = s.plan.sessions[0].prescriptions.find((p) => p.exerciseId === e1);
  s = op.updatePrescription(s, rx.id, { sets: 3, repsMin: 8 });
  const rx1 = s.plan.sessions[0].prescriptions.find((p) => p.exerciseId === e1);
  s = op.addLog(s, { sessionId: ss, prescription: rx1, exerciseId: e1, sets: [{ reps: 8, load: 20 }] });
  const snap = JSON.stringify(s.logs[0].prescribed);
  s = ok(op.movePrescription(s, ss, rx1.id, 1)).state;
  s = ok(op.updateExercise(s, e1, { name: 'Renomeado', modality: 'musculacao', tracking: ['reps', 'load'] })).state;
  s = op.updatePrescription(s, rx1.id, { sets: 9 });
  assert.equal(s.logs[0].exerciseId, e1); assert.equal(JSON.stringify(s.logs[0].prescribed), snap);
  assert.equal(op.logsForExercise(s, e1).length, 1); assert.equal(op.logsForExercise(s, e2).length, 0);
  s = ok(op.removePrescription(s, ss, rx1.id)).state;
  assert.equal(op.exerciseUsage(s, e1).logs, 1);
  s = ok(op.deleteSession(s, ss)).state;
  assert.equal(s.logs.length, 1); assert.equal(s.logs[0].sessionId, null); assert.equal(s.logs[0].exerciseId, e1);
  assert.equal(s.exercises.some((e) => e.id === e1), true); assert.equal(validateState(s).ok, true);
});

test('persistência após recarregar e preservação de dados já salvos', () => {
  const b = new MemoryBackend(); b.setItem('toji-schema', '2');
  const demo = buildDemoState(); createStorage(b).save(demo);
  const antes = b.getItem(KEY_STATE);
  // "recarregar": novo adapter sobre o mesmo backend; carregar não grava nem altera
  const st = createStorage(b); const loaded = st.load();
  assert.equal(b.getItem(KEY_STATE), antes); assert.deepEqual(loaded.state, demo);
  // editar e recarregar
  const novo = ok(op.createExercise(loaded.state, EX));
  assert.equal(st.save(novo.state).ok, true);
  const again = createStorage(b).load().state;
  assert.equal(again.exercises.some((e) => e.id === novo.id), true);
  assert.equal(again.logs.length, demo.logs.length); assert.equal(again.plan.id, demo.plan.id);
  assert.equal(b.getItem('toji-schema'), '2');
  for (const k of b.m.keys()) if (k !== 'toji-schema') assert.ok(k.startsWith(NAMESPACE));
  assert.equal(NAMESPACE, 'yoshimura:v1:'); assert.equal(again.schema, 1);
});

test('limite de sessões e operações não mutam o estado anterior', () => {
  const { s } = base(); const before = JSON.stringify(s);
  op.createSession(s, { title: 'Z', weekday: 2 }); op.deleteSession(s, s.plan.sessions[0].id);
  op.movePrescription(s, s.plan.sessions[0].id, s.plan.sessions[0].prescriptions[0].id, 1);
  assert.equal(JSON.stringify(s), before);
});
