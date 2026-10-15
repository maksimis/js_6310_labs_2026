import { startQuiz, formatQuestion, submitAnswer, answerKeyboard } from '../src/quiz.js';
import { checkAnswer, getQuestions } from '../src/questions.js';

describe('quiz', () => {
  test('startQuiz returns questions', () => {
    const quiz = startQuiz('general', 'choice');
    expect(quiz.questions.length).toBeGreaterThan(0);
    expect(quiz.score).toBe(0);
  });

  test('startQuiz throws on unknown topic', () => {
    expect(() => startQuiz('unknown', 'choice')).toThrow();
  });

  test('formatQuestion includes options for choice mode', () => {
    const quiz = startQuiz('general', 'choice');
    const text = formatQuestion(quiz);
    expect(text).toMatch(/1\)/);
  });

  test('formatQuestion works for open mode', () => {
    const quiz = startQuiz('general', 'open');
    const text = formatQuestion(quiz);
    expect(text).toMatch(/Вопрос 1/);
  });

  test('answerKeyboard returns inline buttons for choice', () => {
    const quiz = startQuiz('general', 'choice');
    const kb = answerKeyboard(quiz);
    expect(kb.reply_markup.inline_keyboard.length).toBeGreaterThan(0);
    expect(kb.reply_markup.inline_keyboard[0][0].callback_data).toMatch(/^answer:/);
  });

  test('answerKeyboard returns undefined for open', () => {
    const quiz = startQuiz('general', 'open');
    expect(answerKeyboard(quiz)).toBeUndefined();
  });

  test('submitAnswer counts correct answers', () => {
    const quiz = startQuiz('general', 'choice');
    const res = submitAnswer(quiz, String(quiz.questions[0].answer + 1));
    expect(res.correct).toBe(true);
    expect(quiz.score).toBe(1);
  });

  test('submitAnswer marks finished at the end', () => {
    const quiz = startQuiz('general', 'choice');
    quiz.questions.forEach((q) => submitAnswer(quiz, String(q.answer + 1)));
    expect(quiz.finished).toBe(true);
  });

  test('submitAnswer on finished quiz returns finished', () => {
    const quiz = startQuiz('general', 'choice');
    quiz.questions.forEach((q) => submitAnswer(quiz, String(q.answer + 1)));
    const res = submitAnswer(quiz, '1');
    expect(res.finished).toBe(true);
  });

  test('checkAnswer open mode is case insensitive', () => {
    const q = { answer: 'Токио' };
    expect(checkAnswer(q, ' токио ', 'open')).toBe(true);
    expect(checkAnswer(q, 'Париж', 'open')).toBe(false);
  });

  test('checkAnswer choice 1-based', () => {
    const q = { options: ['a', 'b'], answer: 0 };
    expect(checkAnswer(q, '1', 'choice')).toBe(true);  // первый вариант = индекс 0
    expect(checkAnswer(q, '2', 'choice')).toBe(false);
    expect(checkAnswer(q, 'abc', 'choice')).toBe(false);
  });

  test('getQuestions returns empty for unknown', () => {
    expect(getQuestions('nope', 'choice')).toEqual([]);
  });
});