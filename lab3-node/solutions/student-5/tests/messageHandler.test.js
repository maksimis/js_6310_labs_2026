import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import handleMessage from '../src/handlers/messageHandler.js';

describe('messageHandler', () => {
  let reply;

  beforeEach(() => {
    reply = jest.fn();
  });

  test('/start присылает справку', async () => {
    await handleMessage('/start', reply, 1);
    expect(reply).toHaveBeenCalledTimes(1);
    expect(reply.mock.calls[0][0]).toContain('крестиков-ноликов');
    expect(reply.mock.calls[0][0]).toContain('/new_game');
  });

  test('/new_game easy создаёт партию', async () => {
    await handleMessage('/new_game easy', reply, 10);
    expect(reply.mock.calls[0][0]).toContain('easy');
    expect(reply.mock.calls[0][0]).toContain('a   b   c');
  });

  test('/new_game medium работает', async () => {
    await handleMessage('/new_game medium', reply, 11);
    expect(reply.mock.calls[0][0]).toContain('medium');
  });

  test('/new_game hard работает', async () => {
    await handleMessage('/new_game hard', reply, 12);
    expect(reply.mock.calls[0][0]).toContain('hard');
  });

  test('/new_game без сложности показывает меню', async () => {
    await handleMessage('/new_game', reply, 13);
    expect(reply.mock.calls[0][0]).toContain('/new_game_easy');
  });

  test('/board после /new_game показывает поле', async () => {
    await handleMessage('/new_game easy', reply, 21);
    await handleMessage('/board', reply, 21);
    const last = reply.mock.calls[reply.mock.calls.length - 1][0];
    expect(last).toContain('a   b   c');
  });

  test('/move без партии — ошибка', async () => {
    await handleMessage('/move a1', reply, 30);
    expect(reply.mock.calls[0][0]).toContain('Активной партии нет');
  });

  test('/move с неверной позицией — ошибка', async () => {
    await handleMessage('/new_game easy', reply, 32);
    await handleMessage('/move z9', reply, 32);
    const last = reply.mock.calls[reply.mock.calls.length - 1][0];
    expect(last).toContain('Неверный или занятый ход');
  });

  test('корректный /move ставит X и O и возвращает поле', async () => {
    await handleMessage('/new_game easy', reply, 33);
    await handleMessage('/move a1', reply, 33);
    const last = reply.mock.calls[reply.mock.calls.length - 1][0];
    expect(last).toContain('X');
    expect(last).toContain('O');
  });

  test('/move в занятую клетку — ошибка', async () => {
    await handleMessage('/new_game easy', reply, 34);
    await handleMessage('/move a1', reply, 34);
    reply.mockClear();
    await handleMessage('/move a1', reply, 34);
    expect(reply.mock.calls[0][0]).toContain('Неверный или занятый ход');
  });

  test('сессии разных пользователей не пересекаются', async () => {
    await handleMessage('/new_game easy', reply, 100);
    await handleMessage('/move a1', reply, 100);

    await handleMessage('/new_game hard', reply, 200);
    reply.mockClear();
    await handleMessage('/board', reply, 200);

    const boardForUser200 = reply.mock.calls[0][0];
    expect((boardForUser200.match(/\*/g) || []).length).toBe(9);
  });

  test('неизвестная команда — подсказка', async () => {
    await handleMessage('/foobar', reply, 40);
    expect(reply.mock.calls[0][0]).toContain('Неизвестная команда');
  });

  test('победа игрока', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    await handleMessage('/new_game easy', reply, 50);
    await handleMessage('/move a2', reply, 50);
    await handleMessage('/move b2', reply, 50);
    reply.mockClear();
    await handleMessage('/move c2', reply, 50);

    expect(reply.mock.calls[0][0]).toContain('Ты выиграл');

    Math.random.mockRestore();
  });

  test('партия на hard завершается', async () => {
    await handleMessage('/new_game hard', reply, 60);
    await handleMessage('/move a1', reply, 60);
    await handleMessage('/move a2', reply, 60);
    await handleMessage('/move a3', reply, 60);
    await handleMessage('/move b1', reply, 60);
    await handleMessage('/move b3', reply, 60);
    await handleMessage('/move c1', reply, 60);
    await handleMessage('/move c3', reply, 60);

    const allReplies = reply.mock.calls.map((c) => c[0]).join('\n');
    const finished = allReplies.includes('Бот выиграл') || allReplies.includes('Ничья');
    expect(finished).toBe(true);
  });
});