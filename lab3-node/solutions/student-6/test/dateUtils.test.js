import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDateTime, isSameLocalDay, nextOccurrence, parseLocalDateTime } from '../src/utils/dateUtils.js';

test('Функция разбора принимает корректные дату и время', () => {
  const result = parseLocalDateTime('2027-02-03 09:05');
  assert.ok(result instanceof Date);
  assert.equal(result.getFullYear(), 2027);
  assert.equal(result.getMonth(), 1);
  assert.equal(result.getDate(), 3);
  assert.equal(result.getHours(), 9);
  assert.equal(result.getMinutes(), 5);
});

test('Функция разбора отклоняет неверный ввод и невозможные даты', () => {
  assert.equal(parseLocalDateTime('tomorrow'), null);
  assert.equal(parseLocalDateTime('2027-02-30 09:05'), null);
  assert.equal(parseLocalDateTime(null), null);
});

test('Функция форматирования возвращает дату в заданном формате', () => {
  assert.match(formatDateTime(new Date(2027, 0, 2, 3, 4)), /^02\.01\.2027 03:04$/);
  assert.equal(formatDateTime(null), 'не задано');
});

test('Функция сравнения определяет, совпадает ли календарный день', () => {
  assert.equal(isSameLocalDay(new Date(2027, 2, 5, 1), new Date(2027, 2, 5, 22)), true);
  assert.equal(isSameLocalDay(new Date(2027, 2, 5), new Date(2027, 2, 6)), false);
});

test('Следующее напоминание рассчитывается с учётом интервала повторения', () => {
  const date = new Date(2027, 0, 1, 12);
  assert.equal(nextOccurrence(date, 'daily').getDate(), 2);
  assert.equal(nextOccurrence(date, 'weekly').getDate(), 8);
  assert.equal(nextOccurrence(date, 'none'), null);
});
