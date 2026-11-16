import { h } from './dom.js';
export const screenHead = (kicker, title, sub) => [
  h('p', { class: 'kicker' }, kicker), h('h2', { class: 'title' }, title), sub ? h('p', { class: 'sub' }, sub) : null,
];
export const DAYS = [[1, 'SEG', 'Segunda'], [2, 'TER', 'Terça'], [3, 'QUA', 'Quarta'], [4, 'QUI', 'Quinta'], [5, 'SEX', 'Sexta']];
