// Operações puras de domínio: retornam NOVO estado, nunca mutam o anterior.
import { makeLog } from './schema.js';

export function updatePrescription(state, prescriptionId, patch) {
  if (!state.plan) return state;
  const plan = {
    ...state.plan,
    sessions: state.plan.sessions.map((ss) => ({
      ...ss,
      prescriptions: ss.prescriptions.map((p) => p.id !== prescriptionId ? p : { ...p, target: { ...p.target, ...patch } }),
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
