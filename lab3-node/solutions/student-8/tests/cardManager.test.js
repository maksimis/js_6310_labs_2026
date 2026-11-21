import { describe, test, expect, beforeEach } from '@jest/globals';
import { 
  addCard, 
  getProgress, 
  updateCardLevel, 
  clearCards, 
  LEVELS, 
  getAllCards, 
  getCardById, 
  getCardsForReview 
} from '../src/cards/cardManager.js';

describe('cardManager', () => {
  const testUserId = 1;

  beforeEach(() => {
    clearCards(testUserId);
  });

  test('addCard добавляет слово', () => {
    const card = addCard(testUserId, 'apple', 'яблоко');
    expect(card.word).toBe('apple');
    expect(card.level).toBe(LEVELS.NEW);
  });

  test('getProgress считает статистику', () => {
    addCard(testUserId, 'apple', 'яблоко');
    const c2 = addCard(testUserId, 'dog', 'собака');
    
    // Используем c2.id вместо жестко заданной 1
    updateCardLevel(testUserId, c2.id, LEVELS.LEARNED);
    
    const stats = getProgress(testUserId);
    expect(stats.total).toBe(2);
    expect(stats.learned).toBe(1);
  });

  test('ошибка при пустом слове', () => {
    expect(() => addCard(testUserId, '', 'test')).toThrow();
  });

  test('getAllCards возвращает все карточки', () => {
    addCard(testUserId, 'apple', 'яблоко');
    addCard(testUserId, 'dog', 'собака');
    expect(getAllCards(testUserId).length).toBe(2);
  });

  test('getCardById находит карточку', () => {
    const card = addCard(testUserId, 'cat', 'кот');
    // Ищем по реальному ID, который вернул addCard
    expect(getCardById(testUserId, card.id).word).toBe('cat');
  });

  test('getCardsForReview сортирует по уровню', () => {
    const c1 = addCard(testUserId, 'apple', 'яблоко');
    const c2 = addCard(testUserId, 'dog', 'собака');
    
    updateCardLevel(testUserId, c1.id, LEVELS.LEARNED);
    updateCardLevel(testUserId, c2.id, LEVELS.HARD);
    
    // Принудительно сдвигаем время, чтобы они попали в повторение
    c1.nextReview = Date.now() - 1000;
    c2.nextReview = Date.now() - 1000;
    
    const review = getCardsForReview(testUserId);
    expect(review[0].word).toBe('dog'); 
  });
});