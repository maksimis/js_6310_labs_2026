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
  _resetStore,
} from '../src/services/surveyService.js';

describe('Survey Service', () => {
  beforeEach(() => {
    _resetStore();
  });

  test('createSurvey creates a survey and returns id and code', () => {
    const { id, code } = createSurvey('Test Topic', [{ question: 'Q1', options: ['A', 'B'] }]);
    expect(id).toBeDefined();
    expect(code).toBeDefined();
    expect(typeof code).toBe('string');
    expect(code.length).toBeGreaterThan(0);
  });

  test('getSurveyByCode finds survey', () => {
    const { code } = createSurvey('Test', [{ question: 'Q', options: ['A', 'B'] }]);
    const survey = getSurveyByCode(code);
    expect(survey).toBeDefined();
    expect(survey.topic).toBe('Test');
  });

  test('getSurveyById returns undefined for unknown id', () => {
    expect(getSurveyById('unknown')).toBeUndefined();
  });

  test('saveVote saves vote and prevents double voting', () => {
    const { id } = createSurvey('Test', [{ question: 'Q', options: ['A', 'B'] }]);
    const success = saveVote(id, 'user1', ['A']);
    expect(success).toBe(true);
    const fail = saveVote(id, 'user1', ['B']);
    expect(fail).toBe(false);
  });

  test('getResults returns correct distribution', () => {
    const { id } = createSurvey('Test', [{ question: 'Q', options: ['A', 'B'] }]);
    saveVote(id, 'user1', ['A']);
    saveVote(id, 'user2', ['A']);
    saveVote(id, 'user3', ['B']);

    const results = getResults(id);
    expect(results.total).toBe(3);
    expect(results.distribution[0]['A']).toBe(67); // 2/3 ~ 66.6 -> 67
    expect(results.distribution[0]['B']).toBe(33); // 1/3 ~ 33.3 -> 33
  });

  test('getResults returns null for unknown id', () => {
    expect(getResults('unknown')).toBeNull();
  });

  test('user state management works', () => {
    expect(getUserState('tg', '1').state).toBe('IDLE');
    setUserState('tg', '1', 'TEST', { foo: 'bar' });
    const state = getUserState('tg', '1');
    expect(state.state).toBe('TEST');
    expect(state.data.foo).toBe('bar');
    clearUserState('tg', '1');
    expect(getUserState('tg', '1').state).toBe('IDLE');
  });
});