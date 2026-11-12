// src/core/fsm.js
export const USER_STATES = {
  IDLE: 'IDLE',
  WAITING_TASK_NAME: 'WAITING_TASK_NAME',
  WAITING_MOVE_ID: 'WAITING_MOVE_ID',
  WAITING_MOVE_TARGET: 'WAITING_MOVE_TARGET'
};

export class FSM {
  constructor() {
    this.states = new Map();
  }

  setState(chatId, state) {
    this.states.set(chatId, state);
  }

  getState(chatId) {
    return this.states.get(chatId) || USER_STATES.IDLE;
  }

  clearState(chatId) {
    this.states.delete(chatId);
  }
}