import { getSession, resetSession, clearSessions, STEPS } from '../src/state.js';

beforeEach(() => clearSessions());

describe('state', () => {
  test('getSession creates new session', () => {
    const s = getSession(1);
    expect(s.step).toBe(STEPS.IDLE);
    expect(s.score).toBe(0);
  });

  test('getSession returns same instance', () => {
    const a = getSession(2);
    a.score = 5;
    const b = getSession(2);
    expect(b.score).toBe(5);
  });

  test('resetSession clears state', () => {
    const s = getSession(3);
    s.step = STEPS.QUESTION;
    s.score = 10;
    const fresh = resetSession(3);
    expect(fresh.step).toBe(STEPS.IDLE);
    expect(fresh.score).toBe(0);
  });

  test('sessions are independent per user', () => {
    const a = getSession(10);
    const b = getSession(11);
    a.score = 1;
    b.score = 2;
    expect(a.score).toBe(1);
    expect(b.score).toBe(2);
  });
});