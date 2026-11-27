import { Telegraf } from 'telegraf';
import handleMessage from '../handlers/messageHandler.js';

const runTelegramBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log('TELEGRAM_BOT_TOKEN не задан — Telegram-бот пропущен');
    return;
  }

  const bot = new Telegraf(token);

  // Глобальная обработка ошибок (бот не упадет)
  bot.catch((err, ctx) => {
    console.error(`Ошибка для пользователя ${ctx.from?.id}:`, err);
    if (ctx && ctx.reply) {
      ctx.reply('Произошла ошибка. Попробуйте позже.');
    }
  });

  // Обработка всех текстовых сообщений через наш FSM-обработчик
  bot.on('text', async (ctx) => {
    try {
      await handleMessage(ctx.message.text, ctx.from.id, (text) => ctx.reply(text));
    } catch (error) {
      console.error('Ошибка в обработчике сообщений:', error);
      ctx.reply('Произошла внутренняя ошибка.');
    }
  });

  console.log('Telegram-бот (Telegraf) запущен...');
  
  // ИСПРАВЛЕНО: добавлен .catch() для обработки ошибок запуска (например, неверный токен)
  bot.launch().catch((err) => {
    console.error('Ошибка запуска бота:', err.message);
  });

  // Корректное завершение работы по сигналам ОС
  process.once('SIGINT', () => {
    console.log('Получен SIGINT, завершение работы...');
    bot.stop('SIGINT');
  });
  
  process.once('SIGTERM', () => {
    console.log('Получен SIGTERM, завершение работы...');
    bot.stop('SIGTERM');
  });
};

export default runTelegramBot;