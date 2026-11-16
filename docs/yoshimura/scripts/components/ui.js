import { h } from './dom.js';
// Cabeça de página do Figma: eyebrow (Chakra Petch), título (Cormorant), subtítulo. size: 't40' | 't39' | undefined (43 px).
export const screenHead = (eyebrow, title, sub, size) => h('div', { class: 'page-head' },
  h('p', { class: 'eyebrow' }, eyebrow), h('h1', { class: 'page-title' + (size ? ' ' + size : '') }, title), sub ? h('p', { class: 'page-sub' }, sub) : null);
export const DAYS = [[1, 'SEG', 'Segunda'], [2, 'TER', 'Terça'], [3, 'QUA', 'Quarta'], [4, 'QUI', 'Quinta'], [5, 'SEX', 'Sexta']];
