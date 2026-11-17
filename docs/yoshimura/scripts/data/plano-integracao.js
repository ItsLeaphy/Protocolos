// Plano de integração (v0.2): 5 sessões, 7 exercícios cada, séries × repetições. Fornecido por Dani em 17/11/2026.
// Decisão de privacidade (repositório público): só exercícios e prescrição. Sem nome da pessoa e sem observações de saúde.
import { SCHEMA_VERSION, makeExercise, makePrescription, makeSession } from '../domain/schema.js';

// [nome, modalidade, registro]
const EX = {
  flexInc: ['Flexão inclinada', 'calistenia', ['reps']],
  chestPress: ['Chest press na máquina, pegada confortável', 'musculacao', ['reps', 'load']],
  triceps: ['Tríceps na polia com corda', 'musculacao', ['reps', 'load']],
  roscaDireta: ['Rosca direta com halteres', 'musculacao', ['reps', 'load']],
  ponte: ['Ponte de glúteos', 'musculacao', ['reps', 'load']],
  deadBug: ['Dead bug', 'core', ['reps']],
  abdRev: ['Abdominal reverso', 'core', ['reps']],
  goblet: ['Agachamento goblet', 'musculacao', ['reps', 'load']],
  stiff: ['Stiff com halteres', 'musculacao', ['reps', 'load']],
  legPress: ['Leg press', 'musculacao', ['reps', 'load']],
  extensora: ['Cadeira extensora', 'musculacao', ['reps', 'load']],
  mesaFlexora: ['Mesa flexora', 'musculacao', ['reps', 'load']],
  panturrilhaPe: ['Panturrilha em pé', 'musculacao', ['reps', 'load']],
  hollow: ['Hollow body hold', 'core', ['time']],
  remadaInv: ['Remada invertida na barra do Smith', 'calistenia', ['reps']],
  remadaApoio: ['Remada com apoio no peito', 'musculacao', ['reps', 'load']],
  puxadaNeutra: ['Puxada neutra na polia', 'musculacao', ['reps', 'load']],
  roscaDiretaB: ['Rosca direta', 'musculacao', ['reps', 'load']],
  martelo: ['Rosca martelo', 'musculacao', ['reps', 'load']],
  flexPausa: ['Flexão inclinada com pausa', 'calistenia', ['reps']],
  supinoChao: ['Supino com halteres no chão, pegada neutra', 'musculacao', ['reps', 'load']],
  roscaCabo: ['Rosca no cabo', 'musculacao', ['reps', 'load']],
  stepUp: ['Step-up em plataforma baixa', 'musculacao', ['reps', 'load']],
  hipThrust: ['Hip thrust', 'musculacao', ['reps', 'load']],
  flexoraSentada: ['Cadeira flexora sentada', 'musculacao', ['reps', 'load']],
  panturrilhaSent: ['Panturrilha sentada', 'musculacao', ['reps', 'load']],
};
const R = (key, repsMin, repsMax, extra = {}) => [key, { sets: 2, repsMin, repsMax, ...extra }];
const T = (key, min, max) => [key, { sets: 2, notes: 'Alvo: ' + min + '–' + max + ' s por série.' }];
const L = (key, reps) => [key, { sets: 2, repsMin: reps, notes: reps + ' por lado.' }];

const SESSOES = [
  [1, 'Push A', [R('flexInc', 6, 10), R('chestPress', 8, 12), R('triceps', 10, 15), R('roscaDireta', 10, 15), R('ponte', 12, 15), L('deadBug', 8), R('abdRev', 10, 12)]],
  [2, 'Legs A', [R('goblet', 8, 10), R('stiff', 8, 10), R('legPress', 10, 12), R('extensora', 12, 15), R('mesaFlexora', 10, 15), R('panturrilhaPe', 12, 15), T('hollow', 15, 20)]],
  [3, 'Pull A', [R('remadaInv', 5, 8), R('remadaApoio', 8, 12), R('puxadaNeutra', 10, 12), R('roscaDiretaB', 10, 15), R('martelo', 10, 15), R('abdRev', 10, 12), T('hollow', 15, 20)]],
  [4, 'Push B', [R('flexPausa', 6, 8), R('supinoChao', 8, 12), R('triceps', 10, 15), R('roscaCabo', 10, 15), R('ponte', 12, 15), L('deadBug', 8), R('abdRev', 10, 12)]],
  [5, 'Legs B + Pull complementar', [L('stepUp', 8), R('legPress', 10, 12), R('hipThrust', 8, 12), R('flexoraSentada', 10, 15), R('panturrilhaSent', 12, 15), R('remadaApoio', 10, 12), R('martelo', 10, 15)]],
];

export function buildPlanoState() {
  const keys = Object.keys(EX);
  const exercises = keys.map((k, i) => makeExercise(EX[k][0], EX[k][1], EX[k][2], 'ex_plano' + String(i + 1).padStart(3, '0')));
  const idOf = Object.fromEntries(keys.map((k, i) => [k, exercises[i].id]));
  const sessions = SESSOES.map(([wd, title, items]) => makeSession(wd, title,
    items.map(([k, target], order) => makePrescription(idOf[k], order, target, 'rx_plano' + wd + String(order + 1).padStart(2, '0'))),
    'ss_plano' + wd));
  return { schema: SCHEMA_VERSION, demo: false, exercises, plan: { id: 'pl_plano0001', name: 'Plano de integração v0.2', sessions }, logs: [] };
}
