import { describe, test, expect, beforeEach } from '@jest/globals';
import { addCard, getProgress, updateCardLevel, clearCards, LEVELS, getAllCards, getCardById, getCardsForReview } from '../src/cards/cardManager.js';

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

  test('getAllCards возвращает все карточки', () => {
    addCard('apple', 'яблоко');
    addCard('dog', 'собака');
    expect(getAllCards().length).toBe(2);
  });

  test('getCardById находит карточку', () => {
    addCard('cat', 'кот');
    expect(getCardById(1).word).toBe('cat');
  });

  test('getCardsForReview сортирует по уровню', () => {
    const c1 = addCard('apple', 'яблоко');
    const c2 = addCard('dog', 'собака');
    updateCardLevel(c1.id, LEVELS.LEARNED);
    updateCardLevel(c2.id, LEVELS.HARD);
    c1.nextReview = Date.now() - 1000;
    c2.nextReview = Date.now() - 1000;
    const review = getCardsForReview();
    expect(review[0].word).toBe('dog'); 
  });
});