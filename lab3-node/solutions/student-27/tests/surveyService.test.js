import { describe, test, expect, beforeEach } from '@jest/globals';

import {
  createSurvey,
  getSurveyByCode,
  getSurveyById,
  saveVote,
  getResults,
  getUserState,
  setUserState,
  clearUserState,
  _resetStore
} from '../src/services/surveyService.js';

describe('Survey Service', () => {
  beforeEach(() => {
    _resetStore();
  });

  test('createSurvey returns id and code', () => {
    const { id, code } = createSurvey(
      'Test Topic',
      [{ question: 'Q1', options: ['A', 'B'] }]
    );

    expect(id).toBe(1);
    expect(typeof code).toBe('string');
    expect(code.length).toBeGreaterThan(0);
  });

  test('getSurveyByCode finds survey', () => {
    const { code } = createSurvey(
      'Test',
      [{ question: 'Q', options: ['A', 'B'] }]
    );

    expect(getSurveyByCode(code).topic).toBe('Test');
  });

  test('getSurveyByCode ignores case and spaces', () => {
    const { code } = createSurvey(
      'Test',
      [{ question: 'Q', options: ['A', 'B'] }]
    );

    expect(
      getSurveyByCode(` ${code.toLowerCase()} `)?.code
    ).toBe(code);

    expect(getSurveyByCode(null)).toBeUndefined();
  });

  test('getSurveyById returns undefined for unknown id', () => {
    expect(getSurveyById('unknown')).toBeUndefined();
  });

  test('saveVote prevents duplicate voting', () => {
    const { id } = createSurvey(
      'Test',
      [{ question: 'Q', options: ['A', 'B'] }]
    );

    expect(saveVote(id, 'telegram_1', ['A'])).toBe(true);
    expect(saveVote(id, 'telegram_1', ['B'])).toBe(false);

    expect(saveVote(id, 'vk_1', ['B'])).toBe(true);

    expect(
      saveVote('unknown', 'telegram_2', ['A'])
    ).toBe(false);
  });

  test('getResults calculates correct percentages', () => {
    const { id } = createSurvey(
      'Test',
      [{ question: 'Q', options: ['A', 'B'] }]
    );

    saveVote(id, 'user1', ['A']);
    saveVote(id, 'user2', ['A']);
    saveVote(id, 'user3', ['B']);

    const results = getResults(id);

    expect(results.total).toBe(3);
    expect(results.distribution[0].A).toBe(67);
    expect(results.distribution[0].B).toBe(33);
  });

  test('getResults returns zeros without votes', () => {
    const { id } = createSurvey(
      'Empty',
      [{ question: 'Q', options: ['A', 'B'] }]
    );

    expect(getResults(id)).toEqual({
      total: 0,
      distribution: {
        0: { A: 0, B: 0 }
      }
    });
  });

  test('getResults returns null for unknown id', () => {
    expect(getResults('unknown')).toBeNull();
  });

  test('user states are independent', () => {
    expect(getUserState('telegram', '1').state).toBe('IDLE');

    setUserState('telegram', '1', 'TEST', {
      foo: 'bar'
    });

    expect(getUserState('telegram', '1')).toEqual({
      state: 'TEST',
      data: { foo: 'bar' }
    });

    expect(getUserState('vk', '1').state).toBe('IDLE');
    expect(getUserState('telegram', '2').state).toBe('IDLE');

    clearUserState('telegram', '1');

    expect(getUserState('telegram', '1').state).toBe('IDLE');
  });
});