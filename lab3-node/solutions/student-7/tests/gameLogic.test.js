import { describe, test, expect } from '@jest/globals';
import {
  generateSequence,
  getSequenceText,
  checkGuess,
  getDifficultyLength,
} from '../src/game/gameLogic.js';

describe('gameLogic', () => {
  test('generateSequence returns array of correct length', () => {
    expect(generateSequence(3)).toHaveLength(3);
    expect(generateSequence(5)).toHaveLength(5);
    expect(generateSequence(8)).toHaveLength(8);
  });

  test('generateSequence contains valid colors', () => {
    const sequence = generateSequence(10);
    const validColors = ['red', 'green', 'blue', 'yellow'];
    sequence.forEach((color) => {
      expect(validColors).toContain(color);
    });
  });

  test('getSequenceText returns emoji string', () => {
    expect(getSequenceText(['red', 'green'])).toBe('🔴 🟢');
    expect(getSequenceText(['blue', 'yellow'])).toBe('🔵 🟡');
    expect(getSequenceText([])).toBe('');
  });

  test('checkGuess validates color', () => {
    expect(checkGuess([], 'red')).toBe(true);
    expect(checkGuess([], 'green')).toBe(true);
    expect(checkGuess([], 'blue')).toBe(true);
    expect(checkGuess([], 'yellow')).toBe(true);
    expect(checkGuess([], 'invalid')).toBe(false);
    expect(checkGuess([], 'RED')).toBe(true);
  });

  test('getDifficultyLength returns correct length', () => {
    expect(getDifficultyLength('easy')).toBe(3);
    expect(getDifficultyLength('medium')).toBe(5);
    expect(getDifficultyLength('hard')).toBe(8);
    expect(getDifficultyLength('unknown')).toBe(0);
  });
});