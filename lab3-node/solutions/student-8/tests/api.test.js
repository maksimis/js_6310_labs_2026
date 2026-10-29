import { describe, test, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/api/server.js';
import { clearCards } from '../src/cards/cardManager.js';

describe('API Cards', () => {
  beforeEach(() => clearCards());

  test('GET /api/cards возвращает пустой массив', async () => {
    const res = await request(app).get('/api/cards');
    expect(res.status).toBe(200);
    expect(res.body.cards).toEqual([]);
  });

  test('POST /api/cards создает карточку', async () => {
    const res = await request(app).post('/api/cards').send({ word: 'cat', translation: 'кот' });
    expect(res.status).toBe(201);
    expect(res.body.word).toBe('cat');
  });

  test('GET /api/cards возвращает список карточек', async () => {
    await request(app).post('/api/cards').send({ word: 'cat', translation: 'кот' });
    const res = await request(app).get('/api/cards');
    expect(res.status).toBe(200);
    expect(res.body.cards.length).toBe(1);
  });

  test('POST без данных выдает 400', async () => {
    const res = await request(app).post('/api/cards').send({});
    expect(res.status).toBe(400);
  });

  test('POST с пустым словом выдает 400', async () => {
    const res = await request(app).post('/api/cards').send({ word: '', translation: 'кот' });
    expect(res.status).toBe(400);
  });

  test('POST без Content-Type (вызывает req.body || {})', async () => {
    const res = await request(app)
      .post('/api/cards')
      .send('word=cat&translation=кот'); 
    expect(res.status).toBe(400);
  });

  test('404 для несуществующего пути', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });

    test('POST /api/cards с некорректным типом данных вызывает 500', async () => {
    // Отправляем в поле word не строку, а объект. 
    // Наш cardManager попытается сделать .trim() и выбросит ошибку.
    const res = await request(app)
      .post('/api/cards')
      .send({ word: { bad: 'object' }, translation: 'кот' });
    
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Внутренняя ошибка');
  });
});