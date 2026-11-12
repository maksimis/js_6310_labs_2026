import { Telegraf } from 'telegraf';
import { createHandlers } from './handlers.js';

// createBot() — создаёт и настраивает Telegram-бота
// token — токен из .env
// fsm — конечный автомат
// providers — реестр провайдеров
export function createBot(token, fsm, providers) {
  const bot = new Telegraf(token);
  const handlers = createHandlers(fsm, providers);

  // Регистрируем обработчики команд:
  bot.start(handlers.start);              // /start → приветствие
  bot.command('chat', handlers.chat);     // /chat → отправка сообщения в LLM
  bot.command('providers', handlers.listProviders); // /providers → список провайдеров
  bot.on('text', handlers.handleText);    // любое текстовое сообщение → FSM-обработчик

  // Глобальный обработчик ошибок — чтобы бот не падал при сбоях
  bot.catch((err, ctx) => {
    console.error('Bot error:', err);
    // Пытаемся сообщить пользователю об ошибке (если не получится — игнорируем)
    ctx.reply('Internal bot error. Please try again.').catch(() => {});
  });

  return bot;
}