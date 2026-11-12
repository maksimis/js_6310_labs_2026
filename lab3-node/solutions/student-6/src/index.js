import TelegramBot from 'node-telegram-bot-api';
import { startReminderLoop } from './utils/reminderScheduler.js';
import { handleMessage } from './handlers/messageHandler.js';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('Не найден TELEGRAM_BOT_TOKEN. Создайте .env на основе .env.example.');
  process.exitCode = 1;
} else {
  const bot = new TelegramBot(token, { polling: true });
  bot.on('message', (message) => {
    handleMessage(bot, message).catch((error) => {
      console.error('Message handling error:', error);
      if (message?.chat?.id) {
        bot.sendMessage(message.chat.id, 'Произошла ошибка при обработке сообщения. Проверьте ввод и попробуйте ещё раз.').catch(() => {});
      }
    });
  });
  bot.on('polling_error', (error) => console.error('Telegram polling error:', error.message));
  startReminderLoop(bot);
  console.log('TaskBot запущен. Остановить: Ctrl+C.');
}
