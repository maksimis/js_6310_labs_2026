import { describe, test, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/api/server.js';
import { clearFragments, addFragment } from '../src/knowledge/knowledgeBase.js';

describe('API', () => {
  beforeEach(() => {
    clearFragments();
  });

  describe('GET /api/search', () => {
    test('возвращает пустой массив, если база пуста', async () => {
      const response = await request(app).get('/api/search?query=javascript');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('находит фрагмент по запросу', async () => {
      addFragment('JavaScript', 'Язык программирования');

      const response = await request(app).get('/api/search?query=javascript');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('JavaScript');
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('relevance');
    });

    test('возвращает 400 без параметра query', async () => {
      const response = await request(app).get('/api/search');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('возвращает 400 при пустом query', async () => {
      const response = await request(app).get('/api/search?query=');

      expect(response.status).toBe(400);
    });

    test('не возвращает content в ответе (только id, title, relevance)', async () => {
      addFragment('JavaScript', 'Язык программирования');

      const response = await request(app).get('/api/search?query=javascript');

      expect(response.body[0]).not.toHaveProperty('content');
    });
  });

  describe('POST /api/knowledge', () => {
    test('добавляет фрагмент', async () => {
      const response = await request(app)
        .post('/api/knowledge')
        .send({ title: 'Python', content: 'Язык для анализа данных' });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Python');
      expect(response.body.id).toBe(1);
    });

    test('добавленный фрагмент доступен в поиске', async () => {
      await request(app)
        .post('/api/knowledge')
        .send({ title: 'Python', content: 'Язык программирования' });

      const searchResponse = await request(app).get('/api/search?query=python');

      expect(searchResponse.body).toHaveLength(1);
      expect(searchResponse.body[0].title).toBe('Python');
    });

    test('возвращает 400 без title', async () => {
      const response = await request(app)
        .post('/api/knowledge')
        .send({ content: 'Только контент' });

      expect(response.status).toBe(400);
    });

    test('возвращает 400 без content', async () => {
      const response = await request(app)
        .post('/api/knowledge')
        .send({ title: 'Только заголовок' });

      expect(response.status).toBe(400);
    });

    test('возвращает 400 при пустом title', async () => {
      const response = await request(app)
        .post('/api/knowledge')
        .send({ title: '   ', content: 'Текст' });

      expect(response.status).toBe(400);
    });

    test('возвращает 400 при пустом content', async () => {
      const response = await request(app)
        .post('/api/knowledge')
        .send({ title: 'Заголовок', content: '   ' });

      expect(response.status).toBe(400);
    });

    test('возвращает 400 при пустом теле запроса', async () => {
      const response = await request(app).post('/api/knowledge');

      expect(response.status).toBe(400);
    });
  });

  describe('404 для несуществующих путей', () => {
    test('возвращает 404 на неизвестный путь', async () => {
      const response = await request(app).get('/api/unknown');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    test('возвращает 404 на корень', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(404);
    });
  });
});