import { describe, test, expect } from '@jest/globals';
import { parsePhysicsParams } from '../src/utils/parseInput.js';

describe('parsePhysicsParams', () => {
  test('parses valid angle and speed', () => {
    const res = parsePhysicsParams('45 10');
    expect(res.isValid).toBe(true);
    expect(res.angle).toBe(45);
    expect(res.speed).toBe(10);
  });

  test('fails on non-string input', () => {
    const res = parsePhysicsParams(null);
    expect(res.isValid).toBe(false);
  });

  test('fails on wrong argument count', () => {
    const res = parsePhysicsParams('45');
    expect(res.isValid).toBe(false);
  });

  test('fails on NaN inputs', () => {
    const res = parsePhysicsParams('abc 10');
    expect(res.isValid).toBe(false);
  });

  test('fails on out-of-range angle', () => {
    const res = parsePhysicsParams('400 10');
    expect(res.isValid).toBe(false);
  });

  test('fails on non-positive speed', () => {
    const res = parsePhysicsParams('45 -5');
    expect(res.isValid).toBe(false);
  });
});