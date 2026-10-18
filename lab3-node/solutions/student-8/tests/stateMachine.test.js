import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  STATES,
  getState,
  setState,
  resetState,
  clearAllStates
} from '../src/state/stateMachine.js';

describe('stateMachine', () => {
  beforeEach(() => {
    clearAllStates();
  });

  describe('getState', () => {
    test('возвращает idle для нового пользователя', () => {
      const state = getState(100);

      expect(state.state).toBe(STATES.IDLE);
      expect(state.title).toBeNull();
    });

    test('создаёт запись при первом обращении', () => {
      getState(200);
      const second = getState(200);

      expect(second.state).toBe(STATES.IDLE);
    });
  });

  describe('setState', () => {
    test('устанавливает новое состояние', () => {
      setState(1, STATES.AWAITING_TITLE);

      expect(getState(1).state).toBe(STATES.AWAITING_TITLE);
    });

    test('сохраняет title вместе с состоянием', () => {
      setState(1, STATES.AWAITING_CONTENT, 'JavaScript');

      const state = getState(1);
      expect(state.state).toBe(STATES.AWAITING_CONTENT);
      expect(state.title).toBe('JavaScript');
    });

    test('бросает ошибку без userId', () => {
      expect(() => setState(null, STATES.IDLE)).toThrow();
      expect(() => setState(undefined, STATES.IDLE)).toThrow();
    });

    test('бросает ошибку с неизвестным состоянием', () => {
      expect(() => setState(1, 'unknown_state')).toThrow();
    });
  });

  describe('resetState', () => {
    test('сбрасывает в idle', () => {
      setState(1, STATES.AWAITING_TITLE);
      resetState(1);

      expect(getState(1).state).toBe(STATES.IDLE);
      expect(getState(1).title).toBeNull();
    });
  });

  describe('независимость состояний', () => {
    test('состояния разных пользователей не пересекаются', () => {
      setState(1, STATES.AWAITING_TITLE);
      setState(2, STATES.AWAITING_CONTENT, 'Python');

      expect(getState(1).state).toBe(STATES.AWAITING_TITLE);
      expect(getState(2).state).toBe(STATES.AWAITING_CONTENT);
      expect(getState(2).title).toBe('Python');
      expect(getState(1).title).toBeNull();
    });

    test('сброс одного пользователя не влияет на другого', () => {
      setState(1, STATES.AWAITING_TITLE);
      setState(2, STATES.AWAITING_TITLE);

      resetState(1);

      expect(getState(1).state).toBe(STATES.IDLE);
      expect(getState(2).state).toBe(STATES.AWAITING_TITLE);
    });
  });

  describe('clearAllStates', () => {
    test('очищает все состояния', () => {
      setState(1, STATES.AWAITING_TITLE);
      setState(2, STATES.AWAITING_CONTENT, 'Test');

      clearAllStates();

      expect(getState(1).state).toBe(STATES.IDLE);
      expect(getState(2).state).toBe(STATES.IDLE);
    });
  });
});