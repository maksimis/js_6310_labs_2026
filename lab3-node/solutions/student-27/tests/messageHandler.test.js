import handleMessage from '../src/handlers/messageHandler.js';
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { _resetStore } from '../src/services/surveyService.js';

describe('Message handler', () => {
  beforeEach(() => {
    _resetStore();
  });

  test('replies to /start', async () => {
    const reply = jest.fn();
    await handleMessage('/start', reply, 'test', '1');
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('SurveyBot'));
  });

  test('creates a survey flow', async () => {
    const reply = jest.fn();
    await handleMessage('/create_survey', reply, 'test', '1');
    expect(reply).toHaveBeenCalledWith('Введите тему опроса:');

    await handleMessage('My Topic', reply, 'test', '1');
    expect(reply).toHaveBeenCalledWith('Тема сохранена. Введите первый вопрос:');

    await handleMessage('Q1', reply, 'test', '1');
    expect(reply).toHaveBeenCalledWith('Введите варианты ответов через запятую:');

    await handleMessage('A, B', reply, 'test', '1');
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('Опрос создан!'));
  });

  test('ignores empty text', async () => {
    const reply = jest.fn();
    await handleMessage(undefined, reply, 'test', '1');
    expect(reply).toHaveBeenCalledWith('Неизвестная команда. Введите /start.');
  });

  test('handles vote flow', async () => {
    const { createSurvey } = await import('../src/services/surveyService.js');
    const { code } = createSurvey('Vote Test', [{ question: 'Q', options: ['Yes', 'No'] }]);

    const reply = jest.fn();
    await handleMessage('/vote', reply, 'test', '1');
    expect(reply).toHaveBeenCalledWith('Введите код опроса:');

    await handleMessage(code, reply, 'test', '1');
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('Вопрос 1'));

    await handleMessage('Yes', reply, 'test', '1');
    expect(reply).toHaveBeenCalledWith('Спасибо! Ваш голос принят.');
  });
});