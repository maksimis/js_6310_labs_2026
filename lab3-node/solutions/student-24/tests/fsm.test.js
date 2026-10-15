// tests/fsm.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { FSM, USER_STATES } from '../src/core/fsm.js';

describe('FSM', () => {
  let fsm;

  beforeEach(() => {
    fsm = new FSM();
  });

  it('должна возвращать IDLE для неизвестного пользователя', () => {
    expect(fsm.getState(123)).toBe(USER_STATES.IDLE);
  });

  it('должна устанавливать и получать состояние', () => {
    fsm.setState(123, USER_STATES.WAITING_TASK_NAME);
    expect(fsm.getState(123)).toBe(USER_STATES.WAITING_TASK_NAME);
  });

  it('должна очищать состояние', () => {
    fsm.setState(123, USER_STATES.WAITING_TASK_NAME);
    fsm.clearState(123);
    expect(fsm.getState(123)).toBe(USER_STATES.IDLE);
  });

  it('должна хранить состояния разных пользователей независимо', () => {
    fsm.setState(1, USER_STATES.WAITING_TASK_NAME);
    fsm.setState(2, USER_STATES.WAITING_MOVE_ID);
    expect(fsm.getState(1)).toBe(USER_STATES.WAITING_TASK_NAME);
    expect(fsm.getState(2)).toBe(USER_STATES.WAITING_MOVE_ID);
  });
});