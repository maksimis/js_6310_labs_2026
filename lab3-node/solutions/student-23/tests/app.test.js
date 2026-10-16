import request from 'supertest';
import { createApp } from '../src/app.js';
import { clearTasks, clearStats } from '../src/storage.js';

const app = createApp();

describe('API', () => {
  beforeEach(() => {
    clearTasks();
    clearStats();
  });

  it('POST /api/tasks/generate возвращает задание', async () => {
    const res = await request(app)
      .post('/api/tasks/generate')
      .send({ topic: 'js', type: 'test' });
    expect(res.status).toBe(200);
    expect(res.body.id).toBeTruthy();
    expect(res.body.type).toBe('test');
  });

  it('POST /api/tasks/generate 400 при неверной теме', async () => {
    const res = await request(app)
      .post('/api/tasks/generate')
      .send({ topic: 'c++', type: 'test' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it('POST /api/tasks/generate 400 при неверном типе', async () => {
    const res = await request(app)
      .post('/api/tasks/generate')
      .send({ topic: 'js', type: 'quiz' });
    expect(res.status).toBe(400);
  });

  it('POST /api/tasks/check работает end-to-end', async () => {
    const gen = await request(app)
      .post('/api/tasks/generate')
      .send({ topic: 'js', type: 'test' });
    const letter = String.fromCharCode(65 + gen.body.correctAnswer);
    const res = await request(app)
      .post('/api/tasks/check')
      .send({ taskId: gen.body.id, answer: letter });
    expect(res.status).toBe(200);
    expect(res.body.correct).toBe(true);
    expect(res.body.comment).toBeTruthy();
  });

  it('POST /api/tasks/check 400 при неверном теле', async () => {
    const res = await request(app)
      .post('/api/tasks/check')
      .send({ taskId: 'x' });
    expect(res.status).toBe(400);
  });

  it('POST /api/tasks/check 400 если задание не найдено', async () => {
    const res = await request(app)
      .post('/api/tasks/check')
      .send({ taskId: 'nope', answer: 'A' });
    expect(res.status).toBe(400);
  });

  it('возвращает 400 на некорректный JSON', async () => {
    const res = await request(app)
      .post('/api/tasks/generate')
      .set('Content-Type', 'application/json')
      .send('{invalid json');
    expect(res.status).toBe(400);
  });
}); 