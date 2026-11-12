import { describe, expect, test } from '@jest/globals';
import { isValidDirection, moveSnake, renderField } from '../src/services/gameLogic.js';

const makePlayer = () => ({
  id: 1,
  direction: 'right',
  score: 0,
  snake: [{ x: 1, y: 1 }, { x: 0, y: 1 }],
});

describe('gameLogic', () => {
  test('validates direction', () => {
    expect(isValidDirection('up')).toBe(true);
    expect(isValidDirection('диагональ')).toBe(false);
  });

  test('accepts all four directions', () => {
    expect(isValidDirection('up')).toBe(true);
    expect(isValidDirection('down')).toBe(true);
    expect(isValidDirection('left')).toBe(true);
    expect(isValidDirection('right')).toBe(true);
  });

  test('rejects empty and null directions', () => {
    expect(isValidDirection('')).toBe(false);
    expect(isValidDirection(null)).toBe(false);
    expect(isValidDirection(undefined)).toBe(false);
  });

  test('moves snake in valid direction', () => {
    const player = makePlayer();
    const result = moveSnake(player, 'right', 10, 10);
    expect(result.ok).toBe(true);
    expect(player.snake[0]).toEqual({ x: 2, y: 1 });
    expect(player.score).toBe(1);
  });

  test('moves snake in all four directions', () => {
    const up = makePlayer();
    up.snake = [{ x: 5, y: 5 }, { x: 5, y: 6 }];
    expect(moveSnake(up, 'up', 10, 10).ok).toBe(true);

    const down = makePlayer();
    down.snake = [{ x: 5, y: 5 }, { x: 5, y: 4 }];
    expect(moveSnake(down, 'down', 10, 10).ok).toBe(true);

    const left = makePlayer();
    left.snake = [{ x: 5, y: 5 }, { x: 6, y: 5 }];
    expect(moveSnake(left, 'left', 10, 10).ok).toBe(true);

    const right = makePlayer();
    right.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }];
    expect(moveSnake(right, 'right', 10, 10).ok).toBe(true);
  });

  test('rejects invalid direction', () => {
    const player = makePlayer();
    const result = moveSnake(player, 'диагональ', 10, 10);
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Неверное направление');
  });

  test('rejects wall collision', () => {
    const player = makePlayer();
    player.snake = [{ x: 9, y: 5 }, { x: 8, y: 5 }];
    const result = moveSnake(player, 'right', 10, 10);
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Стена');
  });

  test('rejects collision with top wall', () => {
    const player = makePlayer();
    player.snake = [{ x: 5, y: 0 }, { x: 5, y: 1 }];
    const result = moveSnake(player, 'up', 10, 10);
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Стена');
  });

  test('rejects self-collision', () => {
    const player = makePlayer();
    player.snake = [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 2 },
    ];
    const result = moveSnake(player, 'right', 10, 10);
    expect(result.ok).toBe(false);
  });

  test('renders empty field when no players', () => {
    const game = { players: [] };
    const rendered = renderField(game, 3, 3);
    expect(rendered).toBe('...\n...\n...');
  });

  test('renders field with two players', () => {
    const game = {
      players: [
        { snake: [{ x: 0, y: 0 }] },
        { snake: [{ x: 9, y: 9 }] },
      ],
    };
    const rendered = renderField(game, 10, 10);
    expect(rendered).toContain('🟢');
    expect(rendered).toContain('🔵');
  });

  test('ignores snake parts outside of the field', () => {
    const game = {
      players: [
        { snake: [{ x: -1, y: -1 }, { x: 100, y: 100 }] },
      ],
    };
    const rendered = renderField(game, 3, 3);
    expect(rendered).toBe('...\n...\n...');
  });
});