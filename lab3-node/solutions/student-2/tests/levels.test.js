import { describe, test, expect } from '@jest/globals';
import { getLevelsList, getLevelHint, getCurrentLevel } from '../src/breakout/levels.js';

describe('Levels module', () => {
  test('returns formatted level list with progress', () => {
    const list = getLevelsList({ 1: true, 2: false });
    expect(list).toContain('✅ Пройден');
    expect(list).toContain('⏳ Не пройден');
  });

  test('returns correct hint for existing level', () => {
    const hint = getLevelHint(1);
    expect(hint).toContain('Уровень 1');
    expect(hint).toContain('Расположение блоков');
  });

  test('returns fallback for unknown level', () => {
    const hint = getLevelHint(99);
    expect(hint).toContain('Уровень не найден');
  });

  test('returns first uncompleted level as current level', () => {
    expect(getCurrentLevel({ 1: true, 2: false, 3: false })).toBe(2);
    expect(getCurrentLevel({ 1: false, 2: false, 3: false })).toBe(1);
    expect(getCurrentLevel({ 1: true, 2: true, 3: true })).toBe(3);
  });
});