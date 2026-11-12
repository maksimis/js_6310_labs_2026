import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import handleMessage from '../handlers/messageHandler.js';

// Экранирование спецсимволов Markdown v1 вне блоков кода, чтобы парсер Telegram не падал
export function escapeMarkdownOutsideCode(text) {
  if (typeof text !== 'string') {
    return text;
  }
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts
      .map((part) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          return part;
        }
        return part.replace(/(?<!\\)([_*[`])/g, '\\$1');
      })
      .join('');
}

const runTelegramBot = () => {
  dotenv.config({ quiet: true });
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.log('TELEGRAM_BOT_TOKEN не задан — бот не запущен');
    return null;
  }

  const options = { polling: true };
  const proxy = process.env.TELEGRAM_PROXY || process.env.HTTPS_PROXY;
  if (proxy && (process.env.NODE_ENV !== 'test' || process.env.TEST_USE_PROXY)) {
    options.request = { proxy };
  }

  const bot = new TelegramBot(token, options);

  // Перехватываем ошибки polling, чтобы процесс бота не завершался аварийно
  bot.on('polling_error', (error) => {
    console.error('Ошибка polling:', error.message);
  });

  bot.on('message', async (msg) => {
    try {
      const userId = msg.from ? msg.from.id : msg.chat.id;
      const reply = async (text) => {
        if (typeof text === 'string' && text.includes('```')) {
          try {
            const formatted = escapeMarkdownOutsideCode(text);
            return await bot.sendMessage(msg.chat.id, formatted, { parse_mode: 'Markdown' });
          } catch (err) {
            console.error('Ошибка отправки Markdown сообщения:', err.message);
            return bot.sendMessage(msg.chat.id, text);
          }
        }
        return bot.sendMessage(msg.chat.id, text);
      };
      await handleMessage(userId, msg.text, reply);
    } catch (error) {
      console.error('Ошибка обработки сообщения:', error.message);
    }
  });

  console.log('TetrisBattleBot успешно запущен...');
  return bot;
};

export default runTelegramBot;
