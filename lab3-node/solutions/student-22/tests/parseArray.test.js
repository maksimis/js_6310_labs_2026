import { describe, test, expect } from '@jest/globals';
import { parseArray, MAX_LENGTH } from '../src/utils/parseArray.js';

describe('parseArray', () => {
  test('parses numbers separated by spaces', () => {
    expect(parseArray('5 3 8 1')).toEqual({ array: [5, 3, 8, 1] });
  });

  test('parses numbers separated by commas', () => {
    expect(parseArray('5, -3,8.5')).toEqual({ array: [5, -3, 8.5] });
  });

  test('rejects text that is not numbers', () => {
    expect(parseArray('5 abc 1').error).toBeDefined();
  });

  test('rejects too short arrays', () => {
    expect(parseArray('5').error).toBeDefined();
    expect(parseArray('   ').error).toBeDefined();
  });

  test('rejects too long arrays', () => {
    const text = Array.from({ length: MAX_LENGTH + 1 }, (_, i) => i).join(' ');
    expect(parseArray(text).error).toBeDefined();
  });

  test('rejects non-string input', () => {
    expect(parseArray(undefined).error).toBeDefined();
  });

  test('rejects Infinity', () => {
    expect(parseArray('1 Infinity').error).toBeDefined();
  });
});
