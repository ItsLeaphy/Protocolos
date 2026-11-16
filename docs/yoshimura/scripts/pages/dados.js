import { h } from '../components/dom.js';
import { buildDemoState } from '../data/demo-data.js';
import { buildExport, parseImport, applyImport } from '../services/export-import.js';
import { localDate } from '../domain/schema.js';

export function renderDados(app) {
  const msg = h('p', { class: 'msg', role: 'status' });
  const say = (t, kind = 'ok') => { msg.textContent = t; msg.className = 'msg ' + kind; };
  const importOut = h('div', {});
  const file = h('input', { id: 'imp', type: 'file', accept: 'application/json,.json' });
  file.addEventListener('change', async () => {
    importOut.replaceChildren();
    const f = file.files[0]; if (!f) return;
    if (f.size > 2 * 1024 * 1024) { say('Arquivo maior que 2 MB.', 'error'); return; }
    const parsed = parseImport(await f.text());
    if (!parsed.ok) { importOut.append(h('p', { class: 'msg error' }, 'Importação recusada: ' + parsed.errors.slice(0, 5).join(' / '))); return; }
    const sm = parsed.summary;
    importOut.append(h('p', {}, 'Arquivo válido: ' + sm.exercises + ' exercícios, ' + sm.sessions + ' sessões, ' + sm.logs + ' registros' + (sm.demo ? ' (demonstração)' : '') + '. Isto SUBSTITUI os dados deste navegador (uma cópia do estado atual é guardada antes).'),
      h('button', { class: 'btn', type: 'button', onclick: () => {
        const r = applyImport(app.storage, app.state, parsed);
        if (r.ok) app.set(parsed.state, { kind: 'ok', text: 'Importação concluída.' }); else say(r.error, 'error');
      } }, 'Confirmar substituição'),
      h('button', { class: 'btn ghost', type: 'button', onclick: () => { importOut.replaceChildren(); file.value = ''; } }, 'Cancelar'));
  });
  return h('section', {},
    h('h2', {}, 'Dados'),
    h('p', { class: 'warn' }, 'Os dados deste app ficam apenas neste navegador e dispositivo. Não há login, backup automático nem sincronização, e o armazenamento local não é privado nem criptografado. Use somente dados de demonstração.'),
    h('div', { class: 'card' }, h('h3', {}, 'Demonstração'),
      h('button', { class: 'btn', type: 'button', onclick: () => {
        if (app.state.plan || app.state.logs.length) { if (!confirm('Isso substitui os dados atuais deste navegador. Continuar?')) return; app.storage.saveBackupBeforeImport(app.state); }
        app.set(buildDemoState(), { kind: 'ok', text: 'Dados de demonstração carregados.' });
      } }, 'Carregar dados de demonstração')),
    h('div', { class: 'card' }, h('h3', {}, 'Exportar'),
      h('button', { class: 'btn', type: 'button', onclick: () => {
        const a = h('a', { href: URL.createObjectURL(new Blob([buildExport(app.state)], { type: 'application/json' })), download: 'yoshimura-backup-' + localDate() + '.json' });
        document.body.append(a); a.click(); a.remove(); say('Backup exportado.');
      } }, 'Baixar backup (JSON)')),
    h('div', { class: 'card' }, h('h3', {}, 'Importar'), h('label', { for: 'imp' }, 'Arquivo de backup'), file, importOut),
    h('div', { class: 'card' }, h('h3', {}, 'Apagar'),
      h('button', { class: 'btn danger', type: 'button', onclick: () => { if (confirm('Apagar todos os dados Yoshimura deste navegador?')) app.reset(); } }, 'Apagar dados locais')),
    msg);
}
