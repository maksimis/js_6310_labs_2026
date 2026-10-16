import handleMessage, { clearUsers } from '../src/handlers/messageHandler.js';
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';

const FILE_PATH = path.resolve('data.json');

describe('Обработка сообщений', () => {
  beforeEach(() => {
    clearUsers();                                          
    if (fs.existsSync(FILE_PATH)) fs.unlinkSync(FILE_PATH); 
  });

  afterEach(() => {
    if (fs.existsSync(FILE_PATH)) fs.unlinkSync(FILE_PATH);
  });

  test('Ответ на команду /start', async () => {
    const reply = jest.fn().mockResolvedValue();
    await handleMessage(1, '/start', reply);
    expect(reply).toHaveBeenCalledTimes(1);
    const answer = reply.mock.calls[0][0];
    expect(answer).toContain('Тренировка началась');
    expect(answer).toContain('/type');
  });

  test('Команда /type, если пользователь ранее не ввел /start', async () => {
    const reply = jest.fn().mockResolvedValue();
    await handleMessage(11, '/type hello', reply);
    expect(reply).toHaveBeenCalledWith('Сначала начните тренировку командой /start.');
  });

  test('Ввести /type без текста', async () => {
    const reply = jest.fn().mockResolvedValue();
    await handleMessage(12, '/start', reply);
    reply.mockClear();
    await handleMessage(12, '/type', reply);
    expect(reply).toHaveBeenCalledWith(
      'Пришлите текст после команды: /type <ваш текст>'
    );
  });

  test('Ответ на команду /type', async () => {
    const reply = jest.fn().mockResolvedValue();
    await handleMessage(2, '/start', reply);
    const startAnswer = reply.mock.calls[0][0];
    const reference = startAnswer.split('\n\n')[1];
    reply.mockClear();

    await handleMessage(2, `/type ${reference}`, reply);
    const answer = reply.mock.calls[0][0];
    expect(answer).toContain('Результат:');
    expect(answer).toContain('Ошибок: 0');
    expect(answer).toContain('Точность: 100%');
    expect(answer).toContain('Скорость:');
  });

  test('Количество ошибок в метриках, когда текст с ошибками', async () => {
    const reply = jest.fn().mockResolvedValue();
    await handleMessage(3, '/start', reply);
    const startAnswer = reply.mock.calls[0][0];
    const reference = startAnswer.split('\n\n')[1];
    reply.mockClear();

    const wrong = reference.slice(0, -1) + '!';
    await handleMessage(3, `/type ${wrong}`, reply);
    const answer = reply.mock.calls[0][0];
    expect(answer).toContain('Ошибок: 1');
  });

  test('/stats если тренировок еще не было', async () => {
    const reply = jest.fn().mockResolvedValue();
    await handleMessage(4, '/stats', reply);
    expect(reply).toHaveBeenCalledWith(
      'Пока нет завершённых тренировок. Начните с /start.'
    );
  });

  test('Ответ на команду /stats', async () => {
    const reply = jest.fn().mockResolvedValue();
  
    await handleMessage(5, '/start', reply);
    let ref = reply.mock.calls[0][0].split('\n\n')[1];
    reply.mockClear();
    await handleMessage(5, `/type ${ref}`, reply);
    reply.mockClear();

    await handleMessage(5, '/start', reply);
    ref = reply.mock.calls[0][0].split('\n\n')[1];
    reply.mockClear();
    await handleMessage(5, `/type ${ref}`, reply);
    reply.mockClear();

    await handleMessage(5, '/stats', reply);
    const answer = reply.mock.calls[0][0];
    expect(answer).toContain('Тренировок: 2');
    expect(answer).toContain('Лучший результат:');
    expect(answer).toContain('Средняя скорость:');
    expect(answer).toContain('Последние:');
  });

  test('Неизвестная команда', async () => {
    const reply = jest.fn().mockResolvedValue();
    await handleMessage(6, '/foo', reply);
    expect(reply).toHaveBeenCalledWith(
      'Неизвестная команда. Доступно: /start, /type, /stats.'
    );
  });

  test('Некорректные аргументы', async () => {
    await expect(handleMessage(8, '/start', null)).resolves.toBeUndefined();
  });

  test('Состояние каждого пользователя хранится отдельно', async () => {
    const reply = jest.fn().mockResolvedValue();
    await handleMessage(100, '/start', reply);
    reply.mockClear();
    await handleMessage(101, '/type abc', reply);
    expect(reply).toHaveBeenCalledWith('Сначала начните тренировку командой /start.');
  });

  test('clearUsers очищает состояние пользователей', async () => {
  const reply = jest.fn().mockResolvedValue();
  await handleMessage(200, '/start', reply);
  reply.mockClear();
  await handleMessage(200, '/type abc', reply);
  expect(reply.mock.calls[0][0]).toContain('Результат:');

  clearUsers();
  reply.mockClear();
  await handleMessage(200, '/type abc', reply);
  expect(reply).toHaveBeenCalledWith('Сначала начните тренировку командой /start.');
  });
});