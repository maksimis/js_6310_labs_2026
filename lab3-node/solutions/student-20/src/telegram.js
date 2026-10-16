import { Telegraf } from 'telegraf';
import { createMessageHandler } from './messages.js';

export function createTelegramBot(token, knowledge) {
  const bot = new Telegraf(token);
  const handleMessage = createMessageHandler(knowledge);

  bot.catch(() => {
    console.error('Не удалось обработать сообщение Telegram. Проверьте подключение.');
  });

  bot.on('message', async ctx => {
    if (!ctx.chat || !ctx.from) return;
    const recipient = ctx.message.text?.trim().match(/^\/\w+@(\w+)/)?.[1];
    if (recipient && recipient.toLowerCase() !== ctx.me.toLowerCase()) return;
    const reply = handleMessage({
      chatId: ctx.chat.id,
      userId: ctx.from.id,
      text: ctx.message.text
    });
    await ctx.reply(reply);
  });

  return bot;
}
