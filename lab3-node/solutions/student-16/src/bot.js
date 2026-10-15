import TelegramBot from 'node-telegram-bot-api';
import { config } from './config.js';
import { getSession, resetSession, STEPS } from './state.js';
import {
  MODE_KEYBOARD,
  topicKeyboard,
  handleNewQuiz,
  handleModeChoice,
  handleTopicChoice,
  handleCancel,
} from './handlers/newQuiz.js';
import { handleScore } from './handlers/score.js';
import { handleRecords } from './handlers/records.js';
import { submitAnswer, formatQuestion, answerKeyboard } from './quiz.js';
import { addRecord } from './records.js';

// Главное меню (кнопки)
export const MAIN_MENU = {
  reply_markup: {
    keyboard: [
      [{ text: '🎮 Новая игра' }],
      [{ text: '📊 Мой счёт' }, { text: '🏆 Рекорды' }],
      [{ text: 'ℹ️ Помощь' }],
    ],
    resize_keyboard: true,
    is_persistent: true,
  },
};

const HELP_TEXT = [
  'Привет! Я бот-викторина.',
  '',
  'Что я умею:',
  '🎮 Новая игра — начать викторину',
  '📊 Мой счёт — текущий счёт сессии',
  '🏆 Рекорды — таблица лучших результатов',
  'ℹ️ Помощь — это сообщение',
  '',
  'Всё управляется кнопками.',
].join('\n');

export function createBot(token = config.telegramToken) {
  if (!token) {
    throw new Error('Bot token is required');
  }
  const bot = new TelegramBot(token, { polling: true });

  // /start и /help
  bot.onText(/^\/(start|help)/, async (msg) => {
    resetSession(msg.from.id);
    await bot.sendMessage(msg.chat.id, HELP_TEXT, MAIN_MENU);
  });

  bot.onText(/\/new_quiz/, async (msg) => {
    const session = resetSession(msg.from.id);
    const res = handleNewQuiz(session);
    await bot.sendMessage(msg.chat.id, res.text, res.options);
  });

  bot.onText(/\/score/, async (msg) => {
    const session = getSession(msg.from.id);
    await bot.sendMessage(msg.chat.id, handleScore(session), MAIN_MENU);
  });

  bot.onText(/\/records/, async (msg) => {
    const text = await handleRecords();
    await bot.sendMessage(msg.chat.id, text, MAIN_MENU);
  });

  // Inline-кнопки: режим, тема, варианты ответа, отмена
  bot.on('callback_query', async (query) => {
    const userId = query.from.id;
    const chatId = query.message.chat.id;
    const data = query.data || '';
    const session = getSession(userId);

    await bot.answerCallbackQuery(query.id).catch(() => {});

    // Отмена
    if (data === 'cancel') {
      const res = handleCancel(session);
      await bot.sendMessage(chatId, res.text, MAIN_MENU);
      return;
    }

    // Выбор режима
    if (data.startsWith('mode:')) {
      const res = handleModeChoice(session, data);
      await bot.sendMessage(chatId, res.text, res.options);
      return;
    }

    // Выбор темы
    if (data.startsWith('topic:')) {
      const res = handleTopicChoice(session, data);
      await bot.sendMessage(chatId, res.text, res.options);
      return;
    }

    // Ответ на вопрос
    if (data.startsWith('answer:')) {
      if (session.step !== STEPS.QUESTION || !session.quiz) {
        await bot.sendMessage(chatId, 'Сессия неактивна. Начните игру заново.', MAIN_MENU);
        return;
      }
      const raw = data.slice('answer:'.length); // индекс варианта (1-based)
      const result = submitAnswer(session.quiz, raw);

      let reply = result.correct ? '✅ Верно!' : '❌ Неверно.';

      if (result.finished) {
        const quiz = result.quiz;
        reply += `\nИгра окончена. Счёт: ${quiz.score}/${quiz.questions.length}`;
        session.step = STEPS.FINISHED;
        await addRecord({
          name: query.from.username || query.from.first_name || 'anonymous',
          score: quiz.score,
          topic: quiz.topic,
          mode: quiz.mode,
        }).catch(() => {});
        await bot.sendMessage(chatId, reply, MAIN_MENU);
      } else {
        const next = result.quiz;
        reply += `\n\n${formatQuestion(next)}`;
        await bot.sendMessage(chatId, reply, answerKeyboard(next));
      }
      return;
    }

    await bot.sendMessage(chatId, 'Неизвестное действие.', MAIN_MENU);
  });

  bot.on('message', async (msg) => {
    if (!msg.text || msg.text.startsWith('/')) {
      return;
    }
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text.trim();

    // Кнопки главного меню
    if (text === '🎮 Новая игра') {
      const session = resetSession(userId);
      const res = handleNewQuiz(session);
      await bot.sendMessage(chatId, res.text, res.options);
      return;
    }

    if (text === '📊 Мой счёт') {
      const session = getSession(userId);
      await bot.sendMessage(chatId, handleScore(session), MAIN_MENU);
      return;
    }

    if (text === '🏆 Рекорды') {
      const text2 = await handleRecords();
      await bot.sendMessage(chatId, text2, MAIN_MENU);
      return;
    }

    if (text === 'ℹ️ Помощь') {
      await bot.sendMessage(chatId, HELP_TEXT, MAIN_MENU);
      return;
    }

    const session = getSession(userId);
    if (
      session.step !== STEPS.QUESTION ||
      !session.quiz ||
      session.quiz.mode !== 'open'
    ) {
      return;
    }

    const result = submitAnswer(session.quiz, text);
    let reply = result.correct ? '✅ Верно!' : '❌ Неверно.';

    if (result.finished) {
      const quiz = result.quiz;
      reply += `\nИгра окончена. Счёт: ${quiz.score}/${quiz.questions.length}`;
      session.step = STEPS.FINISHED;
      await addRecord({
        name: msg.from.username || msg.from.first_name || 'anonymous',
        score: quiz.score,
        topic: quiz.topic,
        mode: quiz.mode,
      }).catch(() => {});
      await bot.sendMessage(chatId, reply, MAIN_MENU);
    } else {
      const next = result.quiz;
      reply += `\n\n${formatQuestion(next)}`;
      await bot.sendMessage(chatId, reply);
    }
  });

  bot.on('polling_error', (err) => {
    console.error('Polling error:', err.message);
  });

  return bot;
}