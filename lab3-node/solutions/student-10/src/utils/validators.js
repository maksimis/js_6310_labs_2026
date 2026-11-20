import { DAYS } from './days.js';

const MAX_NAME = 50;
const MAX_INGREDIENTS = 30;
const MAX_STEPS = 20;
const MAX_STEP_LENGTH = 200;
const MAX_AMOUNT = 100000;
// «название - количество [единица]», например «молоко - 200 мл»
const INGREDIENT_RE = /^(.+?)\s*[-–—]\s*(\d+(?:[.,]\d+)?)\s*([^\d\s]+)?$/u;

const ok = (value) => ({ ok: true, value });
const fail = (error) => ({ ok: false, error });

const splitLines = (text) =>
  text.split('\n').map((line) => line.trim()).filter(Boolean);

export const validateName = (text) => {
  const name = text.trim();
  if (!name) {
    return fail('Название не может быть пустым.');
  }
  if (name.length > MAX_NAME) {
    return fail(`Название слишком длинное (максимум ${MAX_NAME} символов).`);
  }
  return ok(name);
};

export const parseIngredients = (text) => {
  const lines = splitLines(text);
  if (lines.length === 0) {
    return fail('Добавьте хотя бы один ингредиент.');
  }
  if (lines.length > MAX_INGREDIENTS) {
    return fail(`Слишком много ингредиентов (максимум ${MAX_INGREDIENTS}).`);
  }
  const result = [];
  for (const [index, line] of lines.entries()) {
    const match = INGREDIENT_RE.exec(line);
    const amount = match ? Number(match[2].replace(',', '.')) : 0;
    if (!match || amount <= 0 || amount > MAX_AMOUNT) {
      return fail(
        `Строка ${index + 1} не подходит: «${line}». ` +
        'Формат: название - количество единица, например «молоко - 200 мл».'
      );
    }
    result.push({
      name: match[1].trim().toLowerCase(),
      amount,
      unit: match[3] ?? 'шт',
    });
  }
  return ok(result);
};

export const parseSteps = (text) => {
  const steps = splitLines(text);
  if (steps.length === 0) {
    return fail('Добавьте хотя бы один шаг.');
  }
  if (steps.length > MAX_STEPS) {
    return fail(`Слишком много шагов (максимум ${MAX_STEPS}).`);
  }
  if (steps.some((step) => step.length > MAX_STEP_LENGTH)) {
    return fail(`Шаг слишком длинный (максимум ${MAX_STEP_LENGTH} символов).`);
  }
  return ok(steps);
};

// Возвращает число от 1 до max или null, если ввод некорректен
export const parseIndex = (text, max) => {
  const value = text.trim();
  const number = /^\d+$/.test(value) ? Number(value) : 0;
  return number >= 1 && number <= max ? number : null;
};

// Принимает номер дня (1-7) или его название, возвращает название дня или null
export const parseDay = (text) => {
  const index = parseIndex(text, DAYS.length);
  if (index !== null) {
    return DAYS[index - 1];
  }
  const name = text.trim().toLowerCase();
  return DAYS.find((day) => day.toLowerCase() === name) ?? null;
};


const splitTokens = (text) => text.split(/[\s,;]+/).filter(Boolean);

// Несколько дней: номера или названия через пробел либо «все»
export const parseDays = (text) => {
  const tokens = splitTokens(text.toLowerCase());
  if (tokens.length === 1 && ['все', 'всё', 'all'].includes(tokens[0])) {
    return ok([...DAYS]);
  }
  const days = tokens.map((token) => parseDay(token));
  if (tokens.length === 0 || days.includes(null)) {
    return fail(
      'Не понял дни. Отправьте номера (1-7) или названия через пробел, ' +
      'например: 1 3 5. Или «все».'
    );
  }
  return ok(DAYS.filter((day) => days.includes(day)));
};

// Несколько номеров от 1 до max через пробел или запятую
export const parseNumbers = (text, max) => {
  const tokens = splitTokens(text);
  const numbers = tokens.map((token) => parseIndex(token, max));
  if (tokens.length === 0 || numbers.includes(null)) {
    return fail(`Отправьте номера от 1 до ${max} через пробел, например: 1 3`);
  }
  return ok([...new Set(numbers)]);
};
