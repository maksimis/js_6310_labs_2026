import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import handleMessage from '../src/handlers/messageHandler.js';
import { getUser, clearStore } from '../src/store.js';

// Названия стартовых рецептов берём из хранилища, чтобы тесты не зависели от них
const names = getUser('defaults').recipes.map((recipe) => recipe.name);
clearStore();

const send = async (userId, text) => {
  const reply = jest.fn();
  await handleMessage(userId, text, reply);
  return reply;
};

const lastText = (reply) => reply.mock.calls.at(-1)[0];

describe('Message handler', () => {
  beforeEach(() => clearStore());

  test('игнорирует пустой и нетекстовый ввод', async () => {
    expect((await send(1, undefined)).mock.calls).toHaveLength(0);
    expect((await send(1, '   ')).mock.calls).toHaveLength(0);
    expect((await send(1, 42)).mock.calls).toHaveLength(0);
  });

  test('/start и /help показывают список команд', async () => {
    expect(lastText(await send(1, '/start'))).toContain('RecipeBot');
    expect(lastText(await send(1, '/help'))).toContain('/shopping_list');
  });

  test('неизвестная команда', async () => {
    expect(lastText(await send(1, '/foo'))).toContain('Неизвестная команда');
  });

  test('обычный текст вне сценария', async () => {
    expect(lastText(await send(1, 'привет'))).toContain('/help');
  });

  test('слишком длинное сообщение', async () => {
    expect(lastText(await send(1, 'а'.repeat(1001)))).toContain('слишком длинное');
  });

  test('ошибка в reply не роняет обработчик', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const reply = jest.fn().mockRejectedValue(new Error('network'));
    await expect(handleMessage(1, '/help', reply)).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('/recipes', () => {
  beforeEach(() => clearStore());

  test('показывает стартовые рецепты', async () => {
    expect(lastText(await send(1, '/recipes'))).toContain(`1. ${names[0]}`);
  });

  test('показывает подробности рецепта', async () => {
    const text = lastText(await send(1, '/recipes 1'));
    expect(text).toContain('Ингредиенты:');
    expect(text).toContain('Шаги:');
  });

  test('сообщает о неверном номере', async () => {
    expect(lastText(await send(1, '/recipes 99'))).toContain('нет');
    expect(lastText(await send(1, '/recipes abc'))).toContain('нет');
  });

  test('добавляет рецепт по шагам', async () => {
    const number = names.length + 1;
    expect(lastText(await send(1, '/recipes add'))).toContain('название');
    expect(lastText(await send(1, 'Борщ'))).toContain('ингредиенты');
    expect(lastText(await send(1, 'свёкла - 2 шт\nкапуста - 300 г'))).toContain('шаги');
    expect(lastText(await send(1, 'Сварить\nПодать'))).toContain('добавлен');
    expect(lastText(await send(1, '/recipes'))).toContain(`${number}. Борщ`);
    expect(lastText(await send(1, `/recipes ${number}`))).toContain('• свёкла — 2 шт');
  });

  test('при неверном вводе остаётся на том же шаге', async () => {
    await send(1, '/recipes add');
    expect(lastText(await send(1, 'а'.repeat(51)))).toContain('слишком длинное');
    await send(1, 'Борщ');
    expect(lastText(await send(1, 'мусор'))).toContain('Строка 1');
    await send(1, 'свёкла - 2 шт');
    expect(lastText(await send(1, 'а'.repeat(201)))).toContain('слишком длинный');
    expect(lastText(await send(1, 'Сварить'))).toContain('добавлен');
  });

  test('не даёт добавить рецепт с повторяющимся названием', async () => {
    await send(1, '/recipes add');
    expect(lastText(await send(1, names[0].toLowerCase()))).toContain('уже есть');
  });

  test('/cancel прерывает добавление', async () => {
    await send(1, '/recipes add');
    await send(1, '/cancel');
    expect(lastText(await send(1, 'Борщ'))).toContain('/help');
  });

  test('другая команда прерывает добавление', async () => {
    await send(1, '/recipes add');
    await send(1, '/help');
    expect(lastText(await send(1, 'Борщ'))).toContain('/help');
  });

  test('пользователи не мешают друг другу', async () => {
    await send(1, '/recipes add');
    await send(1, 'Борщ');
    expect(lastText(await send(2, 'Суп'))).toContain('/help');
    await send(2, '/recipes add');
    expect(lastText(await send(1, 'свёкла - 2 шт'))).toContain('шаги');
    expect(lastText(await send(2, '/recipes'))).not.toContain('Борщ');
  });
});