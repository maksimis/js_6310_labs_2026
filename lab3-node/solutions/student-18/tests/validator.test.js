import { describe, test, expect } from '@jest/globals';
import {
  isValidTitle,
  isValidDate,
  isPositiveNumber,
  isNonNegativeNumber,
  isValidId,
} from '../src/utils/validator.js';

describe('validator utility', () => {
  describe('isValidTitle', () => {
    test('accepts normal title', () => {
      expect(isValidTitle('Сдать сессию')).toBe(true);
    });

    test('rejects empty or whitespace', () => {
      expect(isValidTitle('')).toBe(false);
      expect(isValidTitle('   ')).toBe(false);
      expect(isValidTitle(null)).toBe(false);
      expect(isValidTitle(123)).toBe(false);
    });

    test('rejects commands starting with slash', () => {
      expect(isValidTitle('/start')).toBe(false);
      expect(isValidTitle('/cancel')).toBe(false);
    });

    test('rejects overly long titles (> 100 chars)', () => {
      expect(isValidTitle('a'.repeat(101))).toBe(false);
    });
  });

  describe('isValidDate', () => {
    test('accepts valid future date DD.MM.YYYY', () => {
      expect(isValidDate('31.12.2026')).toBe(true);
      expect(isValidDate('29.02.2028')).toBe(true); // future leap year
    });

    test('rejects dates in the past', () => {
      expect(isValidDate('01.01.2024')).toBe(false);
      expect(isValidDate('29.02.2024')).toBe(false);
    });

    test('rejects invalid format', () => {
      expect(isValidDate('2026-12-31')).toBe(false);
      expect(isValidDate('32.13.2')).toBe(false);
      expect(isValidDate('abc')).toBe(false);
      expect(isValidDate(null)).toBe(false);
    });

    test('rejects non-existent days or months', () => {
      expect(isValidDate('31.02.2026')).toBe(false);
      expect(isValidDate('00.05.2026')).toBe(false);
      expect(isValidDate('15.13.2026')).toBe(false);
    });

    test('rejects out of range years', () => {
      expect(isValidDate('01.01.2010')).toBe(false);
      expect(isValidDate('01.01.2150')).toBe(false);
    });
  });

  describe('isPositiveNumber', () => {
    test('accepts positive numbers', () => {
      expect(isPositiveNumber(5)).toBe(true);
      expect(isPositiveNumber('10')).toBe(true);
      expect(isPositiveNumber('2.5')).toBe(true);
    });

    test('rejects zero or negative numbers', () => {
      expect(isPositiveNumber(0)).toBe(false);
      expect(isPositiveNumber(-5)).toBe(false);
      expect(isPositiveNumber('abc')).toBe(false);
    });
  });

  describe('isNonNegativeNumber', () => {
    test('accepts zero and positive numbers', () => {
      expect(isNonNegativeNumber(0)).toBe(true);
      expect(isNonNegativeNumber('0')).toBe(true);
      expect(isNonNegativeNumber(5)).toBe(true);
    });

    test('rejects negative numbers and non-numbers', () => {
      expect(isNonNegativeNumber(-1)).toBe(false);
      expect(isNonNegativeNumber('xyz')).toBe(false);
    });
  });

  describe('isValidId', () => {
    test('accepts positive integers', () => {
      expect(isValidId(1)).toBe(true);
      expect(isValidId('2')).toBe(true);
    });

    test('rejects non-integers, zero or negatives', () => {
      expect(isValidId(0)).toBe(false);
      expect(isValidId(-1)).toBe(false);
      expect(isValidId('1.5')).toBe(false);
      expect(isValidId('abc')).toBe(false);
    });
  });
});
