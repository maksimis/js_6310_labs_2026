import { describe, test, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/services/api.js';
import { _resetStore } from '../src/services/surveyService.js';

describe('API Endpoints', () => {
  beforeEach(() => {
    _resetStore();
  });

  test('POST /api/surveys creates a survey', async () => {
    const response = await request(app)
        .post('/api/surveys')
        .send({
          topic: 'API Test',
          questions: [
            { question: 'Q1', options: ['Yes', 'No'] }
          ]
        });

    expect(response.status).toBe(201);
    expect(response.body.id).toBe(1);
    expect(typeof response.body.code).toBe('string');
  });

  test('POST rejects empty topic and questions', async () => {
    const response = await request(app)
        .post('/api/surveys')
        .send({
          topic: '',
          questions: []
        });

    expect(response.status).toBe(400);
  });

  test('POST rejects null question with 400', async () => {
    const response = await request(app)
        .post('/api/surveys')
        .send({
          topic: 'Test',
          questions: [null]
        });

    expect(response.status).toBe(400);
  });

  test('POST rejects missing fields', async () => {
    const response = await request(app)
        .post('/api/surveys')
        .send({});

    expect(response.status).toBe(400);
  });

  test('POST rejects blank question', async () => {
    const response = await request(app)
        .post('/api/surveys')
        .send({
          topic: 'Test',
          questions: [
            { question: ' ', options: ['A', 'B'] }
          ]
        });

    expect(response.status).toBe(400);
  });

  test('POST rejects invalid options', async () => {
    const response = await request(app)
        .post('/api/surveys')
        .send({
          topic: 'Test',
          questions: [
            { question: 'Q', options: ['A', null] }
          ]
        });

    expect(response.status).toBe(400);
  });

  test('GET returns survey results', async () => {
    const createResponse = await request(app)
        .post('/api/surveys')
        .send({
          topic: 'API Test 2',
          questions: [
            { question: 'Q1', options: ['Yes', 'No'] }
          ]
        });

    const response = await request(app)
        .get(`/api/surveys/${createResponse.body.id}/results`);

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(0);
    expect(response.body.distribution[0]).toEqual({
      Yes: 0,
      No: 0
    });
  });

  test('GET returns 404 for unknown survey', async () => {
    const response = await request(app)
        .get('/api/surveys/unknown/results');

    expect(response.status).toBe(404);
  });
});