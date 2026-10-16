import { describe, test, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/api/server.js';
import { reset } from '../src/services/storage.js';

describe('API server', () => {
  beforeEach(() => reset());

  describe('POST /api/images', () => {
    test('загружает картинку и возвращает { id, url }', async () => {
      const png = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
      const res = await request(app)
          .post('/api/images')
          .attach('image', png, { filename: 'test.png', contentType: 'image/png' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.url).toMatch(/^\/uploads\//);
    });

    test('400 без файла', async () => {
      const res = await request(app).post('/api/images');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('400 при неверном формате', async () => {
      const txt = Buffer.from('hello');
      const res = await request(app)
          .post('/api/images')
          .attach('image', txt, { filename: 'a.txt', contentType: 'text/plain' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/формат/i);
    });
  });

  describe('GET /api/albums/:albumId/images', () => {
    test('404 для несуществующего альбома', async () => {
      const res = await request(app).get('/api/albums/nope/images');
      expect(res.status).toBe(404);
    });

    test('возвращает пустой массив для нового альбома', async () => {
      // создаём альбом через сервис напрямую
      const { createAlbum } = await import('../src/services/albumService.js');
      const { album } = createAlbum('Тест', 'u1');
      const res = await request(app).get(`/api/albums/${album.id}/images`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('404 для неизвестных путей', () => {
    test('GET /unknown → 404', async () => {
      const res = await request(app).get('/unknown');
      expect(res.status).toBe(404);
    });
  });
});