import { STATES, transition, reset } from '../fsm.js';
import {
  validateName,
  parseIngredients,
  parseSteps,
  parseIndex,
} from '../utils/index.js';

const INGREDIENTS_PROMPT =
  'Отправьте ингредиенты, по одному на строку, в формате ' +
  '«название - количество единица», например:\nмолоко - 200 мл\nяйца - 3 шт';
const STEPS_PROMPT = 'Теперь отправьте шаги приготовления, по одному на строку:';

const formatList = (recipes) => [
  'Ваши рецепты:',
  ...recipes.map((recipe, i) => `${i + 1}. ${recipe.name}`),
  '',
  'Подробности: /recipes 1',
  'Добавить свой: /recipes add',
].join('\n');

const formatRecipe = (recipe) => [
  recipe.name,
  '',
  'Ингредиенты:',
  ...recipe.ingredients.map((i) => `• ${i.name} — ${i.amount} ${i.unit}`),
  '',
  'Шаги:',
  ...recipe.steps.map((step, i) => `${i + 1}. ${step}`),
].join('\n');

// Команда /recipes: список, подробности или начало добавления
export const handleRecipesCommand = async (user, args, reply) => {
  const [arg] = args;
  if (arg === undefined) {
    return reply(formatList(user.recipes));
  }
  if (arg.toLowerCase() === 'add') {
    transition(user, STATES.RECIPE_NAME);
    return reply('Введите название рецепта:');
  }
  const index = parseIndex(arg, user.recipes.length);
  if (index === null) {
    return reply(`Рецепта «${arg}» нет. Список рецептов: /recipes`);
  }
  return reply(formatRecipe(user.recipes[index - 1]));
};

const onName = async (user, text, reply) => {
  const result = validateName(text);
  if (!result.ok) {
    return reply(result.error);
  }
  const exists = user.recipes.some(
    (recipe) => recipe.name.toLowerCase() === result.value.toLowerCase()
  );
  if (exists) {
    return reply('Рецепт с таким названием уже есть. Введите другое название:');
  }
  user.draft = { name: result.value };
  transition(user, STATES.RECIPE_INGREDIENTS);
  return reply(INGREDIENTS_PROMPT);
};

const onIngredients = async (user, text, reply) => {
  const result = parseIngredients(text);
  if (!result.ok) {
    return reply(result.error);
  }
  user.draft.ingredients = result.value;
  transition(user, STATES.RECIPE_STEPS);
  return reply(STEPS_PROMPT);
};

const onSteps = async (user, text, reply) => {
  const result = parseSteps(text);
  if (!result.ok) {
    return reply(result.error);
  }
  const recipe = { ...user.draft, steps: result.value };
  user.recipes.push(recipe);
  reset(user);
  return reply(`Рецепт «${recipe.name}» добавлен! Список: /recipes`);
};

const STEP_HANDLERS = {
  [STATES.RECIPE_NAME]: onName,
  [STATES.RECIPE_INGREDIENTS]: onIngredients,
  [STATES.RECIPE_STEPS]: onSteps,
};

// Обработка очередного сообщения, когда пользователь добавляет рецепт
export const handleRecipeStep = (user, text, reply) =>
  STEP_HANDLERS[user.state](user, text, reply);