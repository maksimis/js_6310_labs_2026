import { describe, test, expect } from '@jest/globals';
import {
  TETRAMINO_TYPES,
  CLASSIC_PIECES,
  renderTetraminoMatrix,
  getTetramino,
  getRandomTetramino,
  formatTetramino,
} from '../src/tetris/tetramino.js';

describe('tetramino', () => {
  test('has exactly 7 classic tetramino pieces', () => {
    expect(CLASSIC_PIECES).toEqual(['I', 'O', 'T', 'L', 'J', 'S', 'Z']);
    expect(Object.keys(TETRAMINO_TYPES).length).toBe(7);
  });

  test.each(CLASSIC_PIECES)('retrieves %s piece correctly', (type) => {
    const piece = getTetramino(type);
    expect(piece).not.toBeNull();
    expect(piece.type).toBe(type);
    expect(piece.width).toBe(piece.matrix[0].length);
    expect(piece.height).toBe(piece.matrix.length);
  });

  test('handles case-insensitive and trimmed type input', () => {
    const lower = getTetramino('  t  ');
    expect(lower).not.toBeNull();
    expect(lower.type).toBe('T');
  });

  test('returns null for unknown or invalid piece type', () => {
    expect(getTetramino('X')).toBeNull();
    expect(getTetramino(null)).toBeNull();
    expect(getTetramino(undefined)).toBeNull();
    expect(getTetramino(123)).toBeNull();
  });

  test('renderTetraminoMatrix renders blocks and spaces', () => {
    const rendered = renderTetraminoMatrix([[1, 0], [0, 1]]);
    expect(rendered).toContain('■  .');
    expect(rendered).toContain('.  ■');
  });

  test('renderTetraminoMatrix handles empty or invalid matrix', () => {
    expect(renderTetraminoMatrix([])).toBe('');
    expect(renderTetraminoMatrix(null)).toBe('');
  });

  test('getRandomTetramino picks pieces based on randomFn', () => {
    const first = getRandomTetramino(() => 0);
    expect(first.type).toBe(CLASSIC_PIECES[0]);

    const last = getRandomTetramino(() => 0.999);
    expect(last.type).toBe(CLASSIC_PIECES[CLASSIC_PIECES.length - 1]);

    const fallback = getRandomTetramino(() => 10);
    expect(fallback.type).toBe(CLASSIC_PIECES[0]);
  });

  test('formatTetramino formats piece description and text matrix', () => {
    const piece = getTetramino('I');
    const formatted = formatTetramino(piece);
    expect(formatted).toContain('I-образное');
    expect(formatted).toContain('4x1');
    expect(formatted).toContain('■');
  });

  test('formatTetramino handles missing piece', () => {
    expect(formatTetramino(null)).toContain('не задано');
    expect(formatTetramino({})).toContain('не задано');
  });
});
