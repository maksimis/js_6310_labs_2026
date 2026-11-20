import { categorize, CATEGORY_ORDER } from './categories.js';

const round = (number) => Math.round(number * 1000) / 1000;

// Собирает ингредиенты рецептов в список покупок: одинаковые продукты
// (с одной единицей измерения) суммируются, список сортируется по категориям
export const buildShoppingList = (recipes) => {
  const items = new Map();
  for (const { name, amount, unit } of recipes.flatMap((r) => r.ingredients)) {
    const key = `${name}|${unit}`;
    const item = items.get(key);
    if (item) {
      item.amount = round(item.amount + amount);
    } else {
      items.set(key, { name, amount, unit, category: categorize(name), bought: false });
    }
  }
  return [...items.values()].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
  );
};