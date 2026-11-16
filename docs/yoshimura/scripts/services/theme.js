// Tema claro (Risograph) / escuro (Afterhours). Preferência em yoshimura:v1:theme; sem ela, segue o sistema.
import { NAMESPACE } from './storage.js';
export const KEY_THEME = NAMESPACE + 'theme';
const mq = () => (window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : { matches: false });

export function currentTheme() {
  const t = document.documentElement.getAttribute('data-theme');
  return t === 'dark' || t === 'light' ? t : (mq().matches ? 'dark' : 'light');
}
export function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute('content', t === 'dark' ? '#080706' : '#F6F4EE');
}
export function toggleTheme() {
  const t = currentTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(t);
  try { localStorage.setItem(KEY_THEME, t); } catch (e) { /* tema vale só nesta sessão */ }
  return t;
}
export function initTheme() {
  let t = null;
  try { t = localStorage.getItem(KEY_THEME); } catch (e) { /* ignora */ }
  if (t === 'dark' || t === 'light') applyTheme(t); else applyTheme(currentTheme());
}
