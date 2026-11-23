import 'dotenv/config';
import { createTelegramBot } from './bots/telegramBot.js';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('Ошибка: переменная окружения TELEGRAM_BOT_TOKEN не задана в .env');
  process.exit(1);
}

createTelegramBot(token);
console.log('🤖 SudokuBot успешно запущен!');