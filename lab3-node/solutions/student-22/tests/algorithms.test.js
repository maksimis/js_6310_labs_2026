import { describe, test, expect } from '@jest/globals';
import {
  ALGORITHMS,
  bubbleSort,
  insertionSort,
  quickSort,
  mergeSort,
  findAlgorithm,
} from '../src/sorting/algorithms.js';

const sorts = { bubbleSort, insertionSort, quickSort, mergeSort };
const samples = [
  [5, 3, 8, 1],
  [1, 2, 3, 4],
  [4, 3, 2, 1],
  [3, 1, 3, 2, 1],
  [-2, 10, 0, 3.5, -7],
];

describe.each(Object.entries(sorts))('%s', (name, sort) => {
  test.each(samples)('sorts %p correctly', (...array) => {
    const expected = [...array].sort((a, b) => a - b);
    expect(sort(array).result).toEqual(expected);
  });

  test('does not change the input array', () => {
    const input = [3, 2, 1];
    sort(input);
    expect(input).toEqual([3, 2, 1]);
  });

  test('last step equals the result', () => {
    const { steps, result } = sort([4, 1, 3, 2]);
    expect(steps[steps.length - 1]).toEqual(result);
  });

  test('makes no steps for a sorted array', () => {
    const { steps, swaps } = sort([1, 2, 3]);
    expect(steps).toEqual([]);
    expect(swaps).toBe(0);
  });
});

describe('counters', () => {
  test('bubble sort on [3, 2, 1]', () => {
    const { comparisons, swaps, steps } = bubbleSort([3, 2, 1]);
    expect(comparisons).toBe(3);
    expect(swaps).toBe(3);
    expect(steps).toEqual([[2, 3, 1], [2, 1, 3], [1, 2, 3]]);
  });

  test('insertion sort on [3, 2, 1]', () => {
    const { comparisons, swaps } = insertionSort([3, 2, 1]);
    expect(comparisons).toBe(3);
    expect(swaps).toBe(3);
  });

  test('insertion makes fewer comparisons than bubble on a sorted array', () => {
    expect(insertionSort([1, 2, 3, 4]).comparisons).toBe(3);
    expect(bubbleSort([1, 2, 3, 4]).comparisons).toBe(6);
  });

  test('merge sort counts moved elements', () => {
    const { comparisons, swaps } = mergeSort([2, 1]);
    expect(comparisons).toBe(1);
    expect(swaps).toBe(2);
  });

  test('quick sort counts swaps', () => {
    const { swaps, comparisons } = quickSort([2, 1]);
    expect(comparisons).toBe(1);
    expect(swaps).toBe(1);
  });
});

describe('findAlgorithm', () => {
  test.each([
    ['пузырёк', 'bubble'],
    ['Пузырек', 'bubble'],
    ['вставки', 'insertion'],
    ['быстрая', 'quick'],
    ['слиянием', 'merge'],
    ['4', 'merge'],
    [' quick ', 'quick'],
  ])('%s -> %s', (name, key) => {
    expect(findAlgorithm(name)).toBe(key);
  });

  test('returns null for unknown names', () => {
    expect(findAlgorithm('пирамидальная')).toBeNull();
    expect(findAlgorithm(undefined)).toBeNull();
  });

  test('has four algorithms', () => {
    expect(Object.keys(ALGORITHMS)).toEqual(['bubble', 'insertion', 'quick', 'merge']);
  });
});
