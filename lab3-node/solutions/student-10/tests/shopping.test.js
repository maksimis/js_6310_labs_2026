import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import handleMessage from '../src/handlers/messageHandler.js';
import { clearStore } from '../src/store.js';
import {
  categorize,
  buildShoppingList,
  parseDays,
  parseNumbers,
} from '../src/utils/index.js';

const send = async (userId, text) => {
  const reply = jest.fn();
  await handleMessage(userId, text, reply);
  return reply;
};

const lastText = (reply) => reply.mock.calls.at(-1)[0];

// Назначает рецепт с номером recipeNo на день dayNo
const assign = async (userId, dayNo, recipeNo) => {
  await send(userId, '/plan set');
  await send(userId, String(dayNo));
  await send(userId, String(recipeNo));
};

describe('categorize', () => {
  test('определяет категорию по ключевому слову', () => {
    expect(categorize('Помидоры')).toBe('Овощи и фрукты');
    expect(categorize('молоко')).toBe('Молочное и яйца');
    expect(categorize('курица')).toBe('Мясо и рыба');
    expect(categorize('макароны')).toBe('Бакалея');
    expect(categorize('сливочное масло')).toBe('Молочное и яйца');
  });

  test('неизвестный продукт попадает в «Прочее»', () => {
    expect(categorize('шоколад')).toBe('Прочее');
  });
});

describe('buildShoppingList', () => {
  const recipe = (...ingredients) => ({ ingredients });

  test('суммирует одинаковые продукты с одной единицей', () => {
    const items = buildShoppingList([
      recipe({ name: 'яйца', amount: 3, unit: 'шт' }),
      recipe({ name: 'яйца', amount: 2, unit: 'шт' }),
    ]);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ name: 'яйца', amount: 5, bought: false });
  });

  test('не суммирует продукты с разными единицами', () => {
    const items = buildShoppingList([
      recipe({ name: 'молоко', amount: 200, unit: 'мл' }),
      recipe({ name: 'молоко', amount: 1, unit: 'л' }),
    ]);
    expect(items).toHaveLength(2);
  });

  test('округляет дробные суммы', () => {
    const items = buildShoppingList([
      recipe({ name: 'мука', amount: 0.1, unit: 'кг' }),
      recipe({ name: 'мука', amount: 0.2, unit: 'кг' }),
    ]);
    expect(items[0].amount).toBe(0.3);
  });

  test('сортирует товары по порядку категорий', () => {
    const items = buildShoppingList([
      recipe(
        { name: 'шоколад', amount: 1, unit: 'шт' },
        { name: 'мука', amount: 1, unit: 'кг' },
        { name: 'молоко', amount: 1, unit: 'л' },
        { name: 'лук', amount: 1, unit: 'шт' }
      ),
    ]);
    expect(items.map((i) => i.category)).toEqual([
      'Овощи и фрукты',
      'Молочное и яйца',
      'Бакалея',
      'Прочее',
    ]);
  });
});

describe('parseDays', () => {
  test('разбирает номера и названия, убирает повторы, сортирует по неделе', () => {
    expect(parseDays('3, вторник 3').value).toEqual(['Вторник', 'Среда']);
  });

  test('«все» выбирает всю неделю', () => {
    expect(parseDays('Все').value).toHaveLength(7);
  });

  test('отклоняет неверный и пустой ввод', () => {
    expect(parseDays('1 завтра').ok).toBe(false);
    expect(parseDays(',').ok).toBe(false);
  });
});

describe('parseNumbers', () => {
  test('разбирает номера через пробел и запятую без повторов', () => {
    expect(parseNumbers('1, 3 3', 5).value).toEqual([1, 3]);
  });

  test('отклоняет неверный и пустой ввод', () => {
    expect(parseNumbers('1 9', 5).ok).toBe(false);
    expect(parseNumbers('abc', 5).ok).toBe(false);
    expect(parseNumbers(';', 5).ok).toBe(false);
  });
});

describe('/shopping_list', () => {
  beforeEach(() => clearStore());

  test('просит сначала составить план, если он пуст', async () => {
    expect(lastText(await send(1, '/shopping_list'))).toContain('/plan set');
    expect(lastText(await send(1, '1'))).toContain('/help');
  });

  test('предлагает только дни с назначенными блюдами', async () => {
    await assign(1, 1, 1);
    const text = lastText(await send(1, '/shopping_list'));
    expect(text).toContain('1. Понедельник — Омлет');
    expect(text).not.toContain('Вторник');
  });

  test('формирует список, сгруппированный по категориям', async () => {
    await assign(1, 1, 1);
    await assign(1, 2, 2);
    await send(1, '/shopping_list');
    const text = lastText(await send(1, '1 2'));
    expect(text).toContain('Список покупок (Понедельник, Вторник)');
    expect(text.indexOf('Овощи и фрукты')).toBeLessThan(text.indexOf('Молочное и яйца'));
    expect(text.indexOf('Молочное и яйца')).toBeLessThan(text.indexOf('Бакалея'));
    expect(text).toContain('1. ⬜ помидоры — 2 шт');
    expect(text).toContain('3. ⬜ яйца — 3 шт');
  });

  test('суммирует ингредиенты одинаковых блюд на разные дни', async () => {
    await assign(1, 1, 1);
    await assign(1, 3, 1);
    await send(1, '/shopping_list');
    expect(lastText(await send(1, 'все'))).toContain('яйца — 6 шт');
  });

  test('при неверных днях остаётся на том же шаге', async () => {
    await assign(1, 1, 1);
    await send(1, '/shopping_list');
    expect(lastText(await send(1, 'abc'))).toContain('Не понял дни');
    expect(lastText(await send(1, '5'))).toContain('не назначены');
    expect(lastText(await send(1, '1'))).toContain('Список покупок');
  });

  test('отмечает и снимает отметку о покупке', async () => {
    await assign(1, 1, 1);
    await send(1, '/shopping_list');
    await send(1, '1');
    expect(lastText(await send(1, '1 2'))).toContain('1. ✅');
    expect(lastText(await send(1, '1'))).toContain('1. ⬜');
  });

  test('при неверном номере остаётся на том же шаге', async () => {
    await assign(1, 1, 1);
    await send(1, '/shopping_list');
    await send(1, '1');
    expect(lastText(await send(1, '99'))).toContain('Отправьте номера от 1 до 3');
  });

  test('«готово» завершает работу со списком', async () => {
    await assign(1, 1, 1);
    await send(1, '/shopping_list');
    await send(1, '1');
    expect(lastText(await send(1, 'Готово'))).toContain('Готово');
    expect(lastText(await send(1, '1'))).toContain('/help');
  });

  test('когда всё куплено, сценарий завершается', async () => {
    await assign(1, 1, 1);
    await send(1, '/shopping_list');
    await send(1, '1');
    expect(lastText(await send(1, '1 2 3'))).toContain('Всё куплено');
    expect(lastText(await send(1, '1'))).toContain('/help');
  });

  test('/cancel прерывает составление списка', async () => {
    await assign(1, 1, 1);
    await send(1, '/shopping_list');
    await send(1, '/cancel');
    expect(lastText(await send(1, '1'))).toContain('/help');
  });

  test('списки пользователей не пересекаются', async () => {
    await assign(1, 1, 1);
    await send(1, '/shopping_list');
    await send(1, '1');
    await send(1, '1');
    expect(lastText(await send(2, '/shopping_list'))).toContain('/plan set');
    await assign(2, 1, 1);
    await send(2, '/shopping_list');
    expect(lastText(await send(2, '1'))).toContain('1. ⬜');
  });
});