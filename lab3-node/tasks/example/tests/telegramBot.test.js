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

const { default: runTelegramBot } = await import('../src/bots/telegramBot');
const { default: TelegramBot } = await import('node-telegram-bot-api');

describe('runTelegramBot', () => {
  beforeEach(() => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-token';
  });

  test('creates a Telegram bot instance and subscribes to events', () => {
    runTelegramBot();
    expect(TelegramBot).toHaveBeenCalled();
  });

  test('replies to /start through the registered handler', async () => {
    const bot = botInstances[0];
    const cb = messageHandlers.find((h) => h.toString().includes('msg.text'));
    cb({ chat: { id: 1 }, text: '/start' });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(bot.sendMessage).toHaveBeenCalledWith(1, 'Привет! Я твой первый бот!');
  });

  test('does not use onText subscription', () => {
    expect(botInstances[0].onText).not.toHaveBeenCalled();
  });

  test('skips bot creation when token is missing', () => {
    process.env.TELEGRAM_BOT_TOKEN = '';
    const countBefore = botInstances.length;
    runTelegramBot();
    expect(botInstances.length).toBe(countBefore);
  });
});