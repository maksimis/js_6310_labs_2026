'use strict';

import dotenv from 'dotenv';
import runVkBot from './bots/vkBot.js';
import runApiServer from './api/server.js';

dotenv.config();

console.log('Запуск KnowledgeBaseBot...');

// Запускаем API-сервер
const apiServer = runApiServer();

// Запускаем VK-бота
const vkBot = runVkBot();

if (vkBot) {
  console.log('VK-бот подключён');
} else {
  console.log('VK-бот не запущен (проверьте .env)');
}

console.log('Все сервисы запущены.');

// Корректное завершение при Ctrl+C
process.on('SIGINT', () => {
  console.log('\nОстановка сервисов...');
  if (apiServer) {
    apiServer.close();
  }
  process.exit(0);
});