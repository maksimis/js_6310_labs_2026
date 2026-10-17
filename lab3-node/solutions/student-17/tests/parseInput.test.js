import {
  parseTitle, parseAuthor, parseStatus, parseRating, parsePages, parseBookId,
} from '../src/utils/parseInput.js';

describe('parseTitle', () => {
  it('ok', () => expect(parseTitle('Дюна')).toEqual({ ok: true, value: 'Дюна' }));
  it('empty', () => expect(parseTitle('  ').ok).toBe(false));
  it('non-string', () => expect(parseTitle(1).ok).toBe(false));
  it('too long', () => expect(parseTitle('a'.repeat(201)).ok).toBe(false));
});

describe('parseAuthor', () => {
  it('ok', () => expect(parseAuthor('Герберт').ok).toBe(true));
  it('empty', () => expect(parseAuthor('').ok).toBe(false));
  it('non-string', () => expect(parseAuthor(42).ok).toBe(false));
});

describe('parseStatus', () => {
  it('ok', () => expect(parseStatus('read').ok).toBe(true));
  it('bad', () => expect(parseStatus('foo').ok).toBe(false));
});

describe('parseRating', () => {
  it('ok', () => expect(parseRating('3').value).toBe(3));
  it('0', () => expect(parseRating(0).ok).toBe(false));
  it('6', () => expect(parseRating(6).ok).toBe(false));
  it('2.5', () => expect(parseRating(2.5).ok).toBe(false));
});

describe('parsePages', () => {
  it('ok', () => expect(parsePages('100').value).toBe(100));
  it('negative', () => expect(parsePages('-1').ok).toBe(false));
  it('nan', () => expect(parsePages('abc').ok).toBe(false));
});

describe('parseBookId', () => {
  it('ok', () => expect(parseBookId('#3').value).toBe(3));
  it('bad', () => expect(parseBookId('abc').ok).toBe(false));
});