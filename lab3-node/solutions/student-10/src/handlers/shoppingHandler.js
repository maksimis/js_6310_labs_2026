import { STATES, transition, reset } from '../fsm.js';
import { DAYS, parseDays, parseNumbers, buildShoppingList } from '../utils/index.js';

const LIST_HINT =
  'Отправьте номера купленных товаров через пробел (например: 1 3), ' +
  'чтобы отметить или снять отметку. «готово» — завершить.';

// Список покупок, сгруппированный по категориям (товары уже отсортированы)
const formatShoppingList = ({ days, items }) => {
  const lines = [`Список покупок (${days.join(', ')}):`];
  let category = null;
  items.forEach((item, i) => {
    if (item.category !== category) {
      category = item.category;
      lines.push('', category);
    }
    const mark = item.bought ? '✅' : '⬜';
    lines.push(`${i + 1}. ${mark} ${item.name} — ${item.amount} ${item.unit}`);
  });
  return lines.join('\n');
};

// Команда /shopping_list: предлагает выбрать дни из плана
export const handleShoppingCommand = async (user, args, reply) => {
  const planned = DAYS.filter((day) => user.plan[day]);
  if (planned.length === 0) {
    return reply('В плане на неделю пока нет блюд. Сначала назначьте их: /plan set');
  }
  transition(user, STATES.SHOP_DAYS);
  const lines = planned.map((day) => `${DAYS.indexOf(day) + 1}. ${day} — ${user.plan[day]}`);
  return reply(
    `Для каких дней составить список покупок?\n${lines.join('\n')}\n\n` +
    'Отправьте номера или названия дней через пробел, например: 1 3. Или «все».'
  );
};

const onDays = async (user, text, reply) => {
  const parsed = parseDays(text);
  if (!parsed.ok) {
    return reply(parsed.error);
  }
  const days = parsed.value.filter((day) => user.plan[day]);
  if (days.length === 0) {
    return reply('На выбранные дни блюда не назначены. Выберите другие дни или /cancel.');
  }
  const recipes = days.map(
    (day) => user.recipes.find((recipe) => recipe.name === user.plan[day])
  );
  user.draft = { days, items: buildShoppingList(recipes) };
  transition(user, STATES.SHOP_LIST);
  return reply(`${formatShoppingList(user.draft)}\n\n${LIST_HINT}`);
};

const onList = async (user, text, reply) => {
  if (text.trim().toLowerCase() === 'готово') {
    reset(user);
    return reply('Готово! Хороших покупок.');
  }
  const { items } = user.draft;
  const parsed = parseNumbers(text, items.length);
  if (!parsed.ok) {
    return reply(`${parsed.error}\nИли «готово», чтобы завершить.`);
  }
  parsed.value.forEach((number) => {
    items[number - 1].bought = !items[number - 1].bought;
  });
  const message = formatShoppingList(user.draft);
  if (items.every((item) => item.bought)) {
    reset(user);
    return reply(`${message}\n\nВсё куплено! 🎉`);
  }
  return reply(`${message}\n\n${LIST_HINT}`);
};

const STEP_HANDLERS = {
  [STATES.SHOP_DAYS]: onDays,
  [STATES.SHOP_LIST]: onList,
};

// Обработка очередного сообщения, когда пользователь составляет список покупок
export const handleShoppingStep = (user, text, reply) =>
  STEP_HANDLERS[user.state](user, text, reply);