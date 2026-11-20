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

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

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
    cb({ chat: { id: 1 }, from: { id: 7 }, text: '/start' });
    await tick();
    expect(bot.sendMessage).toHaveBeenCalledWith(1, expect.stringContaining('RecipeBot'));
  });

  test('keeps state of different users in the same group chat separate', async () => {
    const bot = botInstances[0];
    const cb = messageHandlers.find((h) => h.toString().includes('msg.text'));
    cb({ chat: { id: -100 }, from: { id: 11 }, text: '/recipes add' });
    cb({ chat: { id: -100 }, from: { id: 22 }, text: 'Борщ' });
    await tick();
    expect(bot.sendMessage).toHaveBeenLastCalledWith(-100, expect.stringContaining('/help'));
  });

  test('ignores messages without a sender', async () => {
    const bot = botInstances[0];
    const cb = messageHandlers.find((h) => h.toString().includes('msg.text'));
    cb({ chat: { id: 5 }, text: '/start' });
    await tick();
    expect(bot.sendMessage).not.toHaveBeenCalledWith(5, expect.anything());
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