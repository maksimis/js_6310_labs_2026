import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  getGame,
  createGame,
  updateGame,
  deleteGame,
  setState,
  getAllGames,
} from '../src/game/gameState.js';
import { GAME_STATES } from '../src/game/constants.js';

describe('gameState', () => {
  beforeEach(() => {
    deleteGame('test-user');
    deleteGame('other-user');
  });

  test('createGame creates new game', () => {
    const game = createGame('test-user', 'easy');
    expect(game.userId).toBe('test-user');
    expect(game.sequence).toHaveLength(3);
    expect(game.state).toBe(GAME_STATES.PLAYING);
    expect(game.currentStep).toBe(0);
    expect(game.record).toBe(0);
  });

  test('getGame returns game', () => {
    createGame('test-user', 'medium');
    const game = getGame('test-user');
    expect(game).not.toBeNull();
    expect(game.sequence).toHaveLength(5);
  });

  test('getGame returns null for unknown user', () => {
    expect(getGame('unknown')).toBeNull();
  });

  test('updateGame updates fields', () => {
    createGame('test-user', 'easy');
    updateGame('test-user', { currentStep: 2 });
    expect(getGame('test-user').currentStep).toBe(2);
  });

  test('updateGame on unknown user returns undefined', () => {
    expect(updateGame('unknown', { currentStep: 1 })).toBeUndefined();
  });

  test('deleteGame removes game', () => {
    createGame('test-user', 'easy');
    deleteGame('test-user');
    expect(getGame('test-user')).toBeNull();
  });

  test('setState changes state', () => {
    createGame('test-user', 'easy');
    setState('test-user', GAME_STATES.GAME_OVER);
    expect(getGame('test-user').state).toBe(GAME_STATES.GAME_OVER);
  });

  test('setState on unknown user creates placeholder game', () => {
    setState('unknown', GAME_STATES.PLAYING);
    const game = getGame('unknown');
    expect(game).not.toBeNull();
    expect(game.state).toBe(GAME_STATES.PLAYING);
    deleteGame('unknown');
  });

  test('games are independent for different users', () => {
    createGame('test-user', 'easy');
    createGame('other-user', 'hard');
    expect(getGame('test-user').sequence).toHaveLength(3);
    expect(getGame('other-user').sequence).toHaveLength(8);
  });

  test('getAllGames returns map', () => {
    createGame('test-user', 'easy');
    const games = getAllGames();
    expect(games.size).toBeGreaterThan(0);
  });
});