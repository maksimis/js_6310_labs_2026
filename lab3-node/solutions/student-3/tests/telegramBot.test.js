import { createTelegramBot } from '../src/bots/telegramBot.js';

describe('TelegramBot Initialization Tests', () => {
  test('Выбрасывает ошибку при отсутствии токена', () => {
    expect(() => createTelegramBot('')).toThrow('TELEGRAM_BOT_TOKEN is required');
  });

  test('Успешно создает экземпляр бота без запуска сетевого polling', () => {
    const { bot, stateManager } = createTelegramBot('test-token-123', { polling: false });
    expect(bot).toBeDefined();
    expect(stateManager).toBeDefined();
  });
});