import {
  parseTitle, parseAuthor, parseStatus, parseRating, parsePages, parseBookId,
} from '../utils/parseInput.js';
import { formatCollection, recommendByRating } from '../utils/format.js';

export const STATE = {
  IDLE: 'IDLE',
  AWAIT_TITLE: 'AWAIT_TITLE',
  AWAIT_AUTHOR: 'AWAIT_AUTHOR',
  AWAIT_STATUS: 'AWAIT_STATUS',
  AWAIT_PAGES: 'AWAIT_PAGES',
  AWAIT_RATE_BOOK: 'AWAIT_RATE_BOOK',
  AWAIT_RATE_VALUE: 'AWAIT_RATE_VALUE',
  AWAIT_FILTER: 'AWAIT_FILTER',
  AWAIT_PAGE_BOOK: 'AWAIT_PAGE_BOOK',
  AWAIT_PAGE_VALUE: 'AWAIT_PAGE_VALUE',
};

export const keyboards = {
  main: {
    reply_markup: {
      keyboard: [
        [{ text: '/add_book' }, { text: '/collection' }],
        [{ text: '/page' }, { text: '/rate' }],
        [{ text: '/help' }],
      ],
      one_time: false,
    },
  },
  status: {
    reply_markup: {
      inline_keyboard: [[
        { text: 'Хочу прочитать', callback_data: 'status:want' },
        { text: 'Читаю', callback_data: 'status:reading' },
        { text: 'Прочитано', callback_data: 'status:read' },
      ]],
    },
  },
  filter: {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Все', callback_data: 'filter:all' },
          { text: 'Хочу прочитать', callback_data: 'filter:want' },
        ],
        [
          { text: 'Читаю', callback_data: 'filter:reading' },
          { text: 'Прочитано', callback_data: 'filter:read' },
        ],
      ],
    },
  },
};

const STATUS_BY_LABEL = {
  'хочу прочитать': 'want',
  'читаю': 'reading',
  'прочитано': 'read',
};

const FILTER_BY_LABEL = {
  'все': null,
  'хочу прочитать': 'want',
  'читаю': 'reading',
  'прочитано': 'read',
};

const getState = (storage, userId) => storage.getState(userId, 'fsm') || STATE.IDLE;
const setState = (storage, userId, state, ctx = {}) => {
  storage.setState(userId, 'fsm', state);
  storage.setState(userId, 'ctx', ctx);
};

function buildCollectionReply(userId, storage, status) {
  const books = storage.getBooks(userId, status);
  setState(storage, userId, STATE.IDLE);
  return [{
    text: formatCollection(books, (id) => storage.progress(userId, id)),
    options: keyboards.main,
  }];
}

function helpHint() {
  return {
    text: 'Не понял команду. Что можно сделать:\n'
      + '/add_book — добавить книгу\n'
      + '/collection — посмотреть коллекцию\n'
      + '/page — обновить текущую страницу\n'
      + '/rate — оценить прочитанную книгу\n'
      + '/help — справка',
    options: keyboards.main,
  };
}

export function handleCommand({ command, userId, storage }) {
  switch (command) {
  case '/start':
    setState(storage, userId, STATE.IDLE);
    return [{
      text: 'Привет! Я BookTrackBot 📚\n\n'
          + 'Выберите действие кнопкой ниже или введите команду вручную:\n'
          + '/add_book — добавить книгу\n'
          + '/collection — коллекция\n'
          + '/page — обновить текущую страницу\n'
          + '/rate — оценить книгу\n'
          + '/help — помощь',
      options: keyboards.main,
    }];
  case '/help':
    return [{
      text: '/add_book — добавить книгу (название → автор → статус → страницы)\n'
          + '/collection — коллекция с фильтром и прогрессом\n'
          + '/page — указать, сколько страниц уже прочитано\n'
          + '/rate — оценить прочитанную книгу',
      options: keyboards.main,
    }];
  case '/add_book':
    setState(storage, userId, STATE.AWAIT_TITLE);
    return [{ text: 'Введите название книги:' }];
  case '/collection':
    setState(storage, userId, STATE.AWAIT_FILTER);
    return [{ text: 'Выберите фильтр:', options: keyboards.filter }];
  case '/page': {
    const reading = storage.getBooks(userId, 'reading');
    if (reading.length === 0) {
      setState(storage, userId, STATE.IDLE);
      return [{
        text: 'У вас нет книг со статусом «читаю», к которым можно применить прогресс.',
        options: keyboards.main,
      }];
    }
    const list = reading
      .map((b) => `#${b.id} — ${b.title} (${b.currentPage}/${b.totalPages} стр.)`)
      .join('\n');
    setState(storage, userId, STATE.AWAIT_PAGE_BOOK);
    return [{ text: `Выберите книгу для обновления прогресса:\n${list}` }];
  }
  case '/rate': {
    const read = storage.getBooks(userId, 'read');
    if (read.length === 0) {
      setState(storage, userId, STATE.IDLE);
      return [{ text: 'У вас нет прочитанных книг для оценки.', options: keyboards.main }];
    }
    const list = read.map((b) => `#${b.id} — ${b.title} (${b.author})`).join('\n');
    setState(storage, userId, STATE.AWAIT_RATE_BOOK);
    return [{ text: `Выберите книгу для оценки:\n${list}` }];
  }
  default:
    return [helpHint()];
  }
}

export function handleText({ text, userId, storage }) {
  const state = getState(storage, userId);
  const ctx = storage.getState(userId, 'ctx') || {};
  const trimmed = text.trim().toLowerCase();

  switch (state) {
  case STATE.AWAIT_TITLE: {
    const v = parseTitle(text);
    if (!v.ok) return [{ text: v.error }];
    setState(storage, userId, STATE.AWAIT_AUTHOR, { title: v.value });
    return [{ text: 'Введите автора книги:' }];
  }
  case STATE.AWAIT_AUTHOR: {
    const v = parseAuthor(text);
    if (!v.ok) return [{ text: v.error }];
    setState(storage, userId, STATE.AWAIT_STATUS, { ...ctx, author: v.value });
    return [{ text: 'Выберите статус:', options: keyboards.status }];
  }
  case STATE.AWAIT_STATUS: {
    const status = STATUS_BY_LABEL[trimmed];
    if (status === undefined) {
      return [{ text: 'Пожалуйста, выберите статус кнопкой выше.' }];
    }
    setState(storage, userId, STATE.AWAIT_PAGES, { ...ctx, status });
    return [{ text: 'Сколько всего страниц? (0 — не знаю)' }];
  }
  case STATE.AWAIT_PAGES: {
    const v = parsePages(text);
    if (!v.ok) return [{ text: v.error }];
    const isRead = ctx.status === 'read';
    const book = storage.addBook(userId, {
      title: ctx.title,
      author: ctx.author,
      status: ctx.status,
      totalPages: v.value,
    });
    if (isRead && v.value > 0) {
      storage.updateBook(userId, book.id, { currentPage: v.value });
    }
    setState(storage, userId, STATE.IDLE);
    return [{
      text: `Книга добавлена ✅ #${book.id} «${book.title}»`,
      options: keyboards.main,
    }];
  }
  case STATE.AWAIT_PAGE_BOOK: {
    const v = parseBookId(text);
    if (!v.ok) return [{ text: v.error }];
    const book = storage.getBooks(userId, 'reading').find((b) => b.id === v.value);
    if (!book) return [{ text: 'Книга со статусом «читаю» с таким номером не найдена.' }];
    if (!book.totalPages) {
      setState(storage, userId, STATE.IDLE);
      return [{
        text: `У книги «${book.title}» не указано общее число страниц, прогресс посчитать не получится.`,
        options: keyboards.main,
      }];
    }
    setState(storage, userId, STATE.AWAIT_PAGE_VALUE, { bookId: v.value });
    return [{
      text: `Сколько страниц уже прочитано в «${book.title}»? (всего ${book.totalPages})`,
    }];
  }
  case STATE.AWAIT_PAGE_VALUE: {
    const book = storage.getBooks(userId).find((b) => b.id === ctx.bookId);
    if (!book) {
      setState(storage, userId, STATE.IDLE);
      return [{ text: 'Книга не найдена.', options: keyboards.main }];
    }
    const n = Number(text);
    if (!Number.isInteger(n) || n < 0) {
      return [{ text: `Введите целое число от 0 до ${book.totalPages}.` }];
    }
    if (n >= book.totalPages) {
      storage.updateBook(userId, ctx.bookId, {
        currentPage: book.totalPages,
        status: 'read',
      });
      setState(storage, userId, STATE.IDLE);
      return [{
        text: `✅ «${book.title}» прочитана полностью (100%). Можно оценить через /rate.`,
        options: keyboards.main,
      }];
    }
    storage.updateBook(userId, ctx.bookId, { currentPage: n });
    const percent = storage.progress(userId, ctx.bookId);
    setState(storage, userId, STATE.IDLE);
    return [{
      text: `Обновлено ✅ «${book.title}» — ${n}/${book.totalPages} стр. (${percent}%)`,
      options: keyboards.main,
    }];
  }
  case STATE.AWAIT_RATE_BOOK: {
    const v = parseBookId(text);
    if (!v.ok) return [{ text: v.error }];
    const book = storage.getBooks(userId, 'read').find((b) => b.id === v.value);
    if (!book) return [{ text: 'Книга не найдена.' }];
    setState(storage, userId, STATE.AWAIT_RATE_VALUE, { bookId: v.value });
    return [{ text: 'Поставьте оценку от 1 до 5:' }];
  }
  case STATE.AWAIT_RATE_VALUE: {
    const v = parseRating(text);
    if (!v.ok) return [{ text: v.error }];
    const res = storage.rateBook(userId, ctx.bookId, v.value);
    setState(storage, userId, STATE.IDLE);
    if (!res.ok) return [{ text: res.error, options: keyboards.main }];
    const avg = storage.averageRating(userId);
    return [{
      text: `Оценка сохранена ⭐${v.value}\n`
          + `Средний рейтинг: ${avg.toFixed(2)}\n\n`
          + recommendByRating(avg),
      options: keyboards.main,
    }];
  }
  case STATE.AWAIT_FILTER: {
    if (!(trimmed in FILTER_BY_LABEL)) {
      return [{ text: 'Пожалуйста, выберите фильтр кнопкой выше.' }];
    }
    return buildCollectionReply(userId, storage, FILTER_BY_LABEL[trimmed]);
  }
  default: {
    setState(storage, userId, STATE.IDLE);
    return [helpHint()];
  }
  }
}

export function handleCallback({ data, userId, storage }) {
  const state = getState(storage, userId);
  const ctx = storage.getState(userId, 'ctx') || {};

  if (data.startsWith('status:')) {
    const v = parseStatus(data.split(':')[1]);
    if (!v.ok) return [{ text: v.error }];
    if (state !== STATE.AWAIT_STATUS) {
      return [{ text: 'Сейчас статус выбрать нельзя. Начните с /add_book.', options: keyboards.main }];
    }
    setState(storage, userId, STATE.AWAIT_PAGES, { ...ctx, status: v.value });
    return [{ text: 'Сколько всего страниц? (0 — не знаю)' }];
  }

  if (data.startsWith('filter:')) {
    if (state !== STATE.AWAIT_FILTER) {
      return [{
        text: 'Кнопка фильтра устарела. Чтобы посмотреть коллекцию, отправьте /collection.',
      }];
    }
    const raw = data.split(':')[1];
    const status = raw === 'all' ? null : raw;
    return buildCollectionReply(userId, storage, status);
  }

  return [helpHint()];
}