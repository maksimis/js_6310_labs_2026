import { describe, test, expect, beforeEach } from '@jest/globals';
import { reset } from '../src/services/storage.js';
import { saveImage } from '../src/services/imageService.js';
import {
  createAlbum,
  listAlbums,
  addImageToAlbum,
  removeImageFromAlbum,
  getAlbumImages,
} from '../src/services/albumService.js';

describe('albumService', () => {
  beforeEach(() => reset());

  const makeImage = (ownerId = 'u1') =>
    saveImage({ filename: 'x.jpg', mime: 'image/jpeg', size: 100, ownerId }).image;

  describe('createAlbum', () => {
    test('создаёт альбом с именем', () => {
      const r = createAlbum('Мои фото', 'u1');
      expect(r.ok).toBe(true);
      expect(r.album.name).toBe('Мои фото');
      expect(r.album.ownerId).toBe('u1');
    });
    test('отклоняет пустое имя', () => {
      expect(createAlbum('', 'u1').ok).toBe(false);
      expect(createAlbum('   ', 'u1').ok).toBe(false);
    });
  });

  describe('listAlbums', () => {
    test('возвращает только альбомы владельца', () => {
      createAlbum('A', 'u1');
      createAlbum('B', 'u2');
      expect(listAlbums('u1').length).toBe(1);
      expect(listAlbums('u1')[0].name).toBe('A');
    });
  });

  describe('addImageToAlbum', () => {
    test('добавляет картинку в альбом', () => {
      const { album } = createAlbum('A', 'u1');
      const img = makeImage('u1');
      const r = addImageToAlbum(album.id, img.id, 'u1');
      expect(r.ok).toBe(true);
      expect(r.album.imageIds).toContain(img.id);
    });
    test('не добавляет чужую картинку', () => {
      const { album } = createAlbum('A', 'u1');
      const img = makeImage('u2');
      expect(addImageToAlbum(album.id, img.id, 'u1').ok).toBe(false);
    });
    test('не добавляет в несуществующий альбом', () => {
      const img = makeImage('u1');
      expect(addImageToAlbum('nope', img.id, 'u1').ok).toBe(false);
    });
  });

  describe('getAlbumImages / removeImageFromAlbum', () => {
    test('возвращает картинки альбома', () => {
      const { album } = createAlbum('A', 'u1');
      const img = makeImage('u1');
      addImageToAlbum(album.id, img.id, 'u1');
      const r = getAlbumImages(album.id, 'u1');
      expect(r.ok).toBe(true);
      expect(r.images.length).toBe(1);
    });
    test('удаляет картинку из альбома', () => {
      const { album } = createAlbum('A', 'u1');
      const img = makeImage('u1');
      addImageToAlbum(album.id, img.id, 'u1');
      expect(removeImageFromAlbum(album.id, img.id, 'u1').ok).toBe(true);
      expect(getAlbumImages(album.id, 'u1').images.length).toBe(0);
    });
  });
});