import { describe, test, expect, jest, beforeEach } from '@jest/globals';

let botInstances = [];

jest.unstable_mockModule('node-telegram-bot-api', () => ({
  default: jest.fn().mockImplementation(() => {
    const handlers = new Map();

    const bot = {
      handlers,
      on: jest.fn((event, callback) => {
        handlers.set(event, callback);
      }),
      sendMessage: jest.fn().mockResolvedValue({})
    };

    botInstances.push(bot);
    return bot;
  })
}));

const { default: runTelegramBot } = await import(
  '../src/bots/telegramBot.js'
);

const { default: TelegramBot } = await import(
  'node-telegram-bot-api'
);

describe('runTelegramBot', () => {
  beforeEach(() => {
    botInstances = [];
    jest.clearAllMocks();
    process.env.TELEGRAM_BOT_TOKEN = 'test-token';
  });

  test('creates bot and registers message handler', () => {
    runTelegramBot();

    expect(TelegramBot).toHaveBeenCalled();
    expect(botInstances[0].handlers.has('message')).toBe(true);
  });

  test('replies to /start', async () => {
    const bot = runTelegramBot();

    await bot.handlers.get('message')({
      chat: { id: 1 },
      from: { id: 1 },
      text: '/start'
    });

    expect(bot.sendMessage).toHaveBeenCalledWith(
      1,
      expect.stringContaining('SurveyBot')
    );
  });

  test('ignores non-text messages', async () => {
    const bot = runTelegramBot();

    await bot.handlers.get('message')({
      chat: { id: 1 }
    });

    expect(bot.sendMessage).not.toHaveBeenCalled();
  });

  test('catches sendMessage error', async () => {
    const bot = runTelegramBot();

    bot.sendMessage.mockRejectedValueOnce(
      new Error('Telegram API error')
    );

    const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

    try {
      await expect(
        bot.handlers.get('message')({
          chat: { id: 1 },
          from: { id: 1 },
          text: '/start'
        })
      ).resolves.toBeUndefined();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Ошибка обработки сообщения Telegram:',
        expect.any(Error)
      );
    } finally {
      consoleSpy.mockRestore();
    }
  });

  test('skips bot when token is missing', () => {
    process.env.TELEGRAM_BOT_TOKEN = '';

    expect(runTelegramBot()).toBeUndefined();
    expect(botInstances).toHaveLength(0);
  });
});