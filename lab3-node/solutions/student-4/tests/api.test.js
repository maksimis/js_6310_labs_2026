import { beforeEach, describe, expect, test } from '@jest/globals';
import request from 'supertest';
import createServer from '../src/api/server.js';
import { clearGames } from '../src/services/gameStore.js';

const app = createServer();

describe('API', () => {
  beforeEach(() => clearGames());

  test('POST /api/games creates a game', async () => {
    const res = await request(app).post('/api/games');
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('code');
  });

  test('POST /api/games/:id/move requires fields', async () => {
    const create = await request(app).post('/api/games');
    const res = await request(app)
        .post(`/api/games/${create.body.id}/move`)
        .send({});
    expect(res.status).toBe(400);
  });

  test('POST /api/games/:id/move rejects invalid direction', async () => {
    const create = await request(app).post('/api/games');
    const res = await request(app)
        .post(`/api/games/${create.body.id}/move`)
        .send({ player: 1, direction: 'diagonal' });
    expect(res.status).toBe(400);
  });

  test('POST /api/games/:id/move rejects unknown game', async () => {
    const res = await request(app)
        .post('/api/games/999/move')
        .send({ player: 1, direction: 'up' });
    expect(res.status).toBe(404);
  });

  test('POST /api/games/:id/move moves the snake', async () => {
    const create = await request(app).post('/api/games');
    const res = await request(app)
        .post(`/api/games/${create.body.id}/move`)
        .send({ player: 1, direction: 'right' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('field');
    expect(res.body.score).toBe(1);
  });

  test('POST /api/games/:id/move rejects wall collision', async () => {
    const create = await request(app).post('/api/games');
    await request(app)
        .post(`/api/games/${create.body.id}/move`)
        .send({ player: 1, direction: 'up' });
    const res = await request(app)
        .post(`/api/games/${create.body.id}/move`)
        .send({ player: 1, direction: 'up' });
    expect(res.status).toBe(400);
  });
});