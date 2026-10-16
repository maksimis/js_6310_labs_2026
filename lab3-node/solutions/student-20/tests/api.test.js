import { expect, test } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/api.js';
import { KnowledgeBase } from '../src/knowledge.js';

test('добавленный через API фрагмент находится по ключевым словам', async () => {
  const app = createApp(new KnowledgeBase());
  const created = await request(app).post('/api/knowledge').send({
    title: 'Node.js', content: 'Среда выполнения JavaScript.'
  }).expect(201);

  expect(created.body).toEqual({
    id: 1, title: 'Node.js', content: 'Среда выполнения JavaScript.'
  });
  const found = await request(app).get('/api/search').query({ query: 'javascript' }).expect(200);
  expect(found.body).toEqual([{ id: 1, title: 'Node.js', relevance: 100 }]);
});

test('пустой заголовок отклоняется, после ошибки сервер принимает корректный фрагмент', async () => {
  const app = createApp(new KnowledgeBase());
  const invalid = await request(app).post('/api/knowledge').send({
    title: '   ', content: 'Описание'
  }).expect(400);
  expect(invalid.body.error).toMatch(/Заголовок/);
  await request(app).post('/api/knowledge').send({ title: 'Тема', content: 'Описание' }).expect(201);
});

test('поиск ранжирует по доле уникальных слов, учитывает заголовок и нормализует регистр и ё', async () => {
  const app = createApp(new KnowledgeBase());
  for (const entry of [
    { title: 'Жёлтый цвет', content: 'Пример' },
    { title: 'Второй', content: 'желтый и красный' },
    { title: 'Третий', content: 'красный, желтый' }
  ]) {
    await request(app).post('/api/knowledge').send(entry).expect(201);
  }
  const found = await request(app).get('/api/search').query({ query: 'ЖЁЛТЫЙ желтый красный!' }).expect(200);
  expect(found.body).toEqual([
    { id: 2, title: 'Второй', relevance: 100 },
    { id: 3, title: 'Третий', relevance: 100 },
    { id: 1, title: 'Жёлтый цвет', relevance: 50 }
  ]);
});

test('при отсутствии совпадений API возвращает пустой список', async () => {
  const app = createApp(new KnowledgeBase());
  await request(app).post('/api/knowledge').send({ title: 'Книга', content: 'Текст' }).expect(201);
  const found = await request(app).get('/api/search').query({ query: 'несуществующий' }).expect(200);
  expect(found.body).toEqual([]);
});

test.each([
  {}, null, [], { title: 42, content: 'Текст' },
  { title: 'Тема', content: false }, { title: 'Тема', content: ' ' },
  { title: 'я'.repeat(101), content: 'Текст' },
  { title: 'Тема', content: 'я'.repeat(3001) }
])('API отклоняет некорректный фрагмент %#', async body => {
  const response = await request(createApp(new KnowledgeBase()))
      .post('/api/knowledge').set('Content-Type', 'application/json')
      .send(JSON.stringify(body)).expect(400);
  expect(response.body.error).toEqual(expect.any(String));
});

test.each(['', ' ', '!!!', 'я'.repeat(201)])('API отклоняет некорректный запрос %#', async query => {
  const response = await request(createApp(new KnowledgeBase()))
      .get('/api/search').query({ query }).expect(400);
  expect(response.body.error).toEqual(expect.any(String));
});

test('отсутствующий и повторный query не приводят к падению', async () => {
  const app = createApp(new KnowledgeBase());
  await request(app).get('/api/search').expect(400);
  await request(app).get('/api/search?query=a&query=b').expect(400);
  await request(app).get('/api/search?query=корректный').expect(200);
});

test('API обрезает крайние пробелы и принимает граничные длины', async () => {
  const response = await request(createApp(new KnowledgeBase())).post('/api/knowledge')
      .send({ title: ` ${'я'.repeat(100)} `, content: ` ${'а'.repeat(3000)} ` }).expect(201);
  expect(response.body.title).toHaveLength(100);
  expect(response.body.content).toHaveLength(3000);
});

test('невалидный JSON, слишком большой запрос и неизвестный маршрут дают JSON-ошибки', async () => {
  const app = createApp(new KnowledgeBase());
  const malformed = await request(app).post('/api/knowledge')
      .set('Content-Type', 'application/json').send('{broken').expect(400);
  expect(malformed.body).toEqual({ error: 'Некорректный JSON.' });
  const large = await request(app).post('/api/knowledge').send({ content: 'a'.repeat(34000) }).expect(413);
  expect(large.body.error).toEqual(expect.any(String));
  const missing = await request(app).get('/missing').expect(404);
  expect(missing.body).toEqual({ error: 'Маршрут не найден.' });
});
