import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const bots = [];
jest.unstable_mockModule('node-telegram-bot-api', () => ({
  default: jest.fn().mockImplementation(() => {
    const bot = { on: jest.fn(), sendMessage: jest.fn().mockResolvedValue({}) };
    bots.push(bot);
    return bot;
  })
}));

const { default: runTelegramBot } = await import('../src/bots/telegramBot.js');
const { default: TelegramBot } = await import('node-telegram-bot-api');

describe('Telegram bot', () => {
  beforeEach(() => {
    bots.length = 0;
    TelegramBot.mockClear();
  });

  test('does not create a bot without a token', () => {
    process.env.TELEGRAM_BOT_TOKEN = '';
    expect(runTelegramBot()).toBeNull();
    expect(TelegramBot).not.toHaveBeenCalled();
  });

  test('registers polling and dispatches text messages', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-token';
    const bot = runTelegramBot();
    const messageHandler = bot.on.mock.calls.find(([event]) => event === 'message')[1];
    await messageHandler({ chat: { id: 12 }, text: '/start' });

    expect(TelegramBot).toHaveBeenCalledWith('test-token', { polling: true });
    expect(bot.sendMessage).toHaveBeenCalledWith(12, expect.stringContaining('ExpenseBot'));
  });

  test('does not throw if sending a reply fails', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-token';
    const bot = runTelegramBot();
    bot.sendMessage.mockRejectedValueOnce(new Error('network error'));
    const messageHandler = bot.on.mock.calls.find(([event]) => event === 'message')[1];

    await expect(messageHandler({ chat: { id: 12 }, text: '/start' })).resolves.toBeUndefined();
  });
});
