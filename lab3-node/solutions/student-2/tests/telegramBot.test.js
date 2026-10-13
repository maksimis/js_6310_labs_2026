import { describe, test, expect, jest, beforeEach } from '@jest/globals';

let botInstances = [];
let messageHandlers = [];

jest.unstable_mockModule('node-telegram-bot-api', () => ({
  default: jest.fn().mockImplementation(() => {
    const bot = {
      onText: jest.fn(),
      on: jest.fn(),
      sendMessage: jest.fn().mockResolvedValue({}),
    };
    bot.onText.mockImplementation((re, cb) => { messageHandlers.push(cb); });
    bot.on.mockImplementation((event, cb) => { messageHandlers.push(cb); });
    botInstances.push(bot);
    return bot;
  }),
}));

const { default: runTelegramBot } = await import('../src/bots/telegramBot.js');
const { default: TelegramBot } = await import('node-telegram-bot-api');

describe('runTelegramBot', () => {
  beforeEach(() => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-token';
    if (botInstances[0]) {
      botInstances[0].sendMessage.mockClear();
    }
  });

  test('creates a Telegram bot instance and subscribes to events', () => {
    runTelegramBot();
    expect(TelegramBot).toHaveBeenCalled();
  });

  test('replies to /start safely through the registered handler', async () => {
    const bot = botInstances[0];
    const cb = messageHandlers.find((h) => h.toString().includes('msg.text'));
    await cb({ chat: { id: 1 }, text: '/start' });
    expect(bot.sendMessage).toHaveBeenCalledWith(
      1,
      expect.stringContaining('Breakout'),
      {}
    );
  });

  test('catches error on message dispatch safely', async () => {
    const cb = messageHandlers.find((h) => h.toString().includes('msg.text'));
    await expect(cb({ chat: null, text: '/start' })).resolves.not.toThrow();
  });

  test('handles sendMessage fallback when markdown parsing fails', async () => {
    const bot = botInstances[0];
    const cb = messageHandlers.find((h) => h.toString().includes('msg.text'));

    bot.sendMessage
        .mockRejectedValueOnce(new Error('Bad Request: parse entities error'))
        .mockResolvedValueOnce({});

    await cb({ chat: { id: 1 }, text: '/hint' });

    expect(bot.sendMessage).toHaveBeenCalledTimes(2);
  });
});