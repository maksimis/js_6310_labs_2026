// tests/bot.test.js
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

const handlers = new Map();

jest.unstable_mockModule('telegraf', () => {
  class Telegraf {
    start(callback) {
      handlers.set('start', callback);
      return this;
    }

    help(callback) {
      handlers.set('help', callback);
      return this;
    }

    command(name, callback) {
      handlers.set(`command:${name}`, callback);
      return this;
    }

    on(event, callback) {
      handlers.set(`on:${event}`, callback);
      return this;
    }

    action(pattern, callback) {
      handlers.set('action', callback);
      this.actionPattern = pattern;
      return this;
    }
  }

  const Markup = {
    inlineKeyboard: (rows) => ({ reply_markup: { inline_keyboard: rows } }),
    button: {
      callback: (text, callbackData) => ({ text, callback_data: callbackData })
    }
  };

  return { Telegraf, Markup };
});

const boards = new Map();
const getBoard = jest.fn();
const saveBoard = jest.fn();

jest.unstable_mockModule('../src/core/boardStore.js', () => ({ getBoard, saveBoard }));

await import('../src/bot/index.js');
const { Board } = await import('../src/core/models.js');

const startHandler = handlers.get('start');
const helpHandler = handlers.get('help');
const boardHandler = handlers.get('command:board');
const taskHandler = handlers.get('command:task');
const moveHandler = handlers.get('command:move');
const textHandler = handlers.get('on:text');
const actionHandler = handlers.get('action');

function boardFor(userId) {
  const key = String(userId);

  if (!boards.has(key)) {
    boards.set(key, new Board());
  }

  return boards.get(key);
}

function makeCtx(userId, text, chatId = userId) {
  return {
    from: { id: userId },
    chat: { id: chatId },
    message: { text },
    reply: jest.fn().mockResolvedValue(undefined),
    answerCbQuery: jest.fn().mockResolvedValue(undefined)
  };
}

function makeActionCtx(userId, taskId, key, chatId = userId) {
  return {
    from: { id: userId },
    chat: { id: chatId },
    match: [`move:${taskId}:${key}`, String(taskId), key],
    reply: jest.fn().mockResolvedValue(undefined),
    answerCbQuery: jest.fn().mockResolvedValue(undefined)
  };
}

async function createTask(userId, title) {
  await taskHandler(makeCtx(userId));
  const ctx = makeCtx(userId, title);
  await textHandler(ctx);
  return ctx;
}

async function openMove(userId, taskId) {
  await moveHandler(makeCtx(userId));
  const ctx = makeCtx(userId, taskId);
  await textHandler(ctx);
  return ctx;
}

