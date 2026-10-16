import dotenv from 'dotenv';
import { KnowledgeBase } from './knowledge.js';
import { createApp } from './api.js';
import { createTelegramBot } from './telegram.js';

dotenv.config({ quiet: true });

const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT должен быть целым числом от 1 до 65535.');
  process.exitCode = 1;
} else {
  const knowledge = new KnowledgeBase();
  const server = createApp(knowledge).listen(port, '127.0.0.1');
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  let bot;
  let botRunning = false;

  server.on('error', () => {
    console.error('Не удалось запустить API. Проверьте PORT и доступность порта.');
    process.exitCode = 1;
  });

  server.on('listening', () => {
    console.log(`API: http://127.0.0.1:${port}`);
    if (!token) {
      console.log('Telegram выключен: добавьте TELEGRAM_BOT_TOKEN в .env. API доступен.');
      return;
    }
    bot = createTelegramBot(token, knowledge);
    bot.launch({}, () => {
      botRunning = true;
      console.log('Telegram подключён.');
    }).catch(() => {
      console.error('Не удалось подключить Telegram. Проверьте токен и соединение. API доступен.');
    });
  });

  function shutdown() {
    if (botRunning) bot.stop();
    server.close();
  }

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}
