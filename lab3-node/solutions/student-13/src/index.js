import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { createBot } from './bot.js';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)), quiet: true });
const token = process.env.TELEGRAM_BOT_TOKEN?.trim();

if (!token) {
  console.error('Не задан TELEGRAM_BOT_TOKEN. Скопируйте .env.example в .env и добавьте токен от @BotFather.');
  process.exitCode = 1;
} else {
  const bot = createBot(token);
  let running = false;
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => {
      if (running) {
        bot.stop(signal);
      }
    });
  }
  bot.launch({}, () => {
    running = true;
    console.log('DawBot запущен. Откройте своего бота в Telegram и отправьте /start.');
  }).catch(() => {
    console.error('Не удалось запустить DawBot. Проверьте токен, сеть и отсутствие второго запущенного экземпляра.');
    process.exitCode = 1;
  });
}
