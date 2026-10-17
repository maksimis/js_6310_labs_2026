import {
  describe,
  test,
  expect,
  beforeEach,
} from '@jest/globals';
import request from 'supertest';

import app from '../src/api/server.js';
import { clearTransactions } from '../src/services/transactionService.js';

describe('FinanceBot API', () => {
  beforeEach(() => {
    clearTransactions();
  });

  test('POST /api/transactions сохраняет транзакцию', async () => {
    const response = await request(app)
        .post('/api/transactions')
        .send({
          date: '2026-10-16',
          category: 'Еда',
          amount: 500,
        });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      ok: true,
      saved: {
        date: '2026-10-16',
        category: 'Еда',
        amount: 500,
      },
    });
  });

  test('POST /api/transactions отклоняет отрицательную сумму', async () => {
    const response = await request(app)
        .post('/api/transactions')
        .send({
          date: '2026-10-16',
          category: 'Еда',
          amount: -100,
        });

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(response.body.error)
        .toBe('Сумма должна быть положительным числом');
  });

  test('GET /api/report возвращает отчёт', async () => {
    await request(app)
        .post('/api/transactions')
        .send({
          date: '2026-10-10',
          category: 'Еда',
          amount: 500,
        });

    await request(app)
        .post('/api/transactions')
        .send({
          date: '2026-10-12',
          category: 'Транспорт',
          amount: 200,
        });

    const response = await request(app)
        .get('/api/report')
        .query({
          from: '2026-10-01',
          to: '2026-10-31',
        });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      total: 700,
      byCategory: {
        Еда: 500,
        Транспорт: 200,
      },
    });
  });
});
