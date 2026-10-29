import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import handleMessage from '../src/handlers/messageHandler.js';
import { clearCards, addCard, getProgress } from '../src/cards/cardManager.js';
import { clearAllStates } from '../src/state/stateMachine.js';

const mockReply = jest.fn(async () => {});

describe('messageHandler', () => {
  beforeEach(() => {
    clearCards();
    clearAllStates();
    mockReply.mockClear();
  });

  test('отвечает на /help', async () => {
    await handleMessage(1, '/help', mockReply);
    expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('Доступные команды'));
  });

  test('добавляет слово через /progress', async () => {
    await handleMessage(1, '/progress', mockReply); // просит слово
    await handleMessage(1, 'apple', mockReply); // вводим слово
    await handleMessage(1, 'яблоко', mockReply); // вводим перевод
    
    const stats = getProgress();
    expect(stats.total).toBe(1);
  });

  test('/learn показывает карточку', async () => {
    addCard('apple', 'яблоко');
    await handleMessage(1, '/learn', mockReply);
    expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('Слово: apple'));
  });

    test('/repeat без карточек', async () => {
    await handleMessage(1, '/repeat', mockReply);
    expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('нет слов для повторения'));
  });

  test('/learn без карточек', async () => {
    await handleMessage(1, '/learn', mockReply);
    expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('Нет карточек'));
  });

  test('неизвестная команда', async () => {
    await handleMessage(1, 'привет', mockReply);
    expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('Неизвестная команда'));
  });

  test('отмена действия', async () => {
    await handleMessage(1, '/progress', mockReply); // ждем слово
    await handleMessage(1, '/cancel', mockReply);  // отменяем
    expect(mockReply).toHaveBeenCalledWith('Отменено.');
  });
});