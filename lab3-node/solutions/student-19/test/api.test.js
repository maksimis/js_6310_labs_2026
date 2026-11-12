import { describe, test, expect, beforeEach} from '@jest/globals';
import request from 'supertest';
import { createApi } from '../src/api/index.js';
import { ProviderRegistry } from '../src/providers/index.js';
import { MockProvider } from '../src/providers/mock.js';

describe('API', () => {
  let app;
  let registry;

  beforeEach(() => {
    registry = new ProviderRegistry();
    registry.register(new MockProvider());
    app = createApi(registry);
  });

  test('GET /api/providers returns list', async () => {
    const res = await request(app).get('/api/providers');
    expect(res.status).toBe(200);
    expect(res.body.providers).toHaveLength(1);
    expect(res.body.providers[0].name).toBe('mock');
    expect(res.body.providers[0].models).toContain('mock-small');
  });

  test('POST /api/chat returns reply', async () => {
    const res = await request(app).post('/api/chat').send({ provider: 'mock', model: 'mock-small', message: 'hello' });
    expect(res.status).toBe(200);
    expect(res.body.reply).toContain('Echo: hello');
    expect(res.body.provider).toBe('mock');
    expect(res.body.model).toBe('mock-small');
  });

  test('POST /api/chat rejects missing provider', async () => {
    const res = await request(app).post('/api/chat').send({ model: 'mock-small', message: 'hi' });
    expect(res.status).toBe(400);
  });

  test('POST /api/chat rejects missing model', async () => {
    const res = await request(app).post('/api/chat').send({ provider: 'mock', message: 'hi' });
    expect(res.status).toBe(400);
  });

  test('POST /api/chat rejects missing message', async () => {
    const res = await request(app).post('/api/chat').send({ provider: 'mock', model: 'mock-small' });
    expect(res.status).toBe(400);
  });

  test('POST /api/chat rejects unknown provider', async () => {
    const res = await request(app).post('/api/chat').send({ provider: 'nope', model: 'x', message: 'hi' });
    expect(res.status).toBe(404);
  });

  test('POST /api/chat rejects unknown model', async () => {
    const res = await request(app).post('/api/chat').send({ provider: 'mock', model: 'nope', message: 'hi' });
    expect(res.status).toBe(400);
  });

  test('unknown route returns 404', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
  });

  test('POST /api/chat rejects non-string provider', async () => {
    const res = await request(app).post('/api/chat').send({ provider: 123, model: 'x', message: 'hi' });
    expect(res.status).toBe(400);
  });
  test('POST /api/chat rejects invalid JSON with 400', async () => {
    const res = await request(app).post('/api/chat').set('Content-Type', 'application/json').send('{ "provider": "mock", }');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid JSON payload');
  });
});