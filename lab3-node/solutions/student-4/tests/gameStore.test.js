import { beforeEach, describe, expect, test } from '@jest/globals';
import {
  addPlayer,
  clearGames,
  createGame,
  findGameByCode,
  getGame,
} from '../src/services/gameStore.js';

describe('gameStore', () => {
  beforeEach(() => clearGames());

  test('creates a game with id and code', () => {
    const game = createGame();
    expect(game.id).toBe(1);
    expect(game.code).toHaveLength(6);
    expect(game.players).toEqual([]);
  });

  test('creates a game with default field size', () => {
    const game = createGame();
    expect(game.fieldSize).toBe(10);
  });

  test('creates a game with custom field size', () => {
    const game = createGame(20);
    expect(game.fieldSize).toBe(20);
  });

  test('finds game by code case-insensitively', () => {
    const game = createGame();
    expect(findGameByCode(game.code.toLowerCase())).toBe(game);
  });

  test('adds up to two players and starts the game', () => {
    const game = createGame();
    addPlayer(game, 1);
    addPlayer(game, 2);
    expect(game.players).toHaveLength(2);
    expect(game.status).toBe('playing');
    expect(addPlayer(game, 3)).toBeNull();
  });

  test('does not add the same player twice', () => {
    const game = createGame();
    addPlayer(game, 1);
    expect(addPlayer(game, 1)).toBeNull();
  });

  test('getGame returns undefined for unknown id', () => {
    expect(getGame(999)).toBeUndefined();
  });
});