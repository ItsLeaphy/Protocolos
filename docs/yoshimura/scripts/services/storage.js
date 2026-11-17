// Persistência: interface única (load/save/clear). A UI nunca toca localStorage diretamente.
// ATENÇÃO: localStorage NÃO é autenticação, criptografia, backup nem sincronização.
import { validateState } from '../domain/validators.js';
import { emptyState } from '../domain/schema.js';
import { buildPlanoState } from '../data/plano-integracao.js';

export const NAMESPACE = 'yoshimura:v1:';
export const KEY_STATE = NAMESPACE + 'state';
export const KEY_BACKUP = NAMESPACE + 'backup-before-import';

function guard(key) {
  if (!key.startsWith(NAMESPACE)) throw new Error('Chave fora do namespace yoshimura:v1: — operação recusada: ' + key);
  return key;
}

export class MemoryBackend {
  constructor() { this.m = new Map(); }
  getItem(k) { return this.m.has(k) ? this.m.get(k) : null; }
  setItem(k, v) { this.m.set(k, String(v)); }
  removeItem(k) { this.m.delete(k); }
}

export function createStorage(backend) {
  return {
    load() {
      let raw;
      try { raw = backend.getItem(guard(KEY_STATE)); } catch (e) { return { state: emptyState(), error: 'Armazenamento indisponível neste navegador.' }; }
      if (raw === null) return { state: buildPlanoState(), error: null }; // primeira abertura: já traz o plano; só é gravado ao primeiro registro
      try {
        const parsed = JSON.parse(raw);
        const v = validateState(parsed);
        if (!v.ok) return { state: emptyState(), error: 'Dados salvos inválidos; nada foi sobrescrito. ' + v.errors[0], corruptRaw: raw };
        return { state: parsed, error: null };
      } catch (e) { return { state: emptyState(), error: 'Dados salvos ilegíveis; nada foi sobrescrito.', corruptRaw: raw }; }
    },
    save(state) {
      const v = validateState(state);
      if (!v.ok) return { ok: false, error: 'Estado inválido: ' + v.errors[0] };
      try { backend.setItem(guard(KEY_STATE), JSON.stringify(state)); return { ok: true }; }
      catch (e) { return { ok: false, error: 'Falha ao salvar (armazenamento cheio ou bloqueado).' }; }
    },
    saveBackupBeforeImport(state) {
      try { backend.setItem(guard(KEY_BACKUP), JSON.stringify(state)); return true; } catch (e) { return false; }
    },
    clear() {
      try { backend.removeItem(guard(KEY_STATE)); return true; } catch (e) { return false; }
    },
  };
}

export const browserStorage = () => createStorage(window.localStorage);
