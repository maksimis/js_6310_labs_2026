// src/index.js
import dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot/index.js';
import { router } from './api/index.js';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для парсинга JSON
app.use(express.json());

// Подключаем API роуты
app.use('/api', router);

// Health check эндпоинт
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startApp() {
  console.log('🚀 KanbanBot is starting...');

  // Проверяем токен
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('❌ Ошибка: TELEGRAM_BOT_TOKEN не найден в файле .env');
    process.exit(1);
  }

  // Запускаем API
  app.listen(PORT, () => {
    console.log(`✅ API запущен на порту ${PORT}`);
    console.log(`📡 API доступен по адресу: http://localhost:${PORT}/api`);
  });

  // Запускаем бота
  bot.launch();
  console.log('✅ Бот успешно запущен и слушает сообщения!');
}

startApp();

// Корректное завершение работы
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  process.exit(0);
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  process.exit(0);
});