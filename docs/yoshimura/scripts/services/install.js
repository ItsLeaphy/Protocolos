// Instalação no celular. Android/Chrome: usa o evento beforeinstallprompt. iPhone: só instrução manual.
let deferred = null;
const listeners = new Set();
const notify = () => listeners.forEach((f) => f());

export const isStandalone = () =>
  (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
export const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
export const canPrompt = () => !!deferred;
export const onInstallChange = (f) => { listeners.add(f); return () => listeners.delete(f); };

export function initInstall() {
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; notify(); });
  window.addEventListener('appinstalled', () => { deferred = null; notify(); });
  if ('serviceWorker' in navigator) {
    // Arquivo real (nunca Blob). Falha silenciosa: sem SW o app funciona online normalmente.
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
}

export async function promptInstall() {
  if (!deferred) return 'unavailable';
  deferred.prompt();
  const { outcome } = await deferred.userChoice;
  deferred = null; notify();
  return outcome;
}
