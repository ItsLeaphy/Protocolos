// Domínio: constantes e fábricas. Sem DOM, sem storage.
export const SCHEMA_VERSION = 1;
export const BACKUP_FORMAT = 'yoshimura-backup';
export const MODALITIES = ['musculacao', 'calistenia', 'core', 'mobilidade', 'flexibilidade', 'condicionamento', 'outro'];
export const WEEKDAYS = { 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta' };
export const LIMITS = { exercises: 300, sessions: 14, prescriptions: 60, logs: 5000, sets: 60, text: 200, notes: 1000 };

export function newId(prefix) {
  const raw = (globalThis.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
  return prefix + '_' + raw.replace(/[^A-Za-z0-9-]/g, '').slice(0, 24);
}

// Data LOCAL (YYYY-MM-DD). Nunca usar toISOString() para datas de registro (desloca para UTC).
export function localDate(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

export function emptyState() {
  return { schema: SCHEMA_VERSION, demo: false, exercises: [], plan: null, logs: [] };
}

export const makeExercise = (name, modality, tracking = ['reps'], id = newId('ex')) =>
  ({ id, name, modality, tracking });

// Prescrição: campos de alvo todos opcionais (depende do tipo de exercício).
export const makePrescription = (exerciseId, order, target = {}, id = newId('rx')) =>
  ({ id, exerciseId, order, target: { ...target } });

export const makeSession = (weekday, title, prescriptions = [], id = newId('ss')) =>
  ({ id, weekday, title, prescriptions });

// Log de execução. `prescribed` é um SNAPSHOT: editar a prescrição depois não altera o log.
export function makeLog({ date = localDate(), sessionId, prescription, exerciseId, sets, notes = '' }) {
  return {
    id: newId('lg'), date, sessionId, exerciseId,
    prescribed: prescription ? { ...prescription, target: { ...prescription.target } } : null,
    sets: sets.map((s) => ({ ...s })), notes,
  };
}
