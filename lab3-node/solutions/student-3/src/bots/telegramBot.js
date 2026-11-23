import TelegramBot from 'node-telegram-bot-api';
import { StateManager } from '../utils/index.js';
import { handleMessage } from '../handlers/messageHandler.js';

export const createTelegramBot = (token, options = { polling: true }) => {
  if (!token || typeof token !== 'string') {
    throw new Error('TELEGRAM_BOT_TOKEN is required to start the bot.');
  }

  const bot = new TelegramBot(token, options);
  const stateManager = new StateManager();

  bot.on('message', async (msg) => {
    await handleMessage(bot, msg, stateManager);
  });

  bot.on('polling_error', (err) => {
    console.error('Ошибка polling:', err.message);
  });

  return { bot, stateManager };
};