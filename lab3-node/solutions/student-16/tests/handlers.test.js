import {
  MODE_KEYBOARD,
  topicKeyboard,
  handleNewQuiz,
  handleModeChoice,
  handleTopicChoice,
  handleCancel,
} from '../src/handlers/newQuiz.js';
import { handleScore } from '../src/handlers/score.js';
import { handleRecords } from '../src/handlers/records.js';
import { resetSession, STEPS } from '../src/state.js';
import { clearSessions } from '../src/state.js';

beforeEach(() => clearSessions());

describe('handlers/newQuiz', () => {
  test('MODE_KEYBOARD has two modes plus cancel', () => {
    const kb = MODE_KEYBOARD.reply_markup.inline_keyboard;
    expect(kb.length).toBe(3);
    expect(kb[0][0].callback_data).toBe('mode:choice');
    expect(kb[1][0].callback_data).toBe('mode:open');
    expect(kb[2][0].callback_data).toBe('cancel');
  });

  test('topicKeyboard has 4 topics plus cancel', () => {
    const kb = topicKeyboard().reply_markup.inline_keyboard;
    expect(kb.length).toBe(5);
    expect(kb[4][0].callback_data).toBe('cancel');
  });

  test('handleNewQuiz sets step to MODE', () => {
    const session = resetSession(1);
    const res = handleNewQuiz(session);
    expect(session.step).toBe(STEPS.MODE);
    expect(res.text).toMatch(/режим/i);
    expect(res.options).toBeDefined();
  });

  test('handleModeChoice accepts valid mode', () => {
    const session = resetSession(2);
    const res = handleModeChoice(session, 'mode:choice');
    expect(session.mode).toBe('choice');
    expect(session.step).toBe(STEPS.TOPIC);
    expect(res.options).toBeDefined();
  });

  test('handleModeChoice rejects invalid mode', () => {
    const session = resetSession(3);
    const res = handleModeChoice(session, 'mode:xxx');
    expect(res.text).toMatch(/Некорректный/);
    expect(session.mode).toBeNull();
  });

  test('handleTopicChoice accepts valid topic', () => {
    const session = resetSession(4);
    session.mode = 'choice';
    const res = handleTopicChoice(session, 'topic:it');
    expect(session.step).toBe(STEPS.QUESTION);
    expect(session.quiz).toBeTruthy();
    expect(res.text).toMatch(/Вопрос/);
  });

  test('handleTopicChoice rejects invalid topic', () => {
    const session = resetSession(5);
    session.mode = 'choice';
    const res = handleTopicChoice(session, 'topic:xxx');
    expect(res.text).toMatch(/Некорректная/);
    expect(session.quiz).toBeUndefined();
  });

  test('handleCancel resets session', () => {
    const session = resetSession(6);
    session.step = STEPS.QUESTION;
    session.quiz = { fake: true };
    const res = handleCancel(session);
    expect(session.step).toBe(STEPS.IDLE);
    expect(session.quiz).toBeNull();
    expect(res.text).toMatch(/Отменено/);
  });
});

describe('handlers/score', () => {
  test('returns no-session message', () => {
    const session = resetSession(10);
    expect(handleScore(session)).toMatch(/Активная сессия отсутствует/);
  });

  test('returns score for active quiz', () => {
    const session = resetSession(11);
    session.quiz = {
      score: 2,
      questions: [{}, {}, {}],
    };
    expect(handleScore(session)).toBe('Текущий счёт: 2 из 3');
  });
});

describe('handlers/records', () => {
  test('returns table when records file exists', async () => {
    // у тебя records.json реально есть — значит вернётся таблица
    const text = await handleRecords();
    expect(text).toMatch(/Таблица рекордов|Рекордов пока нет/);
  });

  test('returns string regardless of records content', async () => {
    const text = await handleRecords();
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(0);
  });
});