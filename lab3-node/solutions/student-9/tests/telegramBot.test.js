import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

// Изоляция тестов от рабочей базы данных
process.env.TEST_DB_FILE = path.join(process.cwd(), 'habits.bot.test.json');

// Мокаем модуль telegraf ДО импорта тестируемого файла
const mockTelegrafInstance = {
  catch: jest.fn(),
  on: jest.fn(),
  // ИСПРАВЛЕНО: явное возвращение Promise, чтобы .catch() всегда существовал
  launch: jest.fn(() => Promise.resolve()),
  stop: jest.fn(),
};

jest.unstable_mockModule('telegraf', () => ({
  Telegraf: jest.fn().mockImplementation(() => mockTelegrafInstance),
}));

describe('Telegram Bot Module', () => {
  let originalEnv;
  let originalProcessOnce;

  beforeEach(() => {
    originalEnv = process.env.TELEGRAM_BOT_TOKEN;
    originalProcessOnce = process.once;
    process.once = jest.fn();
    jest.clearAllMocks();
    
    // ИСПРАВЛЕНО: восстанавливаем возвращение Promise после clearAllMocks
    mockTelegrafInstance.launch.mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    process.env.TELEGRAM_BOT_TOKEN = originalEnv;
    process.once = originalProcessOnce;
    
    // Удаляем тестовый файл базы данных, если он был создан
    if (fs.existsSync(process.env.TEST_DB_FILE)) {
      fs.unlinkSync(process.env.TEST_DB_FILE);
    }
    
    jest.resetModules();
  });

  it('should skip bot creation when token is missing', async () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    const { default: runTelegramBot } = await import('../src/bots/telegramBot.js');
    runTelegramBot();
    
    expect(logSpy).toHaveBeenCalledWith('TELEGRAM_BOT_TOKEN не задан — Telegram-бот пропущен');
    expect(mockTelegrafInstance.launch).not.toHaveBeenCalled();
    
    logSpy.mockRestore();
  });

  it('should initialize, launch bot, and cover all callbacks', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'fake-test-token';
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { default: runTelegramBot } = await import('../src/bots/telegramBot.js');
    const { Telegraf } = await import('telegraf');
    
    runTelegramBot();
    
    expect(Telegraf).toHaveBeenCalledWith('fake-test-token');
    expect(mockTelegrafInstance.catch).toHaveBeenCalled();
    expect(mockTelegrafInstance.on).toHaveBeenCalledWith('text', expect.any(Function));
    expect(mockTelegrafInstance.launch).toHaveBeenCalled();
    expect(process.once).toHaveBeenCalledWith('SIGINT', expect.any(Function));
    expect(process.once).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
    expect(logSpy).toHaveBeenCalledWith('Telegram-бот (Telegraf) запущен...');

    // 1. Вызываем callback для bot.catch
    const catchHandler = mockTelegrafInstance.catch.mock.calls[0][0];
    const mockReplyForCatch = jest.fn();
    catchHandler(new Error('Test error'), { from: { id: 1 }, reply: mockReplyForCatch });
    expect(mockReplyForCatch).toHaveBeenCalledWith('Произошла ошибка. Попробуйте позже.');

    // 2. Вызываем callback для bot.on('text')
    const textHandler = mockTelegrafInstance.on.mock.calls[0][1];
    const mockReplyForText = jest.fn();
    await textHandler({ message: { text: '/start' }, from: { id: 123 }, reply: mockReplyForText });
    expect(mockReplyForText).toHaveBeenCalled();

    // 3. Вызываем callback для SIGINT
    const sigintHandler = process.once.mock.calls.find(c => c[0] === 'SIGINT')[1];
    sigintHandler();
    expect(mockTelegrafInstance.stop).toHaveBeenCalledWith('SIGINT');

    // 4. Вызываем callback для SIGTERM
    const sigtermHandler = process.once.mock.calls.find(c => c[0] === 'SIGTERM')[1];
    sigtermHandler();
    expect(mockTelegrafInstance.stop).toHaveBeenCalledWith('SIGTERM');

    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('should handle bot.launch() errors gracefully', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'fake-test-token';
    
    // Заставляем launch вернуть отклоненный промис только для этого теста
    mockTelegrafInstance.launch.mockImplementationOnce(() => Promise.reject(new Error('Invalid token')));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    const { default: runTelegramBot } = await import('../src/bots/telegramBot.js');
    runTelegramBot();
    
    // Ждём, пока обработается reject от launch().catch()
    await new Promise((resolve) => setTimeout(resolve, 10));
    
    expect(errorSpy).toHaveBeenCalledWith('Ошибка запуска бота:', 'Invalid token');
    
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });
});