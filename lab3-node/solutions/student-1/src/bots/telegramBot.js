import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import handleMessage from '../handlers/messageHandler.js';

const runTelegramBot = () => {
  dotenv.config();
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log('TELEGRAM_BOT_TOKEN не задан — бот не запущен.');
    return null;
  }

  const bot = new TelegramBot(token, { polling: true });
  bot.on('polling_error', (error) => console.error('Ошибка Telegram-бота:', error.message));
  bot.on('message', async (message) => {
    const reply = async (response) => {
      try {
        await bot.sendMessage(message.chat.id, response);
      } catch {
        // Network failures must not stop message processing. The next update
        // can be handled normally when the Telegram connection is restored.
      }
    };
    await handleMessage(message.text, message, reply);
  });
  console.log('ExpenseBot запущен.');
  return bot;
};

export default runTelegramBot;
