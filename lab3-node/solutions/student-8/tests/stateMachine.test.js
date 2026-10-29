import { describe, test, expect, beforeEach } from '@jest/globals';
import { STATES, getState, setState, resetState, clearAllStates } from '../src/state/stateMachine.js';

describe('stateMachine', () => {
  beforeEach(() => clearAllStates());

  test('возвращает idle для нового пользователя', () => {
    expect(getState(1).state).toBe(STATES.IDLE);
  });

  test('устанавливает новое состояние', () => {
    setState(1, STATES.AWAITING_WORD);
    expect(getState(1).state).toBe(STATES.AWAITING_WORD);
  });

  test('сбрасывает состояние', () => {
    setState(1, STATES.AWAITING_WORD);
    resetState(1);
    expect(getState(1).state).toBe(STATES.IDLE);
  });
});