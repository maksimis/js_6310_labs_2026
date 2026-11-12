import { validateConfig } from '../src/config.js';

describe('config', () => {
  test('validateConfig returns true with token', () => {
    expect(validateConfig({ telegramToken: 'abc' })).toBe(true);
  });

  test('validateConfig throws without token', () => {
    expect(() => validateConfig({ telegramToken: '' })).toThrow();
  });
});