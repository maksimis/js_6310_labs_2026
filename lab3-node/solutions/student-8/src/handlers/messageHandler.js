'use strict';

import {
  addFragment,
  searchFragments
} from '../knowledge/knowledgeBase.js';

import {
  STATES,
  getState,
  setState,
  resetState
} from '../state/stateMachine.js';

// Команды, которые понимает бот
const COMMANDS = {
  START: '/start',
  HELP: '/help',
  ASK: '/ask',
  ADD_KNOWLEDGE: '/add_knowledge',
  SEARCH: '/search',
  CANCEL: '/cancel'
};

// Текст помощи
function getHelpText() {
  return [
    'Доступные команды:',
    '/ask <вопрос> — задать вопрос по базе знаний',
    '/add_knowledge — добавить новый фрагмент',
    '/search <слова> — найти фрагменты по ключевым словам',
    '/cancel — отменить текущее действие',
    '/help — показать эту справку'
  ].join('\n');
}

// Обработка команды /ask
async function handleAsk(args, reply) {
  const query = args.trim();

  if (!query) {
    await reply('Использование: /ask <вопрос>');
    return;
  }

  const results = searchFragments(query);

  if (results.length === 0) {
    await reply(`По запросу "${query}" ничего не найдено.`);
    return;
  }

  const top = results.slice(0, 3);
  const lines = [`Найдено по запросу "${query}":`];

  top.forEach((item, index) => {
    lines.push('');
    lines.push(`${index + 1}. ${item.title} (релевантность: ${item.relevance})`);
    lines.push(item.content);
  });

  await reply(lines.join('\n'));
}

// Обработка команды /search
async function handleSearch(args, reply) {
  const query = args.trim();

  if (!query) {
    await reply('Использование: /search <ключевые слова>');
    return;
  }

  const results = searchFragments(query);

  if (results.length === 0) {
    await reply(`По запросу "${query}" ничего не найдено.`);
    return;
  }

  const lines = [`Результаты поиска по "${query}":`];
  results.forEach((item) => {
    lines.push(`- [${item.relevance}] ${item.title}`);
  });

  await reply(lines.join('\n'));
}

// Начало добавления фрагмента — переход в состояние AWAITING_TITLE
async function startAddKnowledge(userId, reply) {
  setState(userId, STATES.AWAITING_TITLE);
  await reply('Введите заголовок фрагмента (или /cancel для отмены):');
}

// Обработка ввода заголовка — переход в состояние AWAITING_CONTENT
async function handleTitleInput(userId, text, reply) {
  const title = text.trim();

  if (!title) {
    await reply('Заголовок не может быть пустым. Попробуйте ещё раз:');
    return;
  }

  setState(userId, STATES.AWAITING_CONTENT, title);
  await reply(`Заголовок: "${title}"\nТеперь введите текст фрагмента:`);
}

// Обработка ввода контента — добавление фрагмента и возврат в IDLE
async function handleContentInput(userId, text, reply) {
  const content = text.trim();

  if (!content) {
    await reply('Текст не может быть пустым. Попробуйте ещё раз:');
    return;
  }

  const current = getState(userId);
  const title = current.title;

  if (!title) {
    await reply('Что-то пошло не так. Начните заново: /add_knowledge');
    resetState(userId);
    return;
  }

  try {
    const fragment = addFragment(title, content);
    resetState(userId);
    await reply(`Фрагмент добавлен!\nID: ${fragment.id}\nЗаголовок: ${fragment.title}`);
  } catch (error) {
    resetState(userId);
    await reply(`Ошибка при добавлении: ${error.message}`);
  }
}

// Главный обработчик всех сообщений
// Возвращает объект: { userId, text, reply }
const handleMessage = async (userId, text, reply) => {
  // Проверка входных данных
  if (!text || typeof text !== 'string') {
    return;
  }

  const trimmed = text.trim();

  // Проверяем текущее состояние пользователя (конечный автомат)
  const current = getState(userId);

  // Если пользователь в середине диалога — обрабатываем ввод
  if (current.state === STATES.AWAITING_TITLE) {
    if (trimmed === COMMANDS.CANCEL) {
      resetState(userId);
      await reply('Действие отменено.');
      return;
    }
    await handleTitleInput(userId, trimmed, reply);
    return;
  }

  if (current.state === STATES.AWAITING_CONTENT) {
    if (trimmed === COMMANDS.CANCEL) {
      resetState(userId);
      await reply('Действие отменено.');
      return;
    }
    await handleContentInput(userId, trimmed, reply);
    return;
  }

  // Если состояние IDLE — обрабатываем команды
  if (trimmed === COMMANDS.START || trimmed === COMMANDS.HELP) {
    await reply(getHelpText());
    return;
  }

  if (trimmed === COMMANDS.ADD_KNOWLEDGE) {
    await startAddKnowledge(userId, reply);
    return;
  }

  if (trimmed.startsWith(COMMANDS.ASK)) {
    const args = trimmed.slice(COMMANDS.ASK.length);
    await handleAsk(args, reply);
    return;
  }

  if (trimmed.startsWith(COMMANDS.SEARCH)) {
    const args = trimmed.slice(COMMANDS.SEARCH.length);
    await handleSearch(args, reply);
    return;
  }

  if (trimmed === COMMANDS.CANCEL) {
    resetState(userId);
    await reply('Нечего отменять.');
    return;
  }

  // Если непонятная команда — подсказка
  await reply('Неизвестная команда. Введите /help для списка команд.');
};

export default handleMessage;