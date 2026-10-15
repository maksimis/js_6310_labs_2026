import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import handleMessage from '../src/handlers/messageHandler.js';
import { deleteGame } from '../src/game/gameState.js';

describe('messageHandler', () => {
  const userId = 'test-user';

  beforeEach(() => {
    deleteGame(userId);
  });

  test('/start replies with greeting', async () => {
    const reply = jest.fn();
    await handleMessage('/start', reply, userId);
    expect(reply).toHaveBeenCalled();
    expect(reply.mock.calls[0][0]).toContain('SimonBot');
  });

  test('/help replies with instructions', async () => {
    const reply = jest.fn();
    await handleMessage('/help', reply, userId);
    expect(reply).toHaveBeenCalled();
  });

  test('/new_game asks for difficulty', async () => {
    const reply = jest.fn();
    await handleMessage('/new_game', reply, userId);
    expect(reply).toHaveBeenCalled();
    expect(reply.mock.calls[0][0]).toContain('сложность');
  });

  test('choosing difficulty 1 creates easy game', async () => {
    const reply = jest.fn();
    await handleMessage('/new_game', reply, userId);
    await handleMessage('1', reply, userId);
    expect(reply).toHaveBeenCalledTimes(2);
    expect(reply.mock.calls[1][0]).toContain('лёгкая');
  });

  test('choosing difficulty 2 creates medium game', async () => {
    const reply = jest.fn();
    await handleMessage('/new_game', reply, userId);
    await handleMessage('2', reply, userId);
    expect(reply.mock.calls[1][0]).toContain('средняя');
  });

  test('choosing difficulty 3 creates hard game', async () => {
    const reply = jest.fn();
    await handleMessage('/new_game', reply, userId);
    await handleMessage('3', reply, userId);
    expect(reply.mock.calls[1][0]).toContain('сложная');
  });

  test('invalid difficulty replies with error', async () => {
    const reply = jest.fn();
    await handleMessage('/new_game', reply, userId);
    await handleMessage('99', reply, userId);
    expect(reply.mock.calls[1][0]).toContain('1, 2 или 3');
  });

  test('/sequence without game replies error', async () => {
    const reply = jest.fn();
    await handleMessage('/sequence', reply, userId);
    expect(reply.mock.calls[0][0]).toContain('Сначала начни игру');
  });

  test('/sequence with game shows sequence', async () => {
    const reply = jest.fn();
    await handleMessage('/new_game', reply, userId);
    await handleMessage('1', reply, userId);
    await handleMessage('/sequence', reply, userId);
    expect(reply.mock.calls[2][0]).toContain('Последовательность');
  });

  test('/guess without game replies error', async () => {
    const reply = jest.fn();
    await handleMessage('/guess red', reply, userId);
    expect(reply.mock.calls[0][0]).toContain('Сначала начни игру');
  });

  test('/guess with invalid color replies error', async () => {
    const reply = jest.fn();
    await handleMessage('/new_game', reply, userId);
    await handleMessage('1', reply, userId);
    await handleMessage('/guess invalid', reply, userId);
    expect(reply.mock.calls[2][0]).toContain('Неверный цвет');
  });

  test('/guess without color replies error', async () => {
    const reply = jest.fn();
    await handleMessage('/new_game', reply, userId);
    await handleMessage('1', reply, userId);
    await handleMessage('/guess', reply, userId);
    expect(reply.mock.calls[2][0]).toContain('Укажи цвет');
  });

  test('unknown command replies error', async () => {
    const reply = jest.fn();
    await handleMessage('/unknown', reply, userId);
    expect(reply.mock.calls[0][0]).toContain('Неизвестная команда');
  });

  test('empty text does nothing', async () => {
    const reply = jest.fn();
    await handleMessage('', reply, userId);
    expect(reply).not.toHaveBeenCalled();
  });

  test('null text does nothing', async () => {
    const reply = jest.fn();
    await handleMessage(null, reply, userId);
    expect(reply).not.toHaveBeenCalled();
  });
});