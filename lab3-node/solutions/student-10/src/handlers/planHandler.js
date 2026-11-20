import { STATES, transition, reset } from '../fsm.js';
import { DAYS, parseDay, parseIndex } from '../utils/index.js';

const formatPlan = (plan) => [
  'План на неделю:',
  ...DAYS.map((day, i) => `${i + 1}. ${day} — ${plan[day] ?? 'не назначено'}`),
].join('\n');

// Команда /plan: показать план, назначить блюдо или очистить план
export const handlePlanCommand = async (user, args, reply) => {
  const [arg] = args;
  if (arg === undefined) {
    return reply(`${formatPlan(user.plan)}\n\nНазначить блюдо: /plan set\nОчистить план: /plan clear`);
  }
  const action = arg.toLowerCase();
  if (action === 'set') {
    transition(user, STATES.PLAN_DAY);
    return reply(
      `${formatPlan(user.plan)}\n\n` +
      'На какой день назначить блюдо? Отправьте номер (1-7) или название дня.'
    );
  }
  if (action === 'clear') {
    user.plan = {};
    return reply('План очищен.');
  }
  return reply('Неизвестное действие. Доступно: /plan, /plan set, /plan clear');
};

const onDay = async (user, text, reply) => {
  const day = parseDay(text);
  if (day === null) {
    return reply('Не понял день. Отправьте номер от 1 до 7 или название, например «вторник».');
  }
  user.draft = { day };
  transition(user, STATES.PLAN_RECIPE);
  const list = user.recipes.map((recipe, i) => `${i + 1}. ${recipe.name}`).join('\n');
  return reply(`Какой рецепт назначить на день «${day}»? Отправьте номер:\n${list}`);
};

const onRecipe = async (user, text, reply) => {
  const index = parseIndex(text, user.recipes.length);
  if (index === null) {
    return reply('Нет такого рецепта. Отправьте номер из списка.');
  }
  const { day } = user.draft;
  const recipe = user.recipes[index - 1];
  user.plan[day] = recipe.name;
  reset(user);
  return reply(`Назначено: ${day} — ${recipe.name}. План: /plan`);
};

const STEP_HANDLERS = {
  [STATES.PLAN_DAY]: onDay,
  [STATES.PLAN_RECIPE]: onRecipe,
};

// Обработка очередного сообщения, когда пользователь назначает блюдо на день
export const handlePlanStep = (user, text, reply) =>
  STEP_HANDLERS[user.state](user, text, reply);