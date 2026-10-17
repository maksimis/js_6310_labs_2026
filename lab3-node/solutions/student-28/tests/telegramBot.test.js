import { describe, test, expect, jest, beforeEach } from '@jest/globals';

const botInstances = [];

jest.unstable_mockModule('node-telegram-bot-api', () => ({
  default: jest.fn().mockImplementation(() => {
    const handlers = {};
    const bot = {
      handlers,
      on: jest.fn((event, cb) => {
        handlers[event] = cb;
      }),
      sendMessage: jest.fn().mockResolvedValue({}),
    };
    botInstances.push(bot);
    return bot;
  }),
}));

const { default: runTelegramBot } = await import('../src/bots/telegramBot.js');
const { default: TelegramBot } = await import('node-telegram-bot-api');

describe('telegramBot', () => {
  beforeEach(() => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-secret-token';
    delete process.env.TELEGRAM_PROXY;
    delete process.env.HTTPS_PROXY;
  });

  test('creates a bot instance and attaches handlers when token is set', () => {
    const bot = runTelegramBot();
    expect(TelegramBot).toHaveBeenCalledWith('test-secret-token', { polling: true });
    expect(bot.handlers.message).toBeDefined();
    expect(bot.handlers.polling_error).toBeDefined();
  });

  test('creates a bot instance with proxy options when TELEGRAM_PROXY is set', () => {
    process.env.TEST_USE_PROXY = '1';
    process.env.TELEGRAM_PROXY = 'http://127.0.0.1:10809';
    runTelegramBot();
    delete process.env.TEST_USE_PROXY;
    expect(TelegramBot).toHaveBeenCalledWith('test-secret-token', {
      polling: true,
      request: { proxy: 'http://127.0.0.1:10809' },
    });
  });

  test('answers to /start via sendMessage in the chat', async () => {
    const bot = runTelegramBot();
    await bot.handlers.message({
      chat: { id: 100 },
      from: { id: 42 },
      text: '/start',
    });
    expect(bot.sendMessage).toHaveBeenCalledWith(100, expect.stringContaining('TetrisBattleBot'));
  });

  test('uses chat.id when msg.from is absent', async () => {
    const bot = runTelegramBot();
    await bot.handlers.message({
      chat: { id: 200 },
      text: '/help',
    });
    expect(bot.sendMessage).toHaveBeenCalledWith(200, expect.stringContaining('/field'));
  });

  test('sends message with parse_mode Markdown when text contains code block', async () => {
    const bot = runTelegramBot();
    await bot.handlers.message({
      chat: { id: 250 },
      text: '/field',
    });
    expect(bot.sendMessage).toHaveBeenCalledWith(250, expect.stringContaining('```'), { parse_mode: 'Markdown' });
  });

  test('catches and logs error when message handling fails', async () => {
    const bot = runTelegramBot();
    bot.sendMessage.mockRejectedValueOnce(new Error('Network error'));
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await bot.handlers.message({
      chat: { id: 300 },
      from: { id: 50 },
      text: '/start',
    });

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('logs polling errors without crashing process', () => {
    const bot = runTelegramBot();
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    bot.handlers.polling_error(new Error('Polling connection timeout'));
    expect(spy).toHaveBeenCalledWith('Ошибка polling:', 'Polling connection timeout');
    spy.mockRestore();
  });

  test('returns null and does not create bot if token is missing', () => {
    process.env.TELEGRAM_BOT_TOKEN = '';
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const countBefore = botInstances.length;

    const result = runTelegramBot();
    expect(result).toBeNull();
    expect(botInstances.length).toBe(countBefore);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('не задан'));

    spy.mockRestore();
  });
});
