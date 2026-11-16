// Exportação/importação com validação ANTES de qualquer aplicação.
import { BACKUP_FORMAT, SCHEMA_VERSION } from '../domain/schema.js';
import { validateState } from '../domain/validators.js';

export const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

export function buildExport(state, now = new Date()) {
  return JSON.stringify({ format: BACKUP_FORMAT, schema: SCHEMA_VERSION, exportedAt: now.toISOString(), data: state }, null, 2);
}

export function parseImport(text) {
  if (typeof text !== 'string' || text.length > MAX_IMPORT_BYTES) return { ok: false, errors: ['Arquivo vazio ou maior que 2 MB.'] };
  let obj;
  try { obj = JSON.parse(text); } catch (e) { return { ok: false, errors: ['JSON inválido.'] }; }
  if (!obj || obj.format !== BACKUP_FORMAT) return { ok: false, errors: ['Arquivo não é um backup Yoshimura.'] };
  if (obj.schema !== SCHEMA_VERSION) return { ok: false, errors: ['Versão de esquema não suportada: ' + String(obj.schema)] };
  const v = validateState(obj.data);
  if (!v.ok) return { ok: false, errors: v.errors };
  const d = obj.data;
  return { ok: true, state: d, summary: { exercises: d.exercises.length, sessions: d.plan ? d.plan.sessions.length : 0, logs: d.logs.length, demo: d.demo } };
}

// Só chamar após confirmação explícita do usuário. Guarda cópia do estado atual antes de substituir.
export function applyImport(storage, currentState, parsed) {
  if (!parsed.ok) return { ok: false, error: 'Importação inválida.' };
  if (!storage.saveBackupBeforeImport(currentState)) return { ok: false, error: 'Não foi possível guardar cópia do estado atual; importação cancelada.' };
  const r = storage.save(parsed.state);
  return r.ok ? { ok: true } : { ok: false, error: r.error };
}
