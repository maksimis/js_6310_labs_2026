'use strict';

export const STATES = {
  IDLE: 'idle',
  AWAITING_WORD: 'awaiting_word',
  AWAITING_TRANSLATION: 'awaiting_translation',
  LEARNING: 'learning'
};

const userStates = new Map();

export function getState(userId) {
  if (!userStates.has(userId)) {
    userStates.set(userId, { state: STATES.IDLE, data: {} });
  }
  return userStates.get(userId);
}

export function setState(userId, state, data = {}) {
  if (!userId) throw new Error('userId обязателен');
  userStates.set(userId, { state, data });
}

export function resetState(userId) {
  userStates.set(userId, { state: STATES.IDLE, data: {} });
}

export function clearAllStates() {
  userStates.clear();
}