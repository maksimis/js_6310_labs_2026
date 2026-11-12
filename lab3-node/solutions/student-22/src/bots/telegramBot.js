import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import handleMessage from '../handlers/messageHandler.js';

const runTelegramBot = () => {
  dotenv.config({ quiet: true });
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.log('TELEGRAM_BOT_TOKEN не задан — бот не запущен');
    return null;
  }

  const bot = new TelegramBot(token, { polling: true });

  // Не роняем процесс при ошибках сети или API
  bot.on('polling_error', (error) => {
    console.error('Ошибка polling:', error.message);
  });

  bot.on('message', async (msg) => {
    try {
      // Состояние храним по пользователю, чтобы диалоги разных людей не смешивались
      const userId = msg.from ? msg.from.id : msg.chat.id;
      const reply = (text) => bot.sendMessage(msg.chat.id, text);
      await handleMessage(userId, msg.text, reply);
    } catch (error) {
      console.error('Ошибка обработки сообщения:', error.message);
    }
  });

  console.log('SortingBot запущен...');
  return bot;
};

export default runTelegramBot;
