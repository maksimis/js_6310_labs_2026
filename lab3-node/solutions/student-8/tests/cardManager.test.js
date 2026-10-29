import { describe, test, expect, beforeEach } from '@jest/globals';
import { addCard, getProgress, updateCardLevel, clearCards, LEVELS } from '../src/cards/cardManager.js';

describe('cardManager', () => {
  beforeEach(() => clearCards());

  test('addCard добавляет слово', () => {
    const card = addCard('apple', 'яблоко');
    expect(card.word).toBe('apple');
    expect(card.level).toBe(LEVELS.NEW);
  });

  test('getProgress считает статистику', () => {
    addCard('apple', 'яблоко');
    addCard('dog', 'собака');
    updateCardLevel(1, LEVELS.LEARNED);
    const stats = getProgress();
    expect(stats.total).toBe(2);
    expect(stats.learned).toBe(1);
  });

  test('ошибка при пустом слове', () => {
    expect(() => addCard('', 'test')).toThrow();
  });
});