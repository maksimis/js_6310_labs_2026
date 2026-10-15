import { Telegraf, Markup } from 'telegraf';
import { createSession } from './music.js';
import { handleMessage, getKeyboard } from './handler.js';

export function splitReply(text) {
  const chunks = [];
  let chunk = '';
  for (const line of text.split('\n')) {
    if (chunk.length + line.length + 1 > 3500) {
      chunks.push(chunk);
      chunk = '';
    }
    chunk += (chunk ? '\n' : '') + line;
  }
  if (chunk) {
    chunks.push(chunk);
  }
  return chunks;
}

export function escapeHtml(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function formatReply(text) {
  // Моноширинный блок нужен только для выравнивания сетки, не для всего ответа.
  return escapeHtml(text).replace(
    /^ {3}\d(?: \d)*\n(?:\d+: [X+.-](?: [X+.-])*(?:\n|$))+/gm,
    (grid) => `<pre>${grid.trimEnd()}</pre>\n`
  );
}

function inlineKeyboard(session, userId) {
  return Markup.inlineKeyboard(getKeyboard(session).map((row) => row.map((label) => {
    let value = label;
    if (label === 'Отмена') {
      value = '/cancel';
    } else if (['sequence-track', 'sound-track', 'sound-choice', 'drum-sound'].includes(session.state)) {
      value = label.split('.')[0];
    }
    return { text: label, callback_data: `${userId}|${session.state}|${value}` };
  })));
}

export function createBot(token) {
  const bot = new Telegraf(token);
  const sessions = new Map();

  bot.on(['message', 'callback_query'], async (ctx) => {
    // Не создаём общую сессию для сообщений без идентификатора пользователя.
    if (!ctx.from || !ctx.chat) {
      return;
    }
    let text = ctx.message?.text;
    const mention = typeof text === 'string' && /^\/\w+@([\w]+)(?:\s|$)/.exec(text);
    if (mention && mention[1].toLowerCase() !== ctx.botInfo.username.toLowerCase()) {
      return;
    }
    const key = `${ctx.chat.id}:${ctx.from.id}`;
    if (!sessions.has(key)) {
      sessions.set(key, createSession());
    }
    const session = sessions.get(key);
    if (ctx.callbackQuery) {
      const data = ctx.callbackQuery.data;
      if (typeof data !== 'string') {
        await ctx.answerCbQuery('Некорректная кнопка. Отправьте /start.');
        return;
      }
      const [userId, state, value] = data.split('|');
      if (userId !== String(ctx.from.id) || state !== session.state || !value) {
        await ctx.answerCbQuery('Эта кнопка не для текущего шага. Используйте последнее меню.');
        return;
      }
      text = value;
    }
    // Состояние обновляется до ожидания сетевых запросов.
    const response = handleMessage(session, text);
    const keyboard = inlineKeyboard(session, ctx.from.id);
    if (ctx.callbackQuery) {
      await ctx.answerCbQuery();
    } else if (typeof text === 'string' && /^\/start(?:@\w+)?(?:\s|$)/i.test(text)) {
      await ctx.reply(
        'Кнопка «Главное меню» в клавиатуре всегда возвращает к началу. Готовые дорожки сохраняются.',
        Markup.keyboard([['Главное меню']]).resize()
      );
    }
    // Удары переключаются в том же сообщении: чат не заполняется копиями сетки.
    if (ctx.callbackQuery && session.state === 'drum-grid') {
      if (text !== 'Очистить' || ctx.callbackQuery.message.text !== response) {
        await ctx.editMessageText(formatReply(response), { parse_mode: 'HTML', ...keyboard });
      }
      return;
    }
    for (const chunk of splitReply(response)) {
      await ctx.reply(formatReply(chunk), {
        parse_mode: 'HTML',
        ...keyboard
      });
    }
  });

  bot.catch(() => {
    // Не печатаем объект ошибки: он может содержать URL с токеном.
    console.error('Не удалось обработать сообщение или отправить ответ. Проверьте подключение к Telegram.');
  });
  return bot;
}
