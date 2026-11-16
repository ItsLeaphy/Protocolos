// DADOS SINTÉTICOS DE DEMONSTRAÇÃO. Não representam treino real de ninguém.
import { SCHEMA_VERSION, makeExercise, makePrescription, makeSession } from '../domain/schema.js';

export function buildDemoState() {
  const ex = [
    makeExercise('Exercício demo A (repetições)', 'calistenia', ['reps']),
    makeExercise('Exercício demo B (carga)', 'musculacao', ['reps', 'load']),
    makeExercise('Exercício demo C (tempo)', 'core', ['time']),
    makeExercise('Exercício demo D (distância)', 'condicionamento', ['distance', 'time']),
  ];
  const [a, b, c, d] = ex;
  const sessions = [1, 2, 3, 4, 5].map((wd) => makeSession(wd, 'Sessão demo ' + wd, [
    makePrescription(a.id, 0, { sets: 3, repsMin: 5, repsMax: 8, notes: 'Valores sintéticos de demonstração.' }),
    makePrescription(b.id, 1, { sets: 3, repsMin: 8, repsMax: 12 }),
    makePrescription(wd % 2 ? c.id : d.id, 2, wd % 2 ? { sets: 2, time: 30 } : { sets: 1, distance: 400 }),
  ]));
  return { schema: SCHEMA_VERSION, demo: true, exercises: ex, plan: { id: 'pl_demo0001', name: 'Plano de demonstração (sintético)', sessions }, logs: [] };
}
