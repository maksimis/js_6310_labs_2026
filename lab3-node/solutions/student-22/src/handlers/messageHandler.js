import { ALGORITHMS, findAlgorithm } from '../sorting/algorithms.js';
import { parseArray } from '../utils/parseArray.js';
import {
  formatArray,
  formatAlgorithmList,
  formatComparison,
  formatSortResult,
} from '../utils/format.js';

// ----- Конечный автомат -----
// Состояния, в которых может находиться диалог с пользователем.
export const STATES = {
  IDLE: 'idle', // ждём команду
  WAIT_ARRAY: 'waitArray', // после /array ждём числа
  WAIT_ALGORITHM: 'waitAlgorithm', // после /sort ждём название алгоритма
  WAIT_COMPARE: 'waitCompare', // после /compare ждём два алгоритма
};

// Сессии пользователей: у каждого пользователя своё состояние и свой массив,
// поэтому команды разных пользователей не пересекаются.
const sessions = new Map();

export function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, { state: STATES.IDLE, array: null });
  }
  return sessions.get(userId);
}

// Нужна для тестов: очищает все сессии
export function resetSessions() {
  sessions.clear();
}

const HELP_TEXT = [
  'Я SortingBot — показываю сортировку массива по шагам.',
  '/array — задать массив чисел',
  '/sort — отсортировать массив выбранным алгоритмом',
  '/compare — сравнить два алгоритма',
].join('\n');

// ----- Команды (переходы из любого состояния) -----
async function handleCommand(session, command, reply) {
  switch (command) {
  case '/start':
  case '/help':
    session.state = STATES.IDLE;
    await reply(HELP_TEXT);
    return;

  case '/array':
    session.state = STATES.WAIT_ARRAY;
    await reply('Введите числа через пробел или запятую, например: 5 3 8 1');
    return;

  case '/sort':
    if (!session.array) {
      await reply('Сначала задайте массив командой /array');
      return;
    }
    session.state = STATES.WAIT_ALGORITHM;
    await reply(`Доступные алгоритмы:\n${formatAlgorithmList()}\nВведите название или номер.`);
    return;

  case '/compare':
    if (!session.array) {
      await reply('Сначала задайте массив командой /array');
      return;
    }
    session.state = STATES.WAIT_COMPARE;
    await reply(`Введите два алгоритма через пробел, например: пузырек быстрая\n${formatAlgorithmList()}`);
    return;

  default:
    await reply('Неизвестная команда. Список команд: /help');
  }
}

// ----- Обработчики состояний -----
async function onArrayInput(session, text, reply) {
  const { array, error } = parseArray(text);
  if (error) {
    await reply(error); // остаёмся в том же состоянии и ждём новый ввод
    return;
  }
  session.array = array;
  session.state = STATES.IDLE;
  await reply(`Активный массив: ${formatArray(array)}\nТеперь можно /sort или /compare`);
}

async function onAlgorithmInput(session, text, reply) {
  const key = findAlgorithm(text);
  if (!key) {
    await reply(`Не знаю такой алгоритм. Доступные:\n${formatAlgorithmList()}`);
    return;
  }
  const algorithm = ALGORITHMS[key];
  const result = algorithm.sort(session.array);
  session.state = STATES.IDLE;
  await reply(formatSortResult(algorithm.title, session.array, result));
}

async function onCompareInput(session, text, reply) {
  const names = text.split(/[\s,]+/).filter((name) => name !== '');
  const keys = names.map(findAlgorithm);

  if (keys.length !== 2 || keys.includes(null)) {
    await reply(`Нужно ввести ровно два алгоритма из списка:\n${formatAlgorithmList()}`);
    return;
  }
  if (keys[0] === keys[1]) {
    await reply('Выберите два разных алгоритма.');
    return;
  }

  const [first, second] = keys.map((key) => ({
    title: ALGORITHMS[key].title,
    ...ALGORITHMS[key].sort(session.array),
  }));
  session.state = STATES.IDLE;
  await reply(formatComparison(session.array, first, second));
}

// Какая функция обрабатывает обычный текст в каждом состоянии
const stateHandlers = {
  [STATES.WAIT_ARRAY]: onArrayInput,
  [STATES.WAIT_ALGORITHM]: onAlgorithmInput,
  [STATES.WAIT_COMPARE]: onCompareInput,
};

// ----- Главная функция -----
// userId — кто написал, text — текст сообщения, reply — функция отправки ответа
const handleMessage = async (userId, text, reply) => {
  if (typeof text !== 'string' || text.trim() === '') {
    await reply('Я понимаю только текстовые сообщения. Список команд: /help');
    return;
  }

  const session = getSession(userId);
  const message = text.trim();

  if (message.startsWith('/')) {
    await handleCommand(session, message, reply);
    return;
  }

  const stateHandler = stateHandlers[session.state];
  if (!stateHandler) {
    await reply(`Сначала выберите команду.\n${HELP_TEXT}`);
    return;
  }
  await stateHandler(session, message, reply);
};

export default handleMessage;
