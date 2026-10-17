import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  getLeaderboard,
  validatePlayerName,
  addRecord,
  resetLeaderboard,
  formatLeaderboard,
} from '../src/tetris/records.js';

describe('records', () => {
  beforeEach(() => {
    resetLeaderboard();
  });

  test('returns default leaderboard sorted by score descending', () => {
    const list = getLeaderboard();
    expect(list.length).toBeGreaterThan(0);
    for (let i = 0; i < list.length - 1; i++) {
      expect(list[i].score).toBeGreaterThanOrEqual(list[i + 1].score);
    }
  });

  test('respects limit parameter', () => {
    expect(getLeaderboard(2).length).toBe(2);
  });

  describe('validatePlayerName', () => {
    test('accepts valid names', () => {
      expect(validatePlayerName('Alex').valid).toBe(true);
      expect(validatePlayerName('  Gamer123  ').valid).toBe(true);
      expect(validatePlayerName('  Gamer123  ').name).toBe('Gamer123');
    });

    test('rejects too short, too long, or non-string names', () => {
      expect(validatePlayerName('A').valid).toBe(false);
      expect(validatePlayerName('ThisNameIsWayTooLongForTetris').valid).toBe(false);
      expect(validatePlayerName(null).valid).toBe(false);
      expect(validatePlayerName(12345).valid).toBe(false);
    });
  });

  describe('addRecord', () => {
    test('adds record and assigns rank', () => {
      const result = addRecord('Champion', 2500);
      expect(result.success).toBe(true);
      expect(result.rank).toBe(1);
      expect(result.record.score).toBe(2500);

      const top = getLeaderboard(1)[0];
      expect(top.name).toBe('Champion');
    });

    test('rejects invalid names or non-numeric/negative scores', () => {
      expect(addRecord('A', 500).success).toBe(false);
      expect(addRecord('Player', -10).success).toBe(false);
      expect(addRecord('Player', 'abc').success).toBe(false);
      expect(addRecord('Player', 10.5).success).toBe(false);
    });

    test('caps table size at 50', () => {
      for (let i = 0; i < 60; i++) {
        addRecord(`Bot_${i}`, i * 10);
      }
      expect(getLeaderboard(100).length).toBeLessThanOrEqual(50);
    });
  });

  describe('formatLeaderboard', () => {
    test('formats records into text with medals', () => {
      const formatted = formatLeaderboard();
      expect(formatted).toContain('Таблица лидеров');
      expect(formatted).toContain('🥇');
      expect(formatted).toContain('🥈');
      expect(formatted).toContain('🥉');
      expect(formatted).toContain('TetrisMaster');
    });

    test('handles empty leaderboard', () => {
      expect(formatLeaderboard([])).toContain('пока пуста');
    });
  });
});
