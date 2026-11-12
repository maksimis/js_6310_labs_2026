import { describe, test, expect, jest, beforeEach } from '@jest/globals';

import handleMessage from '../src/handlers/messageHandler.js';

import {
  _resetStore,
  createSurvey,
  getUserState,
  getResults
} from '../src/services/surveyService.js';

describe('Message handler', () => {
  beforeEach(() => {
    _resetStore();
  });

  test('replies to /start', async () => {
    const reply = jest.fn();

    await handleMessage('/start', reply, 'test', '1');

    expect(reply).toHaveBeenCalledWith(
      expect.stringContaining('SurveyBot')
    );
  });

  test('creates survey step by step', async () => {
    const reply = jest.fn();

    await handleMessage('/create_survey', reply, 'test', '1');
    expect(reply).toHaveBeenCalledWith('Введите тему опроса:');

    await handleMessage('My Topic', reply, 'test', '1');
    expect(reply).toHaveBeenCalledWith(
      'Тема сохранена. Введите первый вопрос:'
    );

    await handleMessage('Q1', reply, 'test', '1');
    expect(reply).toHaveBeenCalledWith(
      'Введите варианты ответов через запятую:'
    );

    await handleMessage('A, B', reply, 'test', '1');

    expect(reply).toHaveBeenCalledWith(
      expect.stringContaining('Опрос создан!')
    );

    expect(getUserState('test', '1').state).toBe('IDLE');
  });

  test('unknown command is not saved as topic', async () => {
    const reply = jest.fn();

    await handleMessage('/create_survey', reply, 'test', '1');
    await handleMessage('/unknown', reply, 'test', '1');

    expect(reply).toHaveBeenCalledWith(
      'Неизвестная команда. Введите /start.'
    );

    expect(getUserState('test', '1').state).toBe(
      'CREATE_SURVEY_TOPIC'
    );

    expect(getUserState('test', '1').data.topic).toBeUndefined();
  });

  test('rejects empty topic and question', async () => {
    const reply = jest.fn();

    await handleMessage('/create_survey', reply, 'test', '1');
    await handleMessage(' ', reply, 'test', '1');

    expect(getUserState('test', '1').state).toBe(
      'CREATE_SURVEY_TOPIC'
    );

    await handleMessage('Topic', reply, 'test', '1');
    await handleMessage(' ', reply, 'test', '1');

    expect(getUserState('test', '1').state).toBe(
      'CREATE_SURVEY_QUESTION'
    );
  });

  test('rejects fewer than two options', async () => {
    const reply = jest.fn();

    await handleMessage('/create_survey', reply, 'test', '1');
    await handleMessage('Topic', reply, 'test', '1');
    await handleMessage('Q', reply, 'test', '1');
    await handleMessage('A', reply, 'test', '1');

    expect(getUserState('test', '1').state).toBe(
      'CREATE_SURVEY_OPTIONS'
    );

    expect(reply).toHaveBeenCalledWith(
      'Нужно минимум 2 варианта. Попробуйте снова:'
    );
  });

  test('handles missing text', async () => {
    const reply = jest.fn();

    await handleMessage(undefined, reply, 'test', '1');

    expect(reply).toHaveBeenCalledWith(
      'Неизвестная команда. Введите /start.'
    );
  });

  test('supports lowercase survey code', async () => {
    const { id, code } = createSurvey(
      'Vote Test',
      [{ question: 'Q', options: ['Yes', 'No'] }]
    );

    const reply = jest.fn();

    await handleMessage('/vote', reply, 'telegram', '1');
    await handleMessage(code.toLowerCase(), reply, 'telegram', '1');

    expect(reply).toHaveBeenCalledWith(
      expect.stringContaining('Вопрос 1')
    );

    await handleMessage('invalid', reply, 'telegram', '1');

    expect(getUserState('telegram', '1').state).toBe(
      'VOTE_ANSWERING'
    );

    await handleMessage('Yes', reply, 'telegram', '1');

    expect(reply).toHaveBeenCalledWith(
      'Спасибо! Ваш голос принят.'
    );

    expect(getResults(id).total).toBe(1);
  });

  test('prevents duplicate voting', async () => {
    const { id, code } = createSurvey(
      'Vote Test',
      [{ question: 'Q', options: ['Yes', 'No'] }]
    );

    const reply = jest.fn();

    for (let i = 0; i < 2; i++) {
      await handleMessage('/vote', reply, 'telegram', '1');
      await handleMessage(code, reply, 'telegram', '1');
      await handleMessage('Yes', reply, 'telegram', '1');
    }

    expect(reply).toHaveBeenCalledWith(
      'Вы уже голосовали в этом опросе.'
    );

    expect(getResults(id).total).toBe(1);
  });

  test('returns results by lowercase code', async () => {
    const { code } = createSurvey(
      'Survey',
      [{ question: 'Q', options: ['A', 'B'] }]
    );

    const reply = jest.fn();

    await handleMessage('/results', reply, 'test', '1');
    await handleMessage(code.toLowerCase(), reply, 'test', '1');

    expect(reply).toHaveBeenCalledWith(
      expect.stringContaining('Всего голосов: 0')
    );

    expect(getUserState('test', '1').state).toBe('IDLE');
  });

  test('/start resets conversation', async () => {
    const reply = jest.fn();

    await handleMessage('/vote', reply, 'test', '1');
    await handleMessage('/start', reply, 'test', '1');

    expect(getUserState('test', '1').state).toBe('IDLE');
  });
});