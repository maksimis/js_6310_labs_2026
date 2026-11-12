import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import handleMessage, { STATES, getSession, resetSessions } from '../src/handlers/messageHandler.js';

// Отправляет сообщение и возвращает ответ бота
const send = async (userId, text) => {
  const reply = jest.fn();
  await handleMessage(userId, text, reply);
  return reply.mock.calls.map((call) => call[0]).join('\n');
};

describe('messageHandler', () => {
  beforeEach(() => {
    resetSessions();
  });

  test('/start shows help', async () => {
    expect(await send(1, '/start')).toContain('/array');
  });

  test('/array waits for numbers and saves the array', async () => {
    await send(1, '/array');
    expect(getSession(1).state).toBe(STATES.WAIT_ARRAY);

    const answer = await send(1, '5 3 8 1');
    expect(answer).toContain('[5, 3, 8, 1]');
    expect(getSession(1).array).toEqual([5, 3, 8, 1]);
    expect(getSession(1).state).toBe(STATES.IDLE);
  });

  test('wrong array keeps waiting', async () => {
    await send(1, '/array');
    const answer = await send(1, 'привет мир');
    expect(answer).toContain('только из чисел');
    expect(getSession(1).state).toBe(STATES.WAIT_ARRAY);
  });

  test('/sort and /compare need an array first', async () => {
    expect(await send(1, '/sort')).toContain('/array');
    expect(await send(1, '/compare')).toContain('/array');
    expect(getSession(1).state).toBe(STATES.IDLE);
  });

  test('/sort shows algorithms and sorts step by step', async () => {
    await send(1, '/array');
    await send(1, '3 2 1');

    const list = await send(1, '/sort');
    expect(list).toContain('Пузырёк');
    expect(list).toContain('Слиянием');
    expect(getSession(1).state).toBe(STATES.WAIT_ALGORITHM);

    const answer = await send(1, 'пузырёк');
    expect(answer).toContain('Шаг 1: [2, 3, 1]');
    expect(answer).toContain('Результат: [1, 2, 3]');
    expect(getSession(1).state).toBe(STATES.IDLE);
  });

  test('/sort with unknown algorithm keeps waiting', async () => {
    await send(1, '/array');
    await send(1, '3 2 1');
    await send(1, '/sort');
    expect(await send(1, 'пирамидальная')).toContain('Не знаю');
    expect(getSession(1).state).toBe(STATES.WAIT_ALGORITHM);
  });

  test('sorted array has no steps', async () => {
    await send(1, '/array');
    await send(1, '1 2 3');
    await send(1, '/sort');
    expect(await send(1, 'быстрая')).toContain('уже отсортирован');
  });

  test('/compare compares two algorithms', async () => {
    await send(1, '/array');
    await send(1, '1 2 3 4');
    await send(1, '/compare');
    const answer = await send(1, 'пузырек вставки');
    expect(answer).toContain('Пузырёк: сравнений 6, обменов 0');
    expect(answer).toContain('Вставки: сравнений 3, обменов 0');
    expect(answer).toContain('Меньше сравнений: Вставки');
    expect(answer).toContain('Меньше обменов: одинаково');
    expect(getSession(1).state).toBe(STATES.IDLE);
  });

  test('/compare shows the second algorithm as winner', async () => {
    await send(1, '/array');
    await send(1, '1 2 3 4');
    await send(1, '/compare');
    expect(await send(1, 'вставки пузырек')).toContain('Меньше сравнений: Вставки');
  });

  test('/compare validates input', async () => {
    await send(1, '/array');
    await send(1, '3 2 1');
    await send(1, '/compare');
    expect(await send(1, 'пузырек')).toContain('ровно два');
    expect(await send(1, 'пузырек абв')).toContain('ровно два');
    expect(await send(1, 'быстрая быстрая')).toContain('разных');
    expect(getSession(1).state).toBe(STATES.WAIT_COMPARE);
  });

  test('text without command shows help', async () => {
    expect(await send(1, 'привет')).toContain('Сначала выберите команду');
  });

  test('unknown command', async () => {
    expect(await send(1, '/hello')).toContain('Неизвестная команда');
  });

  test('non-text messages do not break the bot', async () => {
    expect(await send(1, undefined)).toContain('только текстовые');
    expect(await send(1, '   ')).toContain('только текстовые');
  });

  test('different users have independent state', async () => {
    await send(1, '/array');
    await send(1, '3 2 1');
    await send(2, '/array');

    expect(getSession(1).state).toBe(STATES.IDLE);
    expect(getSession(2).state).toBe(STATES.WAIT_ARRAY);
    expect(getSession(2).array).toBeNull();

    await send(2, '9 8');
    expect(getSession(1).array).toEqual([3, 2, 1]);
    expect(getSession(2).array).toEqual([9, 8]);
  });
});
