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
      } catch (error) {
        console.error('Не удалось отправить сообщение:', error.message);
      }
    };
    await handleMessage(message.text, message, reply);
  });
  console.log('ExpenseBot запущен.');
  return bot;
};

export default runTelegramBot;