describe('Bot handlers', () => {
  beforeEach(() => {
    boards.clear();
    getBoard.mockReset();
    getBoard.mockImplementation(async (userId) => boardFor(userId));
    saveBoard.mockReset();
    saveBoard.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('регистрирует все обработчики', () => {
    expect(typeof startHandler).toBe('function');
    expect(typeof helpHandler).toBe('function');
    expect(typeof boardHandler).toBe('function');
    expect(typeof taskHandler).toBe('function');
    expect(typeof moveHandler).toBe('function');
    expect(typeof textHandler).toBe('function');
    expect(typeof actionHandler).toBe('function');
  });

  it('/start отвечает приветствием', async () => {
    const ctx = makeCtx(1);
    await startHandler(ctx);

    expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('Привет'));
  });

  it('/help выводит список команд', async () => {
    const ctx = makeCtx(1);
    await helpHandler(ctx);

    expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('Команды'));
  });

  it('/board показывает доску пользователя', async () => {
    const ctx = makeCtx(1);
    await boardHandler(ctx);

    expect(ctx.reply.mock.calls[0][0]).toContain('To Do');
    expect(ctx.reply.mock.calls[0][0]).toContain('In Progress');
  });

  it('игнорирует текст в состоянии IDLE', async () => {
    await boardHandler(makeCtx(1));

    const ctx = makeCtx(1, 'просто текст');
    await textHandler(ctx);

    expect(ctx.reply).not.toHaveBeenCalled();
  });

  it('/task создаёт задачу в доске пользователя', async () => {
    const promptCtx = makeCtx(10);
    await taskHandler(promptCtx);
    expect(promptCtx.reply).toHaveBeenCalledWith(expect.stringContaining('название'));

    const ctx = makeCtx(10, 'Моя задача');
    await textHandler(ctx);

    expect(ctx.reply.mock.calls[0][0]).toContain('Моя задача');
    expect(ctx.reply.mock.calls[0][0]).toContain('ID: 1');
    expect(saveBoard).toHaveBeenCalledWith('10', boardFor(10));
    expect(boardFor(10).tasks).toHaveLength(1);
  });

  it('не создаёт задачу с пустым названием', async () => {
    await taskHandler(makeCtx(40));

    const emptyCtx = makeCtx(40, '   ');
    await textHandler(emptyCtx);
    expect(emptyCtx.reply).toHaveBeenCalledWith(expect.stringContaining('не может быть пустым'));

    const ctx = makeCtx(40, 'Нормальная задача');
    await textHandler(ctx);
    expect(boardFor(40).tasks[0].title).toBe('Нормальная задача');
  });

  it('/move перемещает задачу через inline-кнопку', async () => {
    await createTask(10, 'Моя задача');

    const idCtx = await openMove(10, '1');
    expect(idCtx.reply.mock.calls[0][0]).toContain('Моя задача');
    expect(idCtx.reply.mock.calls[0][1]).toHaveProperty('reply_markup');

    const actionCtx = makeActionCtx(10, '1', 'in_progress');
    await actionHandler(actionCtx);

    expect(actionCtx.answerCbQuery).toHaveBeenCalledWith('✅ Успешно!');
    expect(actionCtx.reply.mock.calls[0][0]).toContain('In Progress');
    expect(actionCtx.reply.mock.calls[0][0]).toContain('шагов');
    expect(boardFor(10).tasks[0].status).toBe('In Progress');
  });

  it('перемещает задачу из callback_data, а не последнюю выбранную', async () => {
    await createTask(60, 'Первая');
    await createTask(60, 'Вторая');

    await openMove(60, '1');
    await openMove(60, '2');

    const actionCtx = makeActionCtx(60, '1', 'done');
    await actionHandler(actionCtx);

    expect(boardFor(60).tasks[0].status).toBe('Done');
    expect(boardFor(60).tasks[1].status).toBe('To Do');
  });

  it('сообщает, если задача для перемещения не найдена', async () => {
    await moveHandler(makeCtx(11));

    const ctx = makeCtx(11, '9999');
    await textHandler(ctx);

    expect(ctx.reply).toHaveBeenCalledWith(expect.stringContaining('не найдена'));
    await boardHandler(makeCtx(11));
  });

  it('игнорирует устаревшее нажатие кнопки', async () => {
    await boardHandler(makeCtx(12));

    const actionCtx = makeActionCtx(12, '1', 'done');
    await actionHandler(actionCtx);

    expect(actionCtx.answerCbQuery).toHaveBeenCalledWith(expect.stringContaining('Время ожидания'));
  });

  it('сообщает о неизвестной колонке', async () => {
    await createTask(13, 'Задача');
    await openMove(13, '1');

    const actionCtx = makeActionCtx(13, '1', 'bad');
    await actionHandler(actionCtx);

    expect(actionCtx.answerCbQuery).toHaveBeenCalledWith(expect.stringContaining('Неизвестная колонка'));
    await boardHandler(makeCtx(13));
  });

  it('обрабатывает ошибку перемещения (задача уже в колонке)', async () => {
    await createTask(14, 'Задача');

    await openMove(14, '1');
    const firstAction = makeActionCtx(14, '1', 'done');
    await actionHandler(firstAction);
    expect(firstAction.answerCbQuery).toHaveBeenCalledWith('✅ Успешно!');

    await openMove(14, '1');
    const secondAction = makeActionCtx(14, '1', 'done');
    await actionHandler(secondAction);

    expect(secondAction.answerCbQuery).toHaveBeenCalledWith('❌ Ошибка!');
    expect(secondAction.reply.mock.calls[0][0]).toContain('Ошибка при перемещении');
  });

  it('обрабатывает ошибку сохранения при создании задачи', async () => {
    await taskHandler(makeCtx(15));
    saveBoard.mockRejectedValueOnce(new Error('disk'));

    const ctx = makeCtx(15, 'Задача');
    await textHandler(ctx);

    expect(ctx.reply.mock.calls[0][0]).toContain('Ошибка: disk');

    const idleCtx = makeCtx(15, 'ещё текст');
    await textHandler(idleCtx);
    expect(idleCtx.reply).not.toHaveBeenCalled();
  });

  it('держит доски разных пользователей раздельно', async () => {
    await createTask(20, 'Задача первого');

    const otherCtx = makeCtx(21);
    await boardHandler(otherCtx);

    expect(boardFor(21).tasks).toEqual([]);
    expect(otherCtx.reply.mock.calls[0][0]).not.toContain('Задача первого');
  });

  it('держит состояние команд раздельно для пользователей одного чата', async () => {
    await taskHandler(makeCtx(30, undefined, 999));

    const otherUserCtx = makeCtx(31, 'чужой текст', 999);
    await textHandler(otherUserCtx);
    expect(otherUserCtx.reply).not.toHaveBeenCalled();

    const ownerCtx = makeCtx(30, 'Своя задача', 999);
    await textHandler(ownerCtx);

    expect(boardFor(30).tasks).toHaveLength(1);
    expect(boardFor(31).tasks).toEqual([]);
  });

  it('сообщает об ошибке загрузки доски в /board', async () => {
    getBoard.mockRejectedValueOnce(new Error('load fail'));

    const ctx = makeCtx(50);
    await boardHandler(ctx);

    expect(ctx.reply.mock.calls[0][0]).toContain('Ошибка: load fail');
  });

  it('сообщает об ошибке загрузки доски при создании задачи', async () => {
    await taskHandler(makeCtx(51));
    getBoard.mockRejectedValueOnce(new Error('load fail'));

    const ctx = makeCtx(51, 'Задача');
    await textHandler(ctx);

    expect(ctx.reply.mock.calls[0][0]).toContain('Ошибка: load fail');
  });

  it('сообщает об ошибке загрузки доски при перемещении', async () => {
    await createTask(52, 'Задача');
    await openMove(52, '1');

    getBoard.mockRejectedValueOnce(new Error('load fail'));

    const actionCtx = makeActionCtx(52, '1', 'done');
    await actionHandler(actionCtx);

    expect(actionCtx.answerCbQuery).toHaveBeenCalledWith('❌ Ошибка!');
    expect(actionCtx.reply.mock.calls[0][0]).toContain('load fail');
  });
});
