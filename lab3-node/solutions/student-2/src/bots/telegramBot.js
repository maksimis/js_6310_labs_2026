import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import handleMessage from '../handlers/messageHandler.js';

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

  const reply = (msg) => async (text, options = {}) => {
    try {
      await bot.sendMessage(msg.chat.id, text, options);
    } catch {
      try {
        await bot.sendMessage(msg.chat.id, text);
      } catch (innerErr) {
        console.error('Ошибка отправки сообщения:', innerErr.message);
      }
    }
  };

  bot.on('message', async (msg) => {
    try {
      await handleMessage(msg.text, msg, reply(msg));
    } catch (error) {
      console.error('Ошибка обработки сообщения:', error.message);
    }
  });

  console.log('Telegram-бот запущен...');
};

export default runTelegramBot;