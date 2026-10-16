// const math = require('../src/utils/math');
import * as math from '../src/utils';
import { describe, test, expect } from '@jest/globals';

describe('Math module', () => {
  test('sums two numbers correctly', () => {
    expect(math.sum(2, 3)).toBe(5);
  });
  test('multiplies two numbers correctly', () => {
    expect(math.multiply(2, 3)).toBe(6);
  });    
  test('sum handles negative numbers', () => {
    expect(math.sum(-1, -2)).toBe(-3);
  });
});