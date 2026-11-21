import { describe, test, expect, beforeEach } from '@jest/globals';
import { getUser, clearStore } from '../src/store.js';

describe('store', () => {
  beforeEach(() => clearStore());

  test('создаёт пользователя со стартовыми рецептами', () => {
    expect(getUser(1).recipes.length).toBeGreaterThan(0);
  });

  test('состояния пользователей не пересекаются', () => {
    getUser(1).recipes.push({ name: 'X', ingredients: [], steps: [] });
    expect(getUser(2).recipes.find((r) => r.name === 'X')).toBeUndefined();
  });
});