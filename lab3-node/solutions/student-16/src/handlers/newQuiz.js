import { STEPS } from '../state.js';
import { TOPICS, MODES } from '../questions.js';
import { startQuiz, formatQuestion, answerKeyboard } from '../quiz.js';

export const MODE_KEYBOARD = {
  reply_markup: {
    inline_keyboard: [
      [{ text: MODES.choice, callback_data: 'mode:choice' }],
      [{ text: MODES.open, callback_data: 'mode:open' }],
      [{ text: '❌ Отмена', callback_data: 'cancel' }],
    ],
  },
};

export function topicKeyboard() {
  const rows = Object.entries(TOPICS).map(([key, label]) => ([
    { text: label, callback_data: `topic:${key}` },
  ]));
  rows.push([{ text: '❌ Отмена', callback_data: 'cancel' }]);
  return { reply_markup: { inline_keyboard: rows } };
}

export function handleNewQuiz(session) {
  session.step = STEPS.MODE;
  return { text: 'Выберите режим викторины:', options: MODE_KEYBOARD };
}

export function handleModeChoice(session, data) {
  const mode = data.split(':')[1];
  if (!Object.keys(MODES).includes(mode)) {
    return { text: 'Некорректный режим. Попробуйте снова.', options: MODE_KEYBOARD };
  }
  session.mode = mode;
  session.step = STEPS.TOPIC;
  return { text: 'Выберите тему:', options: topicKeyboard() };
}

export function handleTopicChoice(session, data) {
  const topic = data.split(':')[1];
  if (!Object.keys(TOPICS).includes(topic)) {
    return { text: 'Некорректная тема. Попробуйте снова.', options: topicKeyboard() };
  }
  const quiz = startQuiz(topic, session.mode);
  session.step = STEPS.QUESTION;
  session.quiz = quiz;

  if (quiz.mode === 'choice') {
    return { text: formatQuestion(quiz), options: answerKeyboard(quiz) };
  }
  return { text: formatQuestion(quiz) };
}

export function handleCancel(session) {
  session.step = STEPS.IDLE;
  session.quiz = null;
  session.mode = null;
  session.topic = null;
  return { text: 'Отменено. Возврат в меню.' };
}