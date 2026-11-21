import { getUser } from '../store.js';
import { reset } from '../fsm.js';
import { handleRecipesCommand, handleRecipeStep } from './recipesHandler.js';
import { handlePlanCommand, handlePlanStep } from './planHandler.js';
import { handleShoppingCommand, handleShoppingStep } from './shoppingHandler.js';

const MAX_TEXT_LENGTH = 1000;

const HELP = [
  'Команды:',
  '/recipes — список рецептов (/recipes 1 — подробности, /recipes add — добавить свой)',
  '/plan — план на неделю (/plan set — назначить блюдо, /plan clear — очистить)',
  '/shopping_list — список покупок',
  '/cancel — отменить текущее действие',
].join('\n');

const COMMANDS = {
  '/start': (user, args, reply) =>
    reply(`Привет! Я RecipeBot — создан для удобного планирования меню и списка покупок\n\n${HELP}`),
  '/help': (user, args, reply) => reply(HELP),
  '/cancel': (user, args, reply) => reply('Текущее действие отменено.'),
  '/recipes': handleRecipesCommand,
  '/plan': handlePlanCommand,
  '/shopping_list': handleShoppingCommand,
};

// Обработчики шагов по префиксу состояния (RECIPE_NAME -> RECIPE)
const STEP_HANDLERS = {
  RECIPE: handleRecipeStep,
  PLAN: handlePlanStep,
  SHOP: handleShoppingStep,
};

// Общий обработчик текстового сообщения от пользователя userId
const handleMessage = async (userId, text, reply) => {
  if (typeof text !== 'string' || !text.trim()) {
    return;
  }

  try {
    if (text.length > MAX_TEXT_LENGTH) {
      await reply(`Сообщение слишком длинное (максимум ${MAX_TEXT_LENGTH} символов).`);
      return;
    }

    const user = getUser(userId);
    const [first, ...args] = text.trim().split(/\s+/);

    // Любая команда прерывает текущее действие
    if (first.startsWith('/')) {
      reset(user);
      const command = COMMANDS[first.toLowerCase()];
      await (command
        ? command(user, args, reply)
        : reply('Неизвестная команда. Список команд: /help'));
      return;
    }

    const stepHandler = STEP_HANDLERS[user.state.split('_')[0]];
    await (stepHandler
      ? stepHandler(user, text, reply)
      : reply('Не понимаю. Список команд: /help'));
  } catch (error) {
    console.error('Ошибка обработки сообщения:', error.message);
  }
};

export default handleMessage;