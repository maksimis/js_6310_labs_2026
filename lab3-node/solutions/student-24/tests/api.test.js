// tests/api.test.js
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { router } from '../src/api/index.js';

// Создаём приложение в памяти — сервер на порту не нужен
const app = express();
app.use(express.json());
app.use('/api', router);

describe('API Endpoints', () => {
  it('GET /api/board должен возвращать состояние доски', async () => {
    const response = await request(app)
      .get('/api/board')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toBeDefined();
  });

});

