import { h } from '../components/dom.js';
import { screenHead } from '../components/ui.js';
// "Trilhas" e "Mob." existem na tab bar do Figma; só "Trilhas" tem copy definida. "Mob." não tem frame: placeholder neutro.
export const renderTrilhas = () => h('section', {}, screenHead('Habilidades · 03', 'Trilhas.', 'Progressões por habilidade.'),
  h('p', { class: 'empty' }, 'As etapas aparecerão aqui quando forem definidas.'));
export const renderMob = () => h('section', {}, screenHead('Mobilidade · 04', 'Mobilidade.', null),
  h('p', { class: 'empty' }, 'Em construção. Esta tela ainda não tem desenho no Figma.'));
