import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import handleMessage from '../src/handlers/messageHandler.js';
import { clearGames, clearSessions } from '../src/services/gameStore.js';

describe('messageHandler', () => {
  beforeEach(() => {
    clearGames();
    clearSessions();
  });

  test('greets on /start', async () => {
    const reply = jest.fn();
    await handleMessage('/start', 1, reply);
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('SnakeBot'));
  });

  test('creates a game through FSM: prompts for size, then creates', async () => {
    const reply = jest.fn();
    await handleMessage('/create_game', 1, reply);
    expect(reply).toHaveBeenLastCalledWith(expect.stringContaining('Введите размер поля'));

    await handleMessage('10', 1, reply);
    expect(reply).toHaveBeenLastCalledWith(expect.stringContaining('Партия создана'));
  });

  test('rejects invalid field size', async () => {
    const reply = jest.fn();
    await handleMessage('/create_game', 1, reply);
    await handleMessage('abc', 1, reply);
    expect(reply).toHaveBeenLastCalledWith(
      expect.stringContaining('целое число от 5 до 50'),
    );
  });

  test('rejects field size out of range', async () => {
    const reply = jest.fn();
    await handleMessage('/create_game', 1, reply);
    await handleMessage('100', 1, reply);
    expect(reply).toHaveBeenLastCalledWith(
      expect.stringContaining('целое число от 5 до 50'),
    );
  });

  test('cancels FSM state on /cancel', async () => {
    const reply = jest.fn();
    await handleMessage('/create_game', 1, reply);
    await handleMessage('/cancel', 1, reply);
    expect(reply).toHaveBeenLastCalledWith(expect.stringContaining('отменено'));
  });

  test('rejects /join without a code', async () => {
    const reply = jest.fn();
    await handleMessage('/join', 1, reply);
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('Укажите код'));
  });

  test('rejects /join with unknown code', async () => {
    const reply = jest.fn();
    await handleMessage('/join ZZZZZZ', 1, reply);
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('не найдена'));
  });

  test('rejects /move without a game', async () => {
    const reply = jest.fn();
    await handleMessage('/move up', 1, reply);
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('не в партии'));
  });

  test('rejects unknown direction', async () => {
    const reply = jest.fn();
    await handleMessage('/create_game', 1, reply);
    await handleMessage('10', 1, reply);
    await handleMessage('/move диагональ', 1, reply);
    expect(reply).toHaveBeenLastCalledWith(
      expect.stringContaining('up, down, left, right'),
    );
  });

  test('ignores empty input', async () => {
    const reply = jest.fn();
    await handleMessage('', 1, reply);
    expect(reply).not.toHaveBeenCalled();
  });

  test('is isolated between chats', async () => {
    const r1 = jest.fn();
    const r2 = jest.fn();
    await handleMessage('/create_game', 1, r1);
    await handleMessage('10', 1, r1);
    await handleMessage('/move up', 2, r2);
    expect(r2).toHaveBeenLastCalledWith(expect.stringContaining('не в партии'));
  });

  test('handles /field without game', async () => {
    const reply = jest.fn();
    await handleMessage('/field', 1, reply);
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('не в партии'));
  });

  test('handles unknown command', async () => {
    const reply = jest.fn();
    await handleMessage('/unknown', 1, reply);
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('Неизвестная команда'));
  });

  test('player can join by code and move', async () => {
    const reply = jest.fn();
    await handleMessage('/create_game', 1, reply);
    const lastCall = reply.mock.calls.at(-1)[0];
    // получаем код через ответ на размер поля
    await handleMessage('10', 1, reply);
    const createReply = reply.mock.calls.at(-1)[0];
    const code = createReply.match(/Код приглашения: (\w+)/)[1];

    await handleMessage(`/join ${code}`, 2, reply);
    expect(reply).toHaveBeenLastCalledWith(expect.stringContaining('подключены'));

    await handleMessage('/move right', 2, reply);
    expect(reply).toHaveBeenLastCalledWith(expect.stringContaining('Ход выполнен'));
    expect(lastCall).toBeDefined();
  });

  test('does not let the same player join twice', async () => {
    const reply = jest.fn();
    await handleMessage('/create_game', 1, reply);
    await handleMessage('10', 1, reply);
    const createReply = reply.mock.calls.at(-1)[0];
    const code = createReply.match(/Код приглашения: (\w+)/)[1];

    await handleMessage(`/join ${code}`, 1, reply);
    expect(reply).toHaveBeenLastCalledWith(expect.stringContaining('Не удалось'));
  });
});