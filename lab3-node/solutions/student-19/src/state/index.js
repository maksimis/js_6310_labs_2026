import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

export const STATES = Object.freeze({
  IDLE: 'IDLE',
  WAITING_FOR_PROVIDER: 'WAITING_FOR_PROVIDER',
  WAITING_FOR_MODEL: 'WAITING_FOR_MODEL',
  WAITING_FOR_MESSAGE: 'WAITING_FOR_MESSAGE'
});

export class FSM {
  constructor() {
    this.states = new Map();
  }

  getState(userId) {
    return this.states.get(String(userId)) || { state: STATES.IDLE, data: {} };
  }

  setState(userId, state, data = {}) {
    this.states.set(String(userId), { state, data });
  }

  reset(userId) {
    this.states.delete(String(userId));
  }

  clear() {
    this.states.clear();
  }
}

export class PersistentFSM extends FSM {
  constructor(filePath) {
    super();
    this.filePath = filePath;
    this._load();
  }

  _load() {
    try {
      const raw = readFileSync(this.filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        for (const [key, value] of Object.entries(parsed)) {
          this.states.set(key, value);
        }
      }
    } catch {
      this.states = new Map();
    }
  }

  _save() {
    const dir = dirname(this.filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    const obj = Object.fromEntries(this.states);
    writeFileSync(this.filePath, JSON.stringify(obj, null, 2));
  }

  setState(userId, state, data = {}) {
    super.setState(userId, state, data);
    this._save();
  }

  reset(userId) {
    super.reset(userId);
    this._save();
  }

  clear() {
    super.clear();
    this._save();
  }
}