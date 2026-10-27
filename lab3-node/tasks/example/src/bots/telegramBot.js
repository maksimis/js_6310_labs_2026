import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'
import handleMessage from '../handlers/messageHandler.js'

const runTelegramBot = () => {
  dotenv.config();
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.log('TELEGRAM_BOT_TOKEN не задан — Telegram-бот пропущен');
    return;
  }

  // Создаем экземпляр бота
  const bot = new TelegramBot(token, { polling: true });

  // Не роняем процесс при ошибках API (например, невалидный токен)
  bot.on('error', (error) => {
    console.error('Ошибка Telegram-бота:', error.message);
  });

  const reply = (msg) => (text) => bot.sendMessage(msg.chat.id, text);

  // Обрабатываем текстовые сообщения
  bot.on('message', (msg) => {
    handleMessage(msg.text, reply(msg));
  });

  console.log('Telegram-бот запущен...');
}

export default runTelegramBot;