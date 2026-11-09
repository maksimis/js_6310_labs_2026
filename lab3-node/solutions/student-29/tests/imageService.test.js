import { describe, test, expect, beforeEach } from '@jest/globals';
import { reset } from '../src/services/storage.js';
import {
  validateImage,
  saveImage,
  getImage,
  deleteImage,
  MAX_SIZE,
} from '../src/services/imageService.js';

describe('imageService', () => {
  beforeEach(() => reset());

  describe('validateImage', () => {
    test('принимает jpg', () => {
      expect(validateImage({ mime: 'image/jpeg', size: 1000 }).ok).toBe(true);
    });
    test('отклоняет txt', () => {
      const r = validateImage({ mime: 'text/plain', size: 100 });
      expect(r.ok).toBe(false);
      expect(r.error).toMatch(/формат/i);
    });
    test('отклоняет слишком большой файл', () => {
      const r = validateImage({ mime: 'image/png', size: MAX_SIZE + 1 });
      expect(r.ok).toBe(false);
      expect(r.error).toMatch(/размер/i);
    });
  });

  describe('saveImage', () => {
    test('сохраняет картинку и возвращает id/url', () => {
      const r = saveImage({ filename: 'a.jpg', mime: 'image/jpeg', size: 100, ownerId: 'u1' });
      expect(r.ok).toBe(true);
      expect(r.image.id).toBeTruthy();
      expect(r.image.url).toBe('/uploads/a.jpg');
    });
    test('не сохраняет невалидный файл', () => {
      const r = saveImage({ filename: 'a.txt', mime: 'text/plain', size: 100, ownerId: 'u1' });
      expect(r.ok).toBe(false);
    });
  });

  describe('getImage / deleteImage', () => {
    test('getImage находит сохранённую картинку', () => {
      const { image } = saveImage({ filename: 'b.jpg', mime: 'image/jpeg', size: 100, ownerId: 'u1' });
      expect(getImage(image.id).filename).toBe('b.jpg');
    });
    test('deleteImage удаляет картинку', () => {
      const { image } = saveImage({ filename: 'c.jpg', mime: 'image/jpeg', size: 100, ownerId: 'u1' });
      expect(deleteImage(image.id).ok).toBe(true);
      expect(getImage(image.id)).toBeUndefined();
    });
    test('deleteImage на несуществующий возвращает ошибку', () => {
      expect(deleteImage('nope').ok).toBe(false);
    });
  });
});