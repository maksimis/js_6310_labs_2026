'use strict';

import { addCard, getCardsForReview, getProgress, updateCardLevel, getCardById, getAllCards, LEVELS } from '../cards/cardManager.js';
import { STATES, getState, setState, resetState } from '../state/stateMachine.js';

const COMMANDS = {
  START: '/start',
  HELP: '/help',
  LEARN: '/learn',
  REPEAT: '/repeat',
  PROGRESS: '/progress',
  CANCEL: '/cancel'
};

const getHelpText = () => [
  'Доступные команды:',
  '/learn — учить новые слова',
  '/repeat — повторить слова по интервальному повторению',
  '/progress — посмотреть прогресс и добавить слова',
  '/cancel — отменить действие',
  '/help — справка'
].join('\n');

const handleLearn = async (userId, reply) => {
  const cardsToLearn = getCardsForReview(userId); // ДОБАВИЛИ userId
  if (cardsToLearn.length === 0) {
    await reply('Нет карточек для изучения. Добавьте слова через /progress.');
    return;
  }
  const card = cardsToLearn[0];
  setState(userId, STATES.LEARNING, { cardId: card.id, showTranslation: false });
  await reply(`Слово: ${card.word}\nНапишите что-нибудь, чтобы увидеть перевод.`);
};

const handleRepeat = async (userId, reply) => {
  const cardsToRepeat = getCardsForReview(userId); // ДОБАВИЛИ userId
  if (cardsToRepeat.length === 0) {
    await reply('Сейчас нет слов для повторения. Отдохните!');
    return;
  }
  const card = cardsToRepeat[0];
  setState(userId, STATES.LEARNING, { cardId: card.id, showTranslation: false });
  await reply(`Повторение: ${card.word}\nНапишите что-нибудь, чтобы увидеть перевод.`);
};

const handleProgress = async (userId, reply) => {
  const progress = getProgress(userId); // ДОБАВИЛИ userId
  const allCards = getAllCards(userId); // ДОБАВИЛИ userId
  if (progress.total === 0) {
    await reply('Ваша база пуста. Введите слово для добавления:');
    setState(userId, STATES.AWAITING_WORD);
    return;
  }
  let text = `Выучено слов: ${progress.learned} из ${progress.total}.\n\nПрогресс по словам:\n`;
  allCards.forEach((card) => {
    text += `- ${card.word} [${card.level}]\n`;
  });
  text += '\nЧтобы добавить новое слово, введите его:';
  await reply(text);
  setState(userId, STATES.AWAITING_WORD);
};

const handleLearning = async (userId, text, reply) => {
  const current = getState(userId);
  const { cardId, showTranslation } = current.data;
  
  if (!showTranslation) {
    setState(userId, STATES.LEARNING, { cardId, showTranslation: true });
    
    const card = getCardById(userId, cardId); // ДОБАВИЛИ userId
    await reply(`Перевод: ${card.translation}\nНапишите "выучил" или "трудно".`);
  } else {
    const lower = text.toLowerCase();
    if (lower.includes('выучил') || lower.includes('знаю')) {
      updateCardLevel(userId, cardId, LEVELS.LEARNED); // ДОБАВИЛИ userId
      await reply('Отлично! Слово выучено.');
    } else {
      updateCardLevel(userId, cardId, LEVELS.HARD); // ДОБАВИЛИ userId
      await reply('Ок, повторим позже.');
    }
    resetState(userId);
  }
};

const handleMessage = async (userId, text, reply) => {
  if (!text || typeof text !== 'string') return;
  const trimmed = text.trim();
  if (!trimmed) return;
  
  const current = getState(userId);
  
  if (current.state === STATES.LEARNING) {
    await handleLearning(userId, trimmed, reply);
    return;
  }
  
  if (current.state === STATES.AWAITING_WORD) {
    if (trimmed === COMMANDS.CANCEL) {
      resetState(userId);
      await reply('Отменено.');
      return;
    }
    setState(userId, STATES.AWAITING_TRANSLATION, { word: trimmed });
    await reply('Теперь введите перевод:');
    return;
  }
  
  if (current.state === STATES.AWAITING_TRANSLATION) {
    const word = current.data.word;
    addCard(userId, word, trimmed); // ДОБАВИЛИ userId
    resetState(userId);
    await reply(`Слово "${word}" сохранено!`);
    return;
  }
  
  if (trimmed === COMMANDS.START || trimmed === COMMANDS.HELP) {
    await reply(getHelpText());
  } else if (trimmed === COMMANDS.LEARN) {
    await handleLearn(userId, reply);
  } else if (trimmed === COMMANDS.REPEAT) {
    await handleRepeat(userId, reply);
  } else if (trimmed === COMMANDS.PROGRESS) {
    await handleProgress(userId, reply);
  } else {
    await reply('Неизвестная команда. Введите /help');
  }
};

export default handleMessage;