import { describe, test, expect, beforeEach } from '@jest/globals';
import { images, albums, reset } from '../src/services/storage.js';

describe('storage', () => {
  beforeEach(() => reset());

  test('images и albums изначально пусты', () => {
    expect(images.size).toBe(0);
    expect(albums.size).toBe(0);
  });

  test('reset очищает обе Map', () => {
    images.set('a', { id: 'a' });
    albums.set('b', { id: 'b' });
    reset();
    expect(images.size).toBe(0);
    expect(albums.size).toBe(0);
  });
});