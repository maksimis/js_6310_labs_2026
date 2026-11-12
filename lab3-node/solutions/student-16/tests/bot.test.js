import { afterEach, describe, test, expect, jest } from '@jest/globals';

const sendMessage = jest.fn().mockResolvedValue({});
const answerCallbackQuery = jest.fn().mockResolvedValue({});
const onTextMock = jest.fn();
const onMock = jest.fn();

jest.unstable_mockModule('node-telegram-bot-api', () => ({
  default: jest.fn().mockImplementation(() => ({
    onText: onTextMock,
    on: onMock,
    sendMessage,
    answerCallbackQuery,
  })),
}));

const { createBot } = await import('../src/bot.js');

function makeMsg(text, userId = 1) {
  return {
    chat: { id: userId },
    from: { id: userId, username: 'user', first_name: 'U' },
    text,
  };
}

function getHandler(event, pattern) {
  const calls = event === 'onText' ? onTextMock.mock.calls : onMock.mock.calls;
  for (const call of calls) {
    if (event === 'onText') {
      if (call[0] instanceof RegExp && call[0].test(pattern)) {
        return call[1];
      }
    } else if (call[0] === pattern) {
      return call[1];
    }
  }
  return null;
}

beforeEach(() => {
  sendMessage.mockClear();
  answerCallbackQuery.mockClear();
  onTextMock.mockClear();
  onMock.mockClear();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('createBot', () => {
  test('throws without token', () => {
    expect(() => createBot('')).toThrow();
  });

  test('registers handlers', () => {
    createBot('test-token');
    expect(onTextMock).toHaveBeenCalled();
    expect(onMock).toHaveBeenCalledWith('callback_query', expect.any(Function));
    expect(onMock).toHaveBeenCalledWith('message', expect.any(Function));
    expect(onMock).toHaveBeenCalledWith('polling_error', expect.any(Function));
  });

  test('/start sends help with menu', async () => {
    createBot('test-token');
    const handler = getHandler('onText', '/start');
    await handler(makeMsg('/start'));
    expect(sendMessage).toHaveBeenCalled();
    const [, text, opts] = sendMessage.mock.calls[0];
    expect(text).toMatch(/бот/i);
    expect(opts.reply_markup.keyboard).toBeDefined();
  });

  test('/new_quiz sends mode keyboard', async () => {
    createBot('test-token');
    const handler = getHandler('onText', '/new_quiz');
    await handler(makeMsg('/new_quiz'));
    const [, , opts] = sendMessage.mock.calls[0];
    expect(opts.reply_markup.inline_keyboard.length).toBeGreaterThan(0);
  });

  test('/score without quiz gives hint', async () => {
    createBot('test-token');
    const handler = getHandler('onText', '/score');
    await handler(makeMsg('/score'));
    const [, text] = sendMessage.mock.calls[0];
    expect(text).toMatch(/Активная сессия отсутствует|счёт/i);
  });

  test('/records returns string', async () => {
    createBot('test-token');
    const handler = getHandler('onText', '/records');
    await handler(makeMsg('/records'));
    expect(sendMessage).toHaveBeenCalled();
  });

  test('callback_query mode/topic switches state', async () => {
    createBot('test-token');
    const cb = getHandler('on', 'callback_query');
    await cb({
      from: { id: 2, username: 'u', first_name: 'U' },
      message: { chat: { id: 2 } },
      data: 'mode:choice',
      id: 'cb1',
    });
    expect(answerCallbackQuery).toHaveBeenCalled();
    await cb({
      from: { id: 2, username: 'u', first_name: 'U' },
      message: { chat: { id: 2 } },
      data: 'topic:it',
      id: 'cb2',
    });
    expect(sendMessage).toHaveBeenCalled();
  });

  test('unknown callback data returns fallback message', async () => {
    createBot('test-token');
    const cb = getHandler('on', 'callback_query');
    await cb({
      from: { id: 3, username: 'u', first_name: 'U' },
      message: { chat: { id: 3 } },
      data: 'unknown:data',
      id: 'cb3',
    });
    const [, text] = sendMessage.mock.calls[0];
    expect(text).toMatch(/Неизвестное действие/);
  });

  test('menu button new game starts quiz', async () => {
    createBot('test-token');
    const msg = getHandler('on', 'message');
    await msg(makeMsg('🎮 Новая игра', 4));
    const [, , opts] = sendMessage.mock.calls[0];
    expect(opts.reply_markup.inline_keyboard.length).toBeGreaterThan(0);
  });

  test('menu button score works', async () => {
    createBot('test-token');
    const msg = getHandler('on', 'message');
    await msg(makeMsg('📊 Мой счёт', 5));
    expect(sendMessage).toHaveBeenCalled();
  });

  test('menu button records works', async () => {
    createBot('test-token');
    const msg = getHandler('on', 'message');
    await msg(makeMsg('🏆 Рекорды', 6));
    expect(sendMessage).toHaveBeenCalled();
  });

  test('menu button help works', async () => {
    createBot('test-token');
    const msg = getHandler('on', 'message');
    await msg(makeMsg('ℹ️ Помощь', 7));
    const [, text] = sendMessage.mock.calls[0];
    expect(text).toMatch(/бот/i);
  });

  test('plain text without active quiz is ignored', async () => {
    createBot('test-token');
    const msg = getHandler('on', 'message');
    await msg(makeMsg('привет', 8));
  });

  test('slash command inside message handler is ignored', async () => {
    createBot('test-token');
    const msg = getHandler('on', 'message');
    await msg(makeMsg('/start', 9));
  });

  test('polling_error logs to console', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    createBot('test-token');
    const handler = getHandler('on', 'polling_error');
    handler({ message: 'test error' });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('bot.js callback and message paths', () => {
  test('callback without message does nothing', async () => {
    createBot('test-token');
    const cb = getHandler('on', 'callback_query');
    await cb({
      from: { id: 100, username: 'u', first_name: 'U' },
      data: 'mode:choice',
      id: 'cb-no-msg',
    });
  });

  test('callback cancel resets session', async () => {
    createBot('test-token');
    const cb = getHandler('on', 'callback_query');
    await cb({
      from: { id: 101, username: 'u', first_name: 'U' },
      message: { chat: { id: 101 } },
      data: 'cancel',
      id: 'cb-cancel',
    });
    const [, text] = sendMessage.mock.calls[0];
    expect(text).toMatch(/Отменено|меню/i);
  });

  test('callback full flow: mode -> topic -> answer', async () => {
    createBot('test-token');
    const cb = getHandler('on', 'callback_query');

    await cb({
      from: { id: 102, username: 'u', first_name: 'U' },
      message: { chat: { id: 102 } },
      data: 'mode:choice',
      id: 'cb1',
    });
    await cb({
      from: { id: 102, username: 'u', first_name: 'U' },
      message: { chat: { id: 102 } },
      data: 'topic:it',
      id: 'cb2',
    });
    // отвечаем на вопрос через callback
    await cb({
      from: { id: 102, username: 'u', first_name: 'U' },
      message: { chat: { id: 102 } },
      data: 'answer:1',
      id: 'cb3',
    });
    expect(answerCallbackQuery).toHaveBeenCalled();
    expect(sendMessage.mock.calls.length).toBeGreaterThanOrEqual(3);
  });

  test('callback answer without active quiz returns hint', async () => {
    createBot('test-token');
    const cb = getHandler('on', 'callback_query');
    await cb({
      from: { id: 103, username: 'u', first_name: 'U' },
      message: { chat: { id: 103 } },
      data: 'answer:1',
      id: 'cb-no-quiz',
    });
    const [, text] = sendMessage.mock.calls[0];
    expect(text).toMatch(/неактивна|Начните/i);
  });

  test('message answer finishes quiz and saves record', async () => {
    createBot('test-token');
    const msg = getHandler('on', 'message');

    // начнём игру через кнопки
    const cb = getHandler('on', 'callback_query');
    await cb({
      from: { id: 104, username: 'u', first_name: 'U' },
      message: { chat: { id: 104 } },
      data: 'mode:open',
      id: 'cb-open',
    });
    await cb({
      from: { id: 104, username: 'u', first_name: 'U' },
      message: { chat: { id: 104 } },
      data: 'topic:it',
      id: 'cb-topic',
    });

    // первый ответ — текст
    await msg({
      chat: { id: 104 },
      from: { id: 104, username: 'u', first_name: 'U' },
      text: 'процессор',
    });
    // второй ответ — завершает игру
    await msg({
      chat: { id: 104 },
      from: { id: 104, username: 'u', first_name: 'U' },
      text: 'git checkout -b',
    });

    const lastCall = sendMessage.mock.calls[sendMessage.mock.calls.length - 1];
    expect(lastCall[1]).toMatch(/Игра окончена/);
  });

  test('message without text ignored', async () => {
    createBot('test-token');
    const msg = getHandler('on', 'message');
    await msg({
      chat: { id: 105 },
      from: { id: 105, username: 'u', first_name: 'U' },
    });
  });

  test('unknown callback shows fallback', async () => {
    createBot('test-token');
    const cb = getHandler('on', 'callback_query');
    await cb({
      from: { id: 106, username: 'u', first_name: 'U' },
      message: { chat: { id: 106 } },
      data: 'nonsense',
      id: 'cb-bad',
    });
    const [, text] = sendMessage.mock.calls[0];
    expect(text).toMatch(/Неизвестное действие/);
  });

  test('polling_error is logged', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    createBot('test-token');
    const handler = getHandler('on', 'polling_error');
    handler({ message: 'boom' });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('new game button in message starts quiz', async () => {
    createBot('test-token');
    const msg = getHandler('on', 'message');
    await msg({
      chat: { id: 107 },
      from: { id: 107, username: 'u', first_name: 'U' },
      text: '🎮 Новая игра',
    });
    expect(sendMessage).toHaveBeenCalled();
  });

  test('score button in message shows score', async () => {
    createBot('test-token');
    const msg = getHandler('on', 'message');
    await msg({
      chat: { id: 108 },
      from: { id: 108, username: 'u', first_name: 'U' },
      text: '📊 Мой счёт',
    });
    expect(sendMessage).toHaveBeenCalled();
  });

  test('records button in message shows records', async () => {
    createBot('test-token');
    const msg = getHandler('on', 'message');
    await msg({
      chat: { id: 109 },
      from: { id: 109, username: 'u', first_name: 'U' },
      text: '🏆 Рекорды',
    });
    expect(sendMessage).toHaveBeenCalled();
  });

  test('help button in message shows help', async () => {
    createBot('test-token');
    const msg = getHandler('on', 'message');
    await msg({
      chat: { id: 110 },
      from: { id: 110, username: 'u', first_name: 'U' },
      text: 'ℹ️ Помощь',
    });
    const [, text] = sendMessage.mock.calls[0];
    expect(text).toMatch(/бот/i);
  });
});

test('callback answer finishes quiz and saves record', async () => {
  createBot('test-token');
  const cb = getHandler('on', 'callback_query');

  // начало игры в режиме choice
  await cb({
    from: { id: 200, username: 'testuser', first_name: 'T' },
    message: { chat: { id: 200 } },
    data: 'mode:choice',
    id: 'c1',
  });
  await cb({
    from: { id: 200, username: 'testuser', first_name: 'T' },
    message: { chat: { id: 200 } },
    data: 'topic:general',
    id: 'c2',
  });

  // два вопроса в general/choice
  // первый: Столица Франции → ответ 0 → кнопка "answer:1"
  await cb({
    from: { id: 200, username: 'testuser', first_name: 'T' },
    message: { chat: { id: 200 } },
    data: 'answer:1',
    id: 'c3',
  });
  // второй: Сколько континентов → ответ 2 → кнопка "answer:3"
  await cb({
    from: { id: 200, username: 'testuser', first_name: 'T' },
    message: { chat: { id: 200 } },
    data: 'answer:3',
    id: 'c4',
  });

  // последний вызов sendMessage должен содержать "Игра окончена"
  const lastCall = sendMessage.mock.calls[sendMessage.mock.calls.length - 1];
  expect(lastCall[1]).toMatch(/Игра окончена/);
});