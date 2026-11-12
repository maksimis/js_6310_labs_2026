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
    botInstances = [];
    messageHandlers = [];
  });

  test('Создаёт экземпляр Telegram-бота и подписывается на события', () => {
    runTelegramBot();
    expect(TelegramBot).toHaveBeenCalled();
  });

  test('Отвечает на /start через зарегистрированный обработчик', async () => {
    runTelegramBot();
    const bot = botInstances[0];
    const cb = messageHandlers.find((h) => h.toString().includes('msg.text'));
    cb({ from: { id: 1 }, chat: { id: 1 }, text: '/start' });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(bot.sendMessage).toHaveBeenCalled();
    const answer = bot.sendMessage.mock.calls[0][1];
    expect(answer).toContain('Тренировка началась');
  });

  test('Игнорирует сообщения без поля from', async () => {
    runTelegramBot();
    const bot = botInstances[0];
    const cb = messageHandlers.find((h) => h.toString().includes('msg.text'));
    cb({ chat: { id: 1 }, text: '/start' });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(bot.sendMessage).not.toHaveBeenCalled();
  });

  test('Не использует подписку onText', () => {
    runTelegramBot();
    expect(botInstances[0].onText).not.toHaveBeenCalled();
  });

  test('Пропускает создание бота, если токен отсутствует', () => {
    process.env.TELEGRAM_BOT_TOKEN = '';
    const countBefore = botInstances.length;
    runTelegramBot();
    expect(botInstances.length).toBe(countBefore);
  });
});