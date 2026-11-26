import { describe, test, expect, jest, beforeEach } from '@jest/globals';

let botInstances = [];
let messageHandlers = [];

jest.unstable_mockModule('node-telegram-bot-api', () => ({
  default: jest.fn().mockImplementation(() => {
    const bot = {
      on: jest.fn(),
      sendMessage: jest.fn().mockResolvedValue({}),
    };
    bot.on.mockImplementation((event, cb) => {
      messageHandlers.push(cb);
    });
    botInstances.push(bot);
    return bot;
  }),
}));

const { default: runTelegramBot } = await import('../src/bots/telegramBot.js');
const { default: TelegramBot } = await import('node-telegram-bot-api');

describe('runTelegramBot', () => {
  beforeEach(() => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-token';
    botInstances.length = 0;
    messageHandlers.length = 0;
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('создаёт инстанс бота при наличии токена', () => {
    runTelegramBot();
    expect(TelegramBot).toHaveBeenCalled();
  });

  test('не создаёт бота без токена', () => {
    process.env.TELEGRAM_BOT_TOKEN = '';
    const before = botInstances.length;
    runTelegramBot();
    expect(botInstances.length).toBe(before);
  });

  test('подписывается на событие message', () => {
    runTelegramBot();
    expect(messageHandlers.length).toBeGreaterThan(0);
  });
});