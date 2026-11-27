import 'dotenv/config';
import { VK, Keyboard } from 'vk-io';
import { handleCommand, handleText, handleCallback } from '../handlers/messageHandler.js';

export class Storage {
  constructor() {
    this.users = new Map();
  }

  getUser(userId) {
    if (!this.users.has(userId)) {
      this.users.set(userId, { books: [], states: new Map() });
    }
    return this.users.get(userId);
  }

  addBook(userId, { title, author, status = 'want', totalPages = 0 }) {
    const user = this.getUser(userId);
    const book = {
      id: user.books.length + 1,
      title,
      author,
      status,
      totalPages: Number(totalPages) || 0,
      currentPage: 0,
      rating: null,
    };
    user.books.push(book);
    return book;
  }

  getBooks(userId, status = null) {
    const books = this.getUser(userId).books;
    return status ? books.filter((b) => b.status === status) : [...books];
  }

  updateBook(userId, bookId, patch) {
    const book = this.getUser(userId).books.find((b) => b.id === bookId);
    if (!book) return null;
    Object.assign(book, patch);
    return book;
  }

  rateBook(userId, bookId, rating) {
    const book = this.getUser(userId).books.find((b) => b.id === bookId);
    if (!book) return { ok: false, error: 'Книга не найдена' };
    if (book.status !== 'read') return { ok: false, error: 'Оценивать можно только прочитанные' };
    book.rating = rating;
    return { ok: true, book };
  }

  averageRating(userId) {
    const rated = this.getUser(userId).books.filter((b) => b.rating !== null);
    if (!rated.length) return null;
    return rated.reduce((s, b) => s + b.rating, 0) / rated.length;
  }

  progress(userId, bookId) {
    const b = this.getUser(userId).books.find((x) => x.id === bookId);
    if (!b || !b.totalPages) return 0;
    if (b.currentPage >= b.totalPages) return 100;
    return Math.round((b.currentPage / b.totalPages) * 100);
  }

  setState(userId, key, value) {
    this.getUser(userId).states.set(key, value);
  }

  getState(userId, key) {
    return this.getUser(userId).states.get(key) ?? null;
  }
}

/* istanbul ignore next */
function buildVkKeyboard(options) {
  if (!options || !options.reply_markup) return undefined;
  const rm = options.reply_markup;

  if (rm.keyboard) {
    const kb = Keyboard.builder();
    rm.keyboard.forEach((row, ri) => {
      row.forEach((btn) => {
        kb.textButton({ label: btn.text, color: Keyboard.SECONDARY_COLOR });
      });
      if (ri < rm.keyboard.length - 1) kb.row();
    });
    if (rm.one_time === false) kb.oneTime(false);
    return kb;
  }

  if (rm.inline_keyboard) {
    const kb = Keyboard.builder();
    rm.inline_keyboard.forEach((row, ri) => {
      row.forEach((btn) => {
        kb.textButton({
          label: btn.text,
          payload: JSON.stringify({ cmd: btn.callback_data }),
          color: Keyboard.POSITIVE_COLOR,
        });
      });
      if (ri < rm.inline_keyboard.length - 1) kb.row();
    });
    return kb.inline();
  }

  return undefined;
}

/* istanbul ignore next */
async function sendVk(context, replies) {
  for (const r of replies) {
    try {
      await context.send({
        message: r.text,
        keyboard: buildVkKeyboard(r.options),
      });
    } catch (e) {
      console.error('vk send error:', e.message);
    }
  }
}

/* istanbul ignore next */
export function createBot(token, storage = new Storage()) {
  const vk = new VK({ token });

  vk.updates.on('message_new', async (context) => {
    const userId = context.senderId;
    const raw = context.text || '';
    const callbackData = context.messagePayload && context.messagePayload.cmd
      ? context.messagePayload.cmd
      : null;

    try {
      if (callbackData) {
        const replies = handleCallback({ data: callbackData, userId, storage });
        await sendVk(context, replies);
        return;
      }

      if (raw.startsWith('/')) {
        const cmd = raw.split(' ')[0];
        const replies = handleCommand({ command: cmd, userId, storage });
        await sendVk(context, replies);
        return;
      }

      if (raw.length > 0) {
        const replies = handleText({ text: raw, userId, storage });
        await sendVk(context, replies);
      }
    } catch (e) {
      console.error('vk handler error:', e.message);
      try {
        await context.send('Произошла ошибка.');
      } catch { /* ignore */ }
    }
  });

  return vk;
}

/* istanbul ignore next */
export async function runVkBot() {
  const token = process.env.VK_GROUP_TOKEN;
  if (!token) {
    console.error('VK_GROUP_TOKEN не задан в .env');
    process.exit(1);
  }
  const storage = new Storage();
  const vk = createBot(token, storage);
  await vk.updates.start();
  console.log('BookTrackBot (VK) started');

  process.on('SIGINT', async () => {
    try { await vk.updates.stop(); } catch { /* ignore */ }
    process.exit(0);
  });
  return vk;
}