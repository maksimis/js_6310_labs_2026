import { describe, test, expect } from '@jest/globals';
import { calculateBounce, renderAsciiTrajectory } from '../src/breakout/physics.js';

describe('Physics module', () => {
  test('calculates bounce and includes mechanic explanation', () => {
    const result = calculateBounce(60, 10);
    expect(result.bounceType).toContain('платформы');
    expect(result.explanation).toContain('инвертируется вертикальная проекция');
    expect(result.summary).toContain('Механика');
  });

  test('calculates bounce from walls when vx >= vy', () => {
    const result = calculateBounce(10, 10);
    expect(result.bounceType).toContain('боковой стенки');
    expect(result.explanation).toContain('горизонтальная проекция');
  });

  test('covers all 4 angle quadrants for ascii trajectory rendering', () => {
    expect(renderAsciiTrajectory(45)).toContain('^/');
    expect(renderAsciiTrajectory(135)).toContain('\\^');
    expect(renderAsciiTrajectory(225)).toContain('/v');
    expect(renderAsciiTrajectory(315)).toContain('v\\');
  });
});