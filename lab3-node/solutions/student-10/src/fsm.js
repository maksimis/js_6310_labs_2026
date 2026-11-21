export const STATES = {
  IDLE: 'IDLE',
  RECIPE_NAME: 'RECIPE_NAME',
  RECIPE_INGREDIENTS: 'RECIPE_INGREDIENTS',
  RECIPE_STEPS: 'RECIPE_STEPS',
  PLAN_DAY: 'PLAN_DAY',
  PLAN_RECIPE: 'PLAN_RECIPE',
  SHOP_DAYS: 'SHOP_DAYS',
  SHOP_LIST: 'SHOP_LIST',
};

const TRANSITIONS = {
  IDLE: ['RECIPE_NAME', 'PLAN_DAY', 'SHOP_DAYS'],
  RECIPE_NAME: ['RECIPE_INGREDIENTS', 'IDLE'],
  RECIPE_INGREDIENTS: ['RECIPE_STEPS', 'IDLE'],
  RECIPE_STEPS: ['IDLE'],
  PLAN_DAY: ['PLAN_RECIPE', 'IDLE'],
  PLAN_RECIPE: ['IDLE'],
  SHOP_DAYS: ['SHOP_LIST', 'IDLE'],
  SHOP_LIST: ['IDLE'],
};

export const transition = (user, next) => {
  if (!TRANSITIONS[user.state].includes(next)) {
    throw new Error(`Недопустимый переход ${user.state} -> ${next}`);
  }
  user.state = next;
};

// Отмена доступна из любого состояния
export const reset = (user) => {
  user.state = STATES.IDLE;
  user.draft = {};
};