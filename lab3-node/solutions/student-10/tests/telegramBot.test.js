import { describe, test, expect, jest, beforeEach } from '@jest/globals';

let botInstances = [];

jest.unstable_mockModule('node-telegram-bot-api', () => ({
  default: jest.fn().mockImplementation(() => {
    const bot = {
      onText: jest.fn(),
      on: jest.fn(),
      sendMessage: jest.fn().mockResolvedValue({}),
    };
    botInstances.push(bot);
    return bot;
  }),
}));

const { default: runTelegramBot } = await import('../src/bots/telegramBot');
const { default: TelegramBot } = await import('node-telegram-bot-api');

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

// Все обработчики события message, зарегистрированные ботом
const messageListeners = (bot) =>
  bot.on.mock.calls.filter(([event]) => event === 'message').map(([, cb]) => cb);

// Имитация Telegram: событие получают ВСЕ зарегистрированные обработчики
const emit = (bot, msg) => messageListeners(bot).forEach((cb) => cb(msg));

describe('runTelegramBot', () => {
  beforeEach(() => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-token';
  });

  test('creates a Telegram bot instance and subscribes to events', () => {
    runTelegramBot();
    expect(TelegramBot).toHaveBeenCalled();
  });

  test('registers exactly one message handler', () => {
    expect(messageListeners(botInstances[0])).toHaveLength(1);
  });

  test('replies to /start once, to the chat it came from', async () => {
    const bot = botInstances[0];
    bot.sendMessage.mockClear();
    emit(bot, { chat: { id: 1 }, from: { id: 7 }, text: '/start' });
    await tick();
    expect(bot.sendMessage).toHaveBeenCalledTimes(1);
    expect(bot.sendMessage).toHaveBeenCalledWith(1, expect.stringContaining('RecipeBot'));
  });

  test('keeps state of different users in the same group chat separate', async () => {
    const bot = botInstances[0];
    bot.sendMessage.mockClear();
    emit(bot, { chat: { id: -100 }, from: { id: 11 }, text: '/recipes add' });
    await tick();
    emit(bot, { chat: { id: -100 }, from: { id: 22 }, text: 'Борщ' });
    await tick();
    expect(bot.sendMessage).toHaveBeenCalledTimes(2);
    expect(bot.sendMessage).toHaveBeenNthCalledWith(1, -100, expect.stringContaining('название'));
    expect(bot.sendMessage).toHaveBeenNthCalledWith(2, -100, expect.stringContaining('/help'));
  });

  test('ignores messages without a sender', async () => {
    const bot = botInstances[0];
    bot.sendMessage.mockClear();
    emit(bot, { chat: { id: 5 }, text: '/start' });
    await tick();
    expect(bot.sendMessage).not.toHaveBeenCalled();
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