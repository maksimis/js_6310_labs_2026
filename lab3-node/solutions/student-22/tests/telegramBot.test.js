import { describe, test, expect, jest, beforeEach } from '@jest/globals';

const botInstances = [];

jest.unstable_mockModule('node-telegram-bot-api', () => ({
  default: jest.fn().mockImplementation(() => {
    const handlers = {};
    const bot = {
      handlers,
      on: jest.fn((event, cb) => { handlers[event] = cb; }),
      sendMessage: jest.fn().mockResolvedValue({}),
    };
    botInstances.push(bot);
    return bot;
  }),
}));

const { default: runTelegramBot } = await import('../src/bots/telegramBot.js');
const { default: TelegramBot } = await import('node-telegram-bot-api');

describe('runTelegramBot', () => {
  beforeEach(() => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-token';
  });

  test('creates a bot and subscribes to messages', () => {
    const bot = runTelegramBot();
    expect(TelegramBot).toHaveBeenCalledWith('test-token', { polling: true });
    expect(bot.handlers.message).toBeDefined();
  });

  test('answers to /start in the same chat', async () => {
    const bot = runTelegramBot();
    await bot.handlers.message({ chat: { id: 10 }, from: { id: 5 }, text: '/start' });
    expect(bot.sendMessage).toHaveBeenCalledWith(10, expect.stringContaining('SortingBot'));
  });

  test('uses chat id when there is no sender', async () => {
    const bot = runTelegramBot();
    await bot.handlers.message({ chat: { id: 11 }, text: '/help' });
    expect(bot.sendMessage).toHaveBeenCalledWith(11, expect.stringContaining('/array'));
  });

  test('does not crash when sending fails', async () => {
    const bot = runTelegramBot();
    bot.sendMessage.mockRejectedValueOnce(new Error('network'));
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await bot.handlers.message({ chat: { id: 12 }, from: { id: 6 }, text: '/start' });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('logs polling errors instead of crashing', () => {
    const bot = runTelegramBot();
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    bot.handlers.polling_error(new Error('ETELEGRAM'));
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('skips bot creation when token is missing', () => {
    process.env.TELEGRAM_BOT_TOKEN = '';
    const countBefore = botInstances.length;
    expect(runTelegramBot()).toBeNull();
    expect(botInstances.length).toBe(countBefore);
  });
});
