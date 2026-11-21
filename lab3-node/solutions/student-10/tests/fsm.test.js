import { describe, test, expect } from '@jest/globals';
import { transition, reset } from '../src/fsm.js';

describe('fsm', () => {
  test('допустимый переход', () => {
    const user = { state: 'IDLE', draft: {} };
    transition(user, 'RECIPE_NAME');
    expect(user.state).toBe('RECIPE_NAME');
  });

  test('недопустимый переход выбрасывает ошибку', () => {
    const user = { state: 'IDLE', draft: {} };
    expect(() => transition(user, 'RECIPE_STEPS')).toThrow();
  });

  test('reset возвращает в IDLE', () => {
    const user = { state: 'PLAN_DAY', draft: { a: 1 } };
    reset(user);
    expect(user).toEqual({ state: 'IDLE', draft: {} });
  });
});