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

  const bot = new TelegramBot(token, { polling: true });

  bot.on('error', (error) => {
    console.error('Ошибка Telegram-бота:', error.message);
  });

  const reply = (msg) => (text) => bot.sendMessage(msg.chat.id, text);

  bot.on('message', (msg) => {
    const userId = msg.from ? String(msg.from.id) : 'anonymous';
    handleMessage(msg.text, reply(msg), userId);
  });

  console.log('Telegram-бот запущен...');
}

export default runTelegramBot;