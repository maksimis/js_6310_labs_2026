import { calcPercent } from '../src/math.js';

describe('math', () => {
  it('считает 50%', () => {
    expect(calcPercent(5, 10)).toBe(50);
  });

  it('возвращает 0 при total = 0', () => {
    expect(calcPercent(0, 0)).toBe(0);
  });

  it('округляет результат', () => {
    expect(calcPercent(1, 3)).toBe(33);
  });

  it('обрабатывает 100%', () => {
    expect(calcPercent(7, 7)).toBe(100);
  });
});