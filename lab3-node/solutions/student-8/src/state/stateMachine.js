'use strict';

// Возможные состояния бота
export const STATES = {
  IDLE: 'idle',
  AWAITING_TITLE: 'awaiting_title',
  AWAITING_CONTENT: 'awaiting_content'
};

// Хранилище состояний по userId
// Map: userId -> { state, title }
const userStates = new Map();

// Получить текущее состояние пользователя
export function getState(userId) {
  if (!userStates.has(userId)) {
    userStates.set(userId, {
      state: STATES.IDLE,
      title: null
    });
  }
  return userStates.get(userId);
}

// Установить новое состояние
export function setState(userId, state, title = null) {
  if (!userId) {
    throw new Error('userId обязателен');
  }
  if (!Object.values(STATES).includes(state)) {
    throw new Error(`Неизвестное состояние: ${state}`);
  }

  userStates.set(userId, {
    state: state,
    title: title
  });
}

// Сбросить состояние в idle
export function resetState(userId) {
  userStates.set(userId, {
    state: STATES.IDLE,
    title: null
  });
}

// Очистить все состояния (для тестов)
export function clearAllStates() {
  userStates.clear();
}