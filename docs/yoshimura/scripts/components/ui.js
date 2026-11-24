import { h } from './dom.js';
// Cabeça de página do Figma: eyebrow (Chakra Petch), título (Cormorant), subtítulo. size: 't40' | 't39' | undefined (43 px).
export const screenHead = (eyebrow, title, sub, size) => h('div', { class: 'page-head' },
  h('p', { class: 'eyebrow' }, eyebrow), h('h1', { class: 'page-title' + (size ? ' ' + size : '') }, title), sub ? h('p', { class: 'page-sub' }, sub) : null);
export const DAYS = [[1, 'SEG', 'Segunda'], [2, 'TER', 'Terça'], [3, 'QUA', 'Quarta'], [4, 'QUI', 'Quinta'], [5, 'SEX', 'Sexta']];

export const pad = (n) => String(n).padStart(2, '0');
export const FIELD_LABEL = { reps: 'Reps', load: 'Carga (kg)', time: 'Tempo (s)', distance: 'Distância (m)', assist: 'Assistência (kg)' };
export function targetText(t) {
  const p = [];
  if (t.sets != null) p.push(t.sets + ' séries');
  if (t.repsMin != null || t.repsMax != null) { const lo = t.repsMin, hi = t.repsMax; p.push((lo != null && hi != null && lo !== hi ? lo + '–' + hi : String(lo ?? hi)) + ' reps'); }
  if (t.time != null) p.push(t.time + ' s');
  if (t.distance != null) p.push(t.distance + ' m');
  if (t.load != null) p.push(t.load + ' kg');
  if (t.assist != null) p.push('assistência ' + t.assist + ' kg');
  return p.join(' · ') || 'sem alvo definido';
}
