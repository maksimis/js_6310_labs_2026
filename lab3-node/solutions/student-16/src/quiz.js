import { getQuestions, checkAnswer } from './questions.js';

export function startQuiz(topic, mode) {
  const questions = getQuestions(topic, mode);
  if (questions.length === 0) {
    throw new Error('No questions for this topic/mode');
  }
  return {
    topic,
    mode,
    questions,
    index: 0,
    score: 0,
    finished: false,
  };
}

export function formatQuestion(quiz) {
  const q = quiz.questions[quiz.index];
  if (quiz.mode === 'choice') {
    const options = q.options.map((opt, i) => `${i + 1}) ${opt}`).join('\n');
    return `Вопрос ${quiz.index + 1}/${quiz.questions.length}\n${q.q}\n\n${options}`;
  }
  return `Вопрос ${quiz.index + 1}/${quiz.questions.length}\n${q.q}`;
}

export function answerKeyboard(quiz) {
  const q = quiz.questions[quiz.index];
  if (quiz.mode !== 'choice' || !q) {
    return undefined;
  }
  const rows = q.options.map((opt, i) => ([
    { text: `${i + 1}. ${opt}`, callback_data: `answer:${i + 1}` },
  ]));
  rows.push([{ text: '❌ Отмена', callback_data: 'cancel' }]);
  return { reply_markup: { inline_keyboard: rows } };
}

export function submitAnswer(quiz, rawAnswer) {
  if (quiz.finished) {
    return { correct: false, finished: true, quiz };
  }
  const q = quiz.questions[quiz.index];
  const correct = checkAnswer(q, rawAnswer, quiz.mode);
  if (correct) {
    quiz.score += 1;
  }
  quiz.index += 1;
  if (quiz.index >= quiz.questions.length) {
    quiz.finished = true;
  }
  return { correct, finished: quiz.finished, quiz };
}