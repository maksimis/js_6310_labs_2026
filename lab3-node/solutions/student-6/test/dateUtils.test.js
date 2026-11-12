import { expect, test } from '@jest/globals';
import { formatDateTime, isSameLocalDay, nextOccurrence, parseLocalDateTime } from '../src/utils/dateUtils.js';

test('Функция разбора принимает корректные дату и время', () => {
  const result = parseLocalDateTime('2027-02-03 09:05');
  expect(result instanceof Date).toBeTruthy();
  expect(result.getFullYear()).toBe(2027);
  expect(result.getMonth()).toBe(1);
  expect(result.getDate()).toBe(3);
  expect(result.getHours()).toBe(9);
  expect(result.getMinutes()).toBe(5);
});

test('Функция разбора отклоняет неверный ввод и невозможные даты', () => {
  expect(parseLocalDateTime('tomorrow')).toBe(null);
  expect(parseLocalDateTime('2027-02-30 09:05')).toBe(null);
  expect(parseLocalDateTime(null)).toBe(null);
});

test('Функция форматирования возвращает дату в заданном формате', () => {
  expect(formatDateTime(new Date(2027, 0, 2, 3, 4))).toMatch(/^02\.01\.2027 03:04$/);
  expect(formatDateTime(null)).toBe('не задано');
});

test('Функция сравнения определяет, совпадает ли календарный день', () => {
  expect(isSameLocalDay(new Date(2027, 2, 5, 1), new Date(2027, 2, 5, 22))).toBe(true);
  expect(isSameLocalDay(new Date(2027, 2, 5), new Date(2027, 2, 6))).toBe(false);
});

test('Следующее напоминание рассчитывается с учётом интервала повторения', () => {
  const date = new Date(2027, 0, 1, 12);
  expect(nextOccurrence(date, 'daily').getDate()).toBe(2);
  expect(nextOccurrence(date, 'weekly').getDate()).toBe(8);
  expect(nextOccurrence(date, 'none')).toBe(null);
});
