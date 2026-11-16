// Estado em memória + assinatura. Persiste via adapter injetado.
import { emptyState } from './domain/schema.js';

export function createApp(storage) {
  const loaded = storage.load();
  const app = {
    state: loaded.state,
    loadError: loaded.error,
    notice: null,
    listeners: new Set(),
    subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
    set(next, notice = null) {
      const r = storage.save(next);
      if (!r.ok) { this.notice = { kind: 'error', text: r.error }; this.emit(); return false; }
      this.state = next; this.notice = notice; this.emit(); return true;
    },
    reset() { storage.clear(); this.state = emptyState(); this.notice = { kind: 'ok', text: 'Dados locais apagados.' }; this.emit(); },
    emit() { this.listeners.forEach((f) => f()); },
    storage,
  };
  return app;
}
