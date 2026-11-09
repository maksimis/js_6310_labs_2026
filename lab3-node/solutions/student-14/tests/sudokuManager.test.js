import { describe, test, expect, beforeEach } from '@jest/globals';
import { SudokuManager, GameState } from '../src/game/SudokuManager.js';

describe('SudokuManager', () => {
  let manager;
  beforeEach(() => {
    manager = new SudokuManager();
  });

  test('new session starts in IDLE', () => {
    expect(manager.getState(1)).toBe(GameState.IDLE);
  });

  test('generate switches to PLAYING and returns message', () => {
    const res = manager.generate(1, 'easy');
    expect(res.success).toBe(true);
    expect(res.state).toBe(GameState.PLAYING);
    expect(res.message).toContain('Судоку');
  });

  test('play before generate returns error', () => {
    const res = manager.play(1, 'a1', '5');
    expect(res.success).toBe(false);
    expect(res.message).toContain('Сначала сгенерируй');
  });

  test('play with bad coord returns error', () => {
    manager.generate(1, 'easy');
    const res = manager.play(1, 'zz', '5');
    expect(res.success).toBe(false);
  });

  test('play with bad value returns error', () => {
    manager.generate(1, 'easy');
    const res = manager.play(1, 'a1', '99');
    expect(res.success).toBe(false);
  });

  test('valid play updates grid', () => {
    manager.generate(1, 'easy');
    const session = manager.getSession(1);
    const game = session.game;

    // Найдём пустую клетку
    let coord = null;
    let value = null;
    for (let r = 0; r < 9 && !coord; r++) {
      for (let c = 0; c < 9; c++) {
        if (game.grid[r][c] === 0) {
          const letters = 'abcdefghi';
          coord = `${letters[c]}${r + 1}`;
          value = String(game.solution[r][c]);
          break;
        }
      }
    }

    const res = manager.play(1, coord, value);
    expect(res.success).toBe(true);
    expect(game.grid).toBeDefined();
  });

  test('check without game returns error', () => {
    const res = manager.check(1);
    expect(res.success).toBe(false);
  });

  test('two users have independent sessions', () => {
    manager.generate(1, 'easy');
    expect(manager.getState(1)).toBe(GameState.PLAYING);
    expect(manager.getState(2)).toBe(GameState.IDLE);
  });

  test('reset returns to IDLE', () => {
    manager.generate(1, 'easy');
    const res = manager.reset(1);
    expect(res.state).toBe(GameState.IDLE);
    expect(manager.getState(1)).toBe(GameState.IDLE);
  });

  test('full solution through play marks SOLVED', () => {
    manager.generate(1, 'easy');
    const session = manager.getSession(1);
    const game = session.game;
    const letters = 'abcdefghi';

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (game.grid[r][c] === 0) {
          manager.play(1, `${letters[c]}${r + 1}`, String(game.solution[r][c]));
        }
      }
    }

    expect(manager.getState(1)).toBe(GameState.SOLVED);
  });
});