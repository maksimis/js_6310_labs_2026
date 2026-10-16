import { describe, test, expect, beforeAll } from '@jest/globals';
import request from 'supertest'; // Нужно установить: npm install --save-dev supertest
import app from '../src/services/api.js';
import { _resetStore } from '../src/services/surveyService.js';

describe('API Endpoints', () => {
  beforeAll(() => {
    _resetStore();
  });

  test('POST /api/surveys creates a survey', async () => {
    const response = await request(app)
        .post('/api/surveys')
        .send({
          topic: 'API Test',
          questions: [{ question: 'Q1', options: ['Yes', 'No'] }],
        });
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.code).toBeDefined();
  });

  test('POST /api/surveys returns 400 for invalid data', async () => {
    const response = await request(app)
        .post('/api/surveys')
        .send({ topic: '', questions: [] });
    expect(response.status).toBe(400);
  });

  test('GET /api/surveys/:id/results returns results', async () => {
    const createRes = await request(app)
        .post('/api/surveys')
        .send({
          topic: 'API Test 2',
          questions: [{ question: 'Q1', options: ['Yes', 'No'] }],
        });
    const { id } = createRes.body;

    const response = await request(app).get(`/api/surveys/${id}/results`);
    expect(response.status).toBe(200);
    expect(response.body.total).toBe(0);
  });

  test('GET /api/surveys/:id/results returns 404 for unknown id', async () => {
    const response = await request(app).get('/api/surveys/unknown/results');
    expect(response.status).toBe(404);
  });
});