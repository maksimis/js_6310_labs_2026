import { afterEach, expect, jest, test } from '@jest/globals';
import { Telegram } from 'telegraf';
import { createTelegramBot } from '../src/telegram.js';
import { KnowledgeBase } from '../src/knowledge.js';
import { createApp } from '../src/api.js';
import request from 'supertest';

afterEach(() => jest.restoreAllMocks());

function update(text, userId = 20) {
  return {
    update_id: 1,
    message: {
      message_id: 1, date: 0,
      from: { id: userId, is_bot: false, first_name: 'Студент' },
      chat: { id: -100, type: 'group', title: 'Локальная проверка' },
      text
    }
  };
}

test('Telegram-адаптер отвечает на обновление и использует фрагменты из HTTP API', async () => {
  const knowledge = new KnowledgeBase();
  await request(createApp(knowledge)).post('/api/knowledge').send({
    title: 'Документация', content: 'Node исполняет JavaScript.'
  }).expect(201);
  const messages = [];
  jest.spyOn(Telegram.prototype, 'callApi').mockImplementation(async (method, payload) => {
    if (method !== 'sendMessage') throw new Error('Неожиданный сетевой вызов');
    messages.push({ chatId: payload.chat_id, text: payload.text });
    return { message_id: 1 };
  });
  const bot = createTelegramBot('123:local-test', knowledge);
  bot.botInfo = { id: 123, is_bot: true, first_name: 'Knowledge', username: 'KnowledgeBot' };
  await bot.handleUpdate(update('/ask@KnowledgeBot javascript'));
  expect(messages).toEqual([
    { chatId: -100, text: 'Node исполняет JavaScript.\n\nИсточник: Документация' }
  ]);
});

test('сообщение другому боту не прерывает собственный диалог добавления', async () => {
  const messages = [];
  jest.spyOn(Telegram.prototype, 'callApi').mockImplementation(async (method, payload) => {
    messages.push(payload.text);
    return { message_id: 1 };
  });
  const bot = createTelegramBot('123:local-test', new KnowledgeBase());
  bot.botInfo = { id: 123, is_bot: true, first_name: 'Knowledge', username: 'KnowledgeBot' };
  await bot.handleUpdate(update('/add_knowledge'));
  await bot.handleUpdate(update('/start@OtherBot'));
  await bot.handleUpdate(update('Тема'));
  expect(messages).toEqual([
    'Введите заголовок (тему) фрагмента, до 100 символов.',
    'Введите содержание фрагмента, до 3000 символов.'
  ]);
});

test('ошибка Telegram API не завершает обработчик и не раскрывает подробности', async () => {
  const network = jest.spyOn(Telegram.prototype, 'callApi')
      .mockRejectedValueOnce(new Error('Приватные подробности сетевого запроса'))
      .mockResolvedValue({ message_id: 1 });
  const log = jest.spyOn(console, 'error').mockImplementation(() => {});
  const bot = createTelegramBot('123:local-test', new KnowledgeBase());
  bot.botInfo = { id: 123, is_bot: true, first_name: 'Knowledge', username: 'KnowledgeBot' };
  await expect(bot.handleUpdate(update('/start'))).resolves.toBeUndefined();
  expect(log).toHaveBeenCalledWith('Не удалось обработать сообщение Telegram. Проверьте подключение.');
  await expect(bot.handleUpdate(update('/help'))).resolves.toBeUndefined();
  expect(network).toHaveBeenLastCalledWith('sendMessage', expect.objectContaining({
    text: expect.stringContaining('/add_knowledge')
  }));
});

test('обновления без автора пропускаются, вложения получают просьбу отправить текст', async () => {
  const messages = [];
  jest.spyOn(Telegram.prototype, 'callApi').mockImplementation(async (method, payload) => {
    messages.push(payload.text);
    return { message_id: 1 };
  });
  const bot = createTelegramBot('123:local-test', new KnowledgeBase());
  bot.botInfo = { id: 123, is_bot: true, first_name: 'Knowledge', username: 'KnowledgeBot' };
  const noAuthor = update('/start');
  delete noAuthor.message.from;
  await bot.handleUpdate(noAuthor);
  const photo = update(undefined);
  photo.message.photo = [{ file_id: 'local', file_unique_id: 'local', width: 1, height: 1 }];
  await bot.handleUpdate(photo);
  expect(messages).toEqual(['Отправьте текстовое сообщение.']);
});
