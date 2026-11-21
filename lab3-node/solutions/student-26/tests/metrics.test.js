import * as metrics from '../src/utils/index.js';
import { describe, test, expect } from '@jest/globals';

describe('Метрики', () => {
  test('calcCpm возвращает 0 при некорректных данных', () => {
    expect(metrics.calcCpm(0, 1000)).toBe(0);
    expect(metrics.calcCpm(10, 0)).toBe(0);
    expect(metrics.calcCpm(NaN, 1000)).toBe(0);
  });

  test('calcCpm считает символов в минуту', () => {
    expect(metrics.calcCpm(100, 30000)).toBe(200);
  });

  test('countErrors считает несовпавшие символы', () => {
    expect(metrics.countErrors('abc', 'abc')).toBe(0);
    expect(metrics.countErrors('abc', 'abd')).toBe(1);
    expect(metrics.countErrors('abc', 'ab')).toBe(1);
    expect(metrics.countErrors('abc', 'abcd')).toBe(1);
  });

  test('countErrors обрабатывает не-строки', () => {
    expect(metrics.countErrors(null, 'abc')).toBe(0);
    expect(metrics.countErrors('abc', undefined)).toBe(0);
  });

  test('calcAccuracy возвращает 0 для пустого эталона', () => {
    expect(metrics.calcAccuracy('', 'abc')).toBe(0);
    expect(metrics.calcAccuracy(null, 'abc')).toBe(0);
  });

  test('calcAccuracy считает процент точности', () => {
    expect(metrics.calcAccuracy('abcd', 'abcd')).toBe(100);
    expect(metrics.calcAccuracy('abcd', 'abce')).toBe(75);
    expect(metrics.calcAccuracy('abcd', 'ab')).toBe(50);
  });

  test('average возвращает 0 для пустого массива и не-массива', () => {
    expect(metrics.average([])).toBe(0);
    expect(metrics.average(null)).toBe(0);
  });

  test('average считает среднее арифметическое', () => {
    expect(metrics.average([10, 20, 30])).toBe(20);
    expect(metrics.average([1, 2])).toBe(2);
  });
});