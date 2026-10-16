import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { unlinkSync, writeFileSync, existsSync } from 'node:fs';
import { FSM, PersistentFSM, STATES } from '../src/state/index.js';

const TEST_FILE = './data/test-state.json';

describe('FSM', () => {
  let fsm;

  beforeEach(() => {
    fsm = new FSM();
  });

  test('getState returns IDLE for unknown user', () => {
    expect(fsm.getState('u1')).toEqual({ state: STATES.IDLE, data: {} });
  });

  test('setState stores state', () => {
    fsm.setState('u1', STATES.WAITING_FOR_PROVIDER, { x: 1 });
    expect(fsm.getState('u1')).toEqual({
      state: STATES.WAITING_FOR_PROVIDER,
      data: { x: 1 }
    });
  });

  test('users are independent', () => {
    fsm.setState('u1', STATES.WAITING_FOR_PROVIDER);
    fsm.setState('u2', STATES.WAITING_FOR_MESSAGE);
    expect(fsm.getState('u1').state).toBe(STATES.WAITING_FOR_PROVIDER);
    expect(fsm.getState('u2').state).toBe(STATES.WAITING_FOR_MESSAGE);
  });

  test('reset removes state', () => {
    fsm.setState('u1', STATES.WAITING_FOR_PROVIDER);
    fsm.reset('u1');
    expect(fsm.getState('u1').state).toBe(STATES.IDLE);
  });

  test('clear removes all states', () => {
    fsm.setState('u1', STATES.WAITING_FOR_PROVIDER);
    fsm.setState('u2', STATES.WAITING_FOR_MODEL);
    fsm.clear();
    expect(fsm.getState('u1').state).toBe(STATES.IDLE);
    expect(fsm.getState('u2').state).toBe(STATES.IDLE);
  });
});

describe('PersistentFSM', () => {
  afterEach(() => {
    if (existsSync(TEST_FILE)) unlinkSync(TEST_FILE);
  });

  test('loads empty state when file missing', () => {
    const fsm = new PersistentFSM(TEST_FILE);
    expect(fsm.getState('u1').state).toBe(STATES.IDLE);
  });

  test('persists state to file', () => {
    const fsm = new PersistentFSM(TEST_FILE);
    fsm.setState('u1', STATES.WAITING_FOR_PROVIDER, { x: 1 });
    const fsm2 = new PersistentFSM(TEST_FILE);
    expect(fsm2.getState('u1')).toEqual({
      state: STATES.WAITING_FOR_PROVIDER,
      data: { x: 1 }
    });
  });

  test('handles corrupted file', () => {
    writeFileSync(TEST_FILE, '{ not valid json');
    const fsm = new PersistentFSM(TEST_FILE);
    expect(fsm.getState('u1').state).toBe(STATES.IDLE);
  });

  test('reset persists removal', () => {
    const fsm = new PersistentFSM(TEST_FILE);
    fsm.setState('u1', STATES.WAITING_FOR_PROVIDER);
    fsm.reset('u1');
    const fsm2 = new PersistentFSM(TEST_FILE);
    expect(fsm2.getState('u1').state).toBe(STATES.IDLE);
  });
});