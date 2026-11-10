import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import handleMessage from '../src/handlers/messageHandler.js';
import { clearCards, addCard, getProgress } from '../src/cards/cardManager.js';
import { clearAllStates } from '../src/state/stateMachine.js';

const mockReply = jest.fn(async () => {});
const testUserId = 1;

describe('messageHandler', () => {
  beforeEach(() => {
    clearCards(testUserId); // Очищаем карточки только для этого тестового пользователя
    clearAllStates();
    mockReply.mockClear();
  });

  test('отвечает на /help', async () => {
    await handleMessage(testUserId, '/help', mockReply);
    expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('Доступные команды'));
  });

  test('добавляет слово через /progress', async () => {
    await handleMessage(testUserId, '/progress', mockReply); // просит слово
    await handleMessage(testUserId, 'apple', mockReply); // вводим слово
    await handleMessage(testUserId, 'яблоко', mockReply); // вводим перевод
    
    const stats = getProgress(testUserId);
    expect(stats.total).toBe(1);
  });

  test('/learn показывает карточку', async () => {
    addCard(testUserId, 'apple', 'яблоко');
    await handleMessage(testUserId, '/learn', mockReply);
    expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('Слово: apple'));
  });

  test('/repeat без карточек', async () => {
    // База пуста
    await handleMessage(testUserId, '/repeat', mockReply);
    expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('нет слов для повторения'));
  });

  test('/learn без карточек', async () => {
    // База пуста
    await handleMessage(testUserId, '/learn', mockReply);
    expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('Нет карточек'));
  });

  test('неизвестная команда', async () => {
    await handleMessage(testUserId, 'привет', mockReply);
    expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('Неизвестная команда'));
  });

  test('отмена действия', async () => {
    await handleMessage(testUserId, '/progress', mockReply); // ждем слово
    await handleMessage(testUserId, '/cancel', mockReply);  // отменяем
    expect(mockReply).toHaveBeenCalledWith('Отменено.');
  });
});