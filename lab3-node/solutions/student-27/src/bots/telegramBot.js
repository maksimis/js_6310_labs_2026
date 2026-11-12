import TelegramBot from 'node-telegram-bot-api';
import handleMessage from '../handlers/messageHandler.js';

const runTelegramBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.log('TELEGRAM_BOT_TOKEN не задан — Telegram-бот пропущен');
    return;
  }

  const bot = new TelegramBot(token, { polling: true });

  bot.on('error', (error) => {
    console.error('Ошибка Telegram-бота:', error.message);
  });

  bot.on('polling_error', (error) => {
    console.error('Ошибка polling Telegram:', error.message);
  });

  bot.on('message', async (msg) => {
    try {
      if (!msg.text) return;

      const reply = (text) => bot.sendMessage(msg.chat.id, text);
      const userId = msg.from?.id ?? msg.chat?.id ?? 'unknown';

      await handleMessage(msg.text, reply, 'telegram', userId);
    } catch (error) {
      console.error('Ошибка обработки сообщения Telegram:', error);
    }
  });

  console.log('Telegram-бот запущен...');
  return bot;
};

export default runTelegramBot;