// Rodar: node --test docs/yoshimura/tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDemoState } from '../scripts/data/demo-data.js';
import { validateState, isRealDate } from '../scripts/domain/validators.js';
import { updatePrescription, addLog } from '../scripts/domain/operations.js';
import { localDate, emptyState } from '../scripts/domain/schema.js';
import { createStorage, MemoryBackend, KEY_STATE, NAMESPACE } from '../scripts/services/storage.js';
import { buildExport, parseImport, applyImport } from '../scripts/services/export-import.js';

test('estado demo e vazio são válidos', () => {
  assert.equal(validateState(buildDemoState()).ok, true);
  assert.equal(validateState(emptyState()).ok, true);
});

test('prescrição editada não altera logs existentes', () => {
  let s = buildDemoState();
  const ss = s.plan.sessions[0], rx = ss.prescriptions[0];
  s = addLog(s, { date: '2026-11-16', sessionId: ss.id, prescription: rx, exerciseId: rx.exerciseId, sets: [{ reps: 6 }] });
  const before = JSON.stringify(s.logs);
  const s2 = updatePrescription(s, rx.id, { sets: 9, repsMin: 1 });
  assert.equal(JSON.stringify(s2.logs), before);
  assert.equal(s2.logs[0].prescribed.target.sets, 3);
  assert.equal(s2.plan.sessions[0].prescriptions[0].target.sets, 9);
  assert.equal(s.plan.sessions[0].prescriptions[0].target.sets, 3, 'estado anterior imutável');
});

test('IDs não dependem da posição: reordenar mantém ligação do log', () => {
  let s = buildDemoState();
  const ss = s.plan.sessions[0], rx = ss.prescriptions[0];
  s = addLog(s, { sessionId: ss.id, prescription: rx, exerciseId: rx.exerciseId, sets: [{ reps: 5 }] });
  s.plan.sessions[0].prescriptions.reverse();
  assert.equal(validateState(s).ok, true);
  assert.equal(s.logs[0].exerciseId, rx.exerciseId);
});

test('data local, sem deslocamento UTC', () => {
  assert.equal(localDate(new Date(2026, 10, 16, 23, 59)), '2026-11-16');
  assert.equal(localDate(new Date(2026, 0, 1, 0, 0)), '2026-01-01');
  assert.equal(isRealDate('2026-02-30'), false);
  assert.equal(isRealDate('2026-11-16'), true);
});

test('validação rejeita dados malformados', () => {
  const bad = (mut) => { const s = buildDemoState(); mut(s); return validateState(s).ok; };
  assert.equal(bad((s) => { s.schema = 2; }), false);
  assert.equal(bad((s) => { s.extra = 1; }), false);
  assert.equal(bad((s) => { s.plan.sessions[0].weekday = 6; }), false);
  assert.equal(bad((s) => { s.plan.sessions[0].prescriptions[0].exerciseId = 'ex_naoexiste'; }), false);
  assert.equal(bad((s) => { s.exercises[1].id = s.exercises[0].id; }), false);
  assert.equal(bad((s) => { s.plan.sessions[0].prescriptions[0].target.sets = -1; }), false);
  assert.equal(bad((s) => { s.plan.sessions[0].prescriptions[0].target.bogus = 1; }), false);
  assert.equal(bad((s) => { s.logs.push({ id: 'lg_abcd1', date: '16/11/2026', sessionId: null, exerciseId: s.exercises[0].id, prescribed: null, sets: [], notes: '' }); }), false);
  assert.equal(bad((s) => { s.logs.push({ id: 'lg_abcd2', date: '2026-11-16', sessionId: null, exerciseId: s.exercises[0].id, prescribed: null, sets: [{ reps: 'x' }], notes: '' }); }), false);
});

test('storage: persiste, usa só o namespace e recusa chaves fora dele', () => {
  const b = new MemoryBackend(); b.setItem('historico-seg-1', 'LEGADO'); b.setItem('toji-schema', '2');
  const st = createStorage(b);
  assert.equal(st.save(buildDemoState()).ok, true);
  assert.equal(st.load().state.demo, true);
  assert.equal(b.getItem('historico-seg-1'), 'LEGADO'); assert.equal(b.getItem('toji-schema'), '2');
  for (const k of b.m.keys()) if (k !== 'historico-seg-1' && k !== 'toji-schema') assert.ok(k.startsWith(NAMESPACE));
  st.clear();
  assert.equal(b.getItem(KEY_STATE), null); assert.equal(b.getItem('toji-schema'), '2', 'clear não toca chaves legadas');
});

test('storage: dado corrompido não é sobrescrito nem aceito', () => {
  const b = new MemoryBackend(); b.setItem(KEY_STATE, '{"schema":1,"x":');
  const r = createStorage(b).load();
  assert.ok(r.error); assert.equal(r.state.plan, null); assert.equal(b.getItem(KEY_STATE), '{"schema":1,"x":');
});

test('exportar/importar: roundtrip, rejeição e backup antes de substituir', () => {
  const s = buildDemoState();
  const p = parseImport(buildExport(s));
  assert.equal(p.ok, true); assert.deepEqual(p.state, s);
  assert.equal(parseImport('nope').ok, false);
  assert.equal(parseImport(JSON.stringify({ format: 'outro', data: s })).ok, false);
  assert.equal(parseImport(JSON.stringify({ format: 'yoshimura-backup', schema: 1, data: { ...s, schema: 9 } })).ok, false);
  const b = new MemoryBackend(); const st = createStorage(b);
  const atual = { ...emptyState(), demo: true }; st.save(atual);
  assert.equal(applyImport(st, atual, p).ok, true);
  assert.equal(JSON.parse(b.getItem(NAMESPACE + 'backup-before-import')).demo, true);
  assert.equal(st.load().state.plan.name, s.plan.name);
});
