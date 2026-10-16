import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  STATES,
  getUserState,
  setUserState,
  resetUserState,
  clearAllStates,
} from '../src/fsm/stateManager.js';

describe('stateManager FSM', () => {
  beforeEach(() => {
    clearAllStates();
  });

  test('returns IDLE state by default for new user', () => {
    const session = getUserState(1);
    expect(session.state).toBe(STATES.IDLE);
    expect(session.data).toEqual({});
  });

  test('sets and gets user state with data', () => {
    setUserState(1, STATES.AWAITING_GOAL_TITLE, { some: 'value' });
    const session = getUserState(1);
    expect(session.state).toBe(STATES.AWAITING_GOAL_TITLE);
    expect(session.data).toEqual({ some: 'value' });
  });

  test('isolates states between different users', () => {
    setUserState(1, STATES.AWAITING_GOAL_TITLE);
    setUserState(2, STATES.AWAITING_KR_TARGET);

    expect(getUserState(1).state).toBe(STATES.AWAITING_GOAL_TITLE);
    expect(getUserState(2).state).toBe(STATES.AWAITING_KR_TARGET);
  });

  test('resets user state back to IDLE', () => {
    setUserState(1, STATES.AWAITING_GOAL_DEADLINE, { title: 'Test' });
    resetUserState(1);

    const session = getUserState(1);
    expect(session.state).toBe(STATES.IDLE);
    expect(session.data).toEqual({});
  });
});
