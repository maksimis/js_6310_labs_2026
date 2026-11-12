import { expect, test } from '@jest/globals';
import { createMessageHandler } from '../src/messages.js';
import { KnowledgeBase } from '../src/knowledge.js';
import request from 'supertest';
import { createApp } from '../src/api.js';

test('/ask возвращает контекст с названием источника из базы', () => {
  const knowledge = new KnowledgeBase();
  knowledge.add({ title: 'Node.js', content: 'Среда выполнения JavaScript.' });
  const handle = createMessageHandler(knowledge);
  const send = text => handle({ chatId: 1, userId: 20, text });
  expect(send('/ask')).toContain('вопрос');
  expect(send('javascript')).toBe('Среда выполнения JavaScript.\n\nИсточник: Node.js');
});

test('два пользователя одного чата независимо добавляют фрагменты, доступные API', async () => {
  const knowledge = new KnowledgeBase();
  const handle = createMessageHandler(knowledge);
  const send = (userId, text) => handle({ chatId: -100, userId, text });

  expect(send(20, '/add_knowledge')).toContain('заголовок');
  send(21, '/add_knowledge');
  send(20, 'Первая тема');
  send(21, 'Вторая тема');
  expect(send(21, 'Содержимое второго пользователя')).toContain('Добавлен');
  expect(send(20, 'Содержимое первого пользователя')).toContain('Добавлен');

  const found = await request(createApp(knowledge)).get('/api/search').query({ query: 'содержимое' });
  expect(found.body).toEqual([
    { id: 1, title: 'Вторая тема', relevance: 100 },
    { id: 2, title: 'Первая тема', relevance: 100 }
  ]);
  expect(send(20, '/ask первого')).toBe('Содержимое первого пользователя\n\nИсточник: Первая тема');
});

test('/search принимает аргумент команды и показывает релевантность', () => {
  const knowledge = new KnowledgeBase();
  knowledge.add({ title: 'Node.js', content: 'JavaScript' });
  const handle = createMessageHandler(knowledge);
  expect(handle({ chatId: 1, userId: 20, text: '/search javascript' }))
      .toBe('Найденные фрагменты:\n1. Node.js — 100%');
});

test('ошибка ввода сохраняет шаг добавления, исправленный фрагмент находится', () => {
  const handle = createMessageHandler(new KnowledgeBase());
  const send = text => handle({ chatId: 1, userId: 20, text });
  send('/add_knowledge');
  expect(send(' ')).toContain('Заголовок');
  expect(send('я'.repeat(101))).toContain('100');
  expect(send('Тема')).toContain('содержание');
  expect(send(undefined)).toContain('текстовое');
  expect(send('я'.repeat(3001))).toContain('3000');
  expect(send(' ')).toContain('Содержание');
  expect(send('Правильный текст')).toContain('Добавлен');
  expect(send('/ask правильный')).toContain('Источник: Тема');
});

test('состояния одного пользователя в разных чатах независимы', () => {
  const handle = createMessageHandler(new KnowledgeBase());
  const send = (chatId, text) => handle({ chatId, userId: 20, text });
  send(1, '/add_knowledge');
  send(2, '/add_knowledge');
  send(1, 'Первая');
  send(2, 'Вторая');
  expect(send(1, 'Альфа')).toContain('Первая');
  expect(send(2, 'Бета')).toContain('Вторая');
});

test.each(['/cancel', '/start', '/help', '/unknown'])('%s прерывает незавершённое добавление', command => {
  const knowledge = new KnowledgeBase();
  const handle = createMessageHandler(knowledge);
  const send = text => handle({ chatId: 1, userId: 20, text });
  send('/add_knowledge');
  send('Черновик');
  send(command);
  expect(send('Не сохранять')).toContain('/add_knowledge');
  expect(send('/search черновик')).toContain('не найдено');
});

test('новая команда прерывает добавление, /search принимает следующий текст', () => {
  const knowledge = new KnowledgeBase();
  knowledge.add({ title: 'Справка', content: 'Описание' });
  const handle = createMessageHandler(knowledge);
  const send = text => handle({ chatId: 1, userId: 20, text });
  send('/add_knowledge');
  expect(send('/search')).toContain('ключевые слова');
  expect(send('!!!')).toContain('слово или число');
  expect(send('описание')).toContain('Справка — 100%');
  expect(send('описание')).toContain('/ask');
});

test('поиск ограничивает выдачу бота пятью результатами', () => {
  const knowledge = new KnowledgeBase();
  for (let id = 1; id <= 6; id++) knowledge.add({ title: `Тема ${id}`, content: 'Общее слово' });
  const response = createMessageHandler(knowledge)({ chatId: 1, userId: 20, text: '/search общее' });
  expect(response).toContain('5. Тема 5');
  expect(response).not.toContain('Тема 6');
});

test('справка, неизвестные команды, нетекстовые сообщения и неверные идентификаторы обработаны', () => {
  const handle = createMessageHandler(new KnowledgeBase());
  const send = text => handle({ chatId: 1, userId: 20, text });
  expect(send('/start')).toContain('/add_knowledge');
  expect(send('/help')).toContain('/search');
  expect(send('/???')).toContain('Неизвестная команда');
  expect(send('/ask@KnowledgeBot нет')).toContain('не найдено');
  expect(send(undefined)).toContain('текстовое');
  expect(handle({ chatId: null, userId: 20, text: '/start' })).toContain('определить');
  expect(handle({ chatId: 1, userId: undefined, text: '/start' })).toContain('определить');
});
