import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import handleMessage from '../src/handlers/messageHandler.js';
import { clearStore } from '../src/store.js';
import { parseDay } from '../src/utils/index.js';

const send = async (userId, text) => {
  const reply = jest.fn();
  await handleMessage(userId, text, reply);
  return reply;
};

const lastText = (reply) => reply.mock.calls.at(-1)[0];

describe('parseDay', () => {
  test('принимает номер дня', () => {
    expect(parseDay('3')).toBe('Среда');
  });

  test('принимает название дня в любом регистре', () => {
    expect(parseDay('  ВТОРНИК ')).toBe('Вторник');
  });

  test('возвращает null для неверного ввода', () => {
    expect(parseDay('8')).toBeNull();
    expect(parseDay('0')).toBeNull();
    expect(parseDay('завтра')).toBeNull();
  });
});

describe('/plan', () => {
  beforeEach(() => clearStore());

  test('показывает пустой план на неделю', async () => {
    const text = lastText(await send(1, '/plan'));
    expect(text).toContain('1. Понедельник — не назначено');
    expect(text).toContain('7. Воскресенье — не назначено');
  });

  test('назначает рецепт на день по шагам', async () => {
    expect(lastText(await send(1, '/plan set'))).toContain('На какой день');
    expect(lastText(await send(1, 'вторник'))).toContain('1. Омлет');
    expect(lastText(await send(1, '1'))).toContain('Назначено: Вторник — Омлет');
    expect(lastText(await send(1, '/plan'))).toContain('2. Вторник — Омлет');
  });

  test('можно выбрать день по номеру и перезаписать рецепт', async () => {
    await send(1, '/plan set');
    await send(1, '1');
    await send(1, '1');
    await send(1, '/plan set');
    await send(1, 'понедельник');
    await send(1, '2');
    expect(lastText(await send(1, '/plan'))).toContain('1. Понедельник — Салат овощной');
  });

  test('при неверном дне остаётся на том же шаге', async () => {
    await send(1, '/plan set');
    expect(lastText(await send(1, 'завтра'))).toContain('Не понял день');
    expect(lastText(await send(1, '5'))).toContain('Какой рецепт');
  });

  test('при неверном номере рецепта остаётся на том же шаге', async () => {
    await send(1, '/plan set');
    await send(1, '1');
    expect(lastText(await send(1, '99'))).toContain('Нет такого рецепта');
    expect(lastText(await send(1, 'abc'))).toContain('Нет такого рецепта');
    expect(lastText(await send(1, '3'))).toContain('Паста с курицей');
  });

  test('/plan clear очищает план', async () => {
    await send(1, '/plan set');
    await send(1, '1');
    await send(1, '1');
    expect(lastText(await send(1, '/plan clear'))).toContain('очищен');
    expect(lastText(await send(1, '/plan'))).toContain('1. Понедельник — не назначено');
  });

  test('неизвестное действие', async () => {
    expect(lastText(await send(1, '/plan foo'))).toContain('Неизвестное действие');
  });

  test('/cancel прерывает назначение', async () => {
    await send(1, '/plan set');
    await send(1, '/cancel');
    expect(lastText(await send(1, '1'))).toContain('/help');
  });

  test('планы пользователей не пересекаются', async () => {
    await send(1, '/plan set');
    await send(1, '1');
    await send(1, '1');
    expect(lastText(await send(2, '/plan'))).toContain('1. Понедельник — не назначено');
  });

  test('назначение использует рецепты самого пользователя', async () => {
    await send(1, '/recipes add');
    await send(1, 'Борщ');
    await send(1, 'свёкла - 2 шт');
    await send(1, 'Сварить');
    await send(1, '/plan set');
    await send(1, '1');
    expect(lastText(await send(1, '4'))).toContain('Понедельник — Борщ');
  });
});