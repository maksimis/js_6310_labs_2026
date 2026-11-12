import { handleCommand, handleText, handleCallback } from '../src/handlers/messageHandler.js';

class TestStorage {
  constructor() { this.users = new Map(); }

  getUser(id) {
    if (!this.users.has(id)) this.users.set(id, { books: [], states: new Map() });
    return this.users.get(id);
  }

  addBook(id, b) {
    const u = this.getUser(id);
    const book = { id: u.books.length + 1, rating: null, currentPage: 0, ...b };
    u.books.push(book);
    return book;
  }

  getBooks(id, s = null) {
    const arr = this.getUser(id).books;
    return s ? arr.filter((b) => b.status === s) : [...arr];
  }

  updateBook(id, bookId, patch) {
    const b = this.getUser(id).books.find((x) => x.id === bookId);
    if (!b) return null;
    Object.assign(b, patch);
    return b;
  }

  rateBook(id, bookId, rating) {
    const b = this.getUser(id).books.find((x) => x.id === bookId);
    if (!b) return { ok: false, error: 'нет' };
    if (b.status !== 'read') return { ok: false, error: 'только прочитанные' };
    b.rating = rating;
    return { ok: true, book: b };
  }

  averageRating(id) {
    const r = this.getUser(id).books.filter((b) => b.rating !== null);
    return r.length ? r.reduce((s, b) => s + b.rating, 0) / r.length : null;
  }

  progress(id, bid) {
    const b = this.getUser(id).books.find((x) => x.id === bid);
    return b && b.totalPages ? Math.round((b.currentPage / b.totalPages) * 100) : 0;
  }

  setState(id, k, v) { this.getUser(id).states.set(k, v); }
  getState(id, k) { return this.getUser(id).states.get(k) ?? null; }
}

describe('handleCommand', () => {
  it('/start', () => {
    const s = new TestStorage();
    expect(handleCommand({ command: '/start', userId: 1, storage: s })[0].text).toMatch(/BookTrackBot/);
  });
  it('/help', () => {
    const s = new TestStorage();
    expect(handleCommand({ command: '/help', userId: 1, storage: s })[0].text).toMatch(/add_book/);
  });
  it('/add_book starts FSM', () => {
    const s = new TestStorage();
    handleCommand({ command: '/add_book', userId: 1, storage: s });
    expect(s.getState(1, 'fsm')).toBe('AWAIT_TITLE');
  });
  it('/collection', () => {
    const s = new TestStorage();
    expect(handleCommand({ command: '/collection', userId: 1, storage: s })[0].text).toMatch(/фильтр/i);
  });
  it('/rate empty', () => {
    const s = new TestStorage();
    expect(handleCommand({ command: '/rate', userId: 1, storage: s })[0].text).toMatch(/нет прочитанных/);
  });
  it('/page empty', () => {
    const s = new TestStorage();
    const r = handleCommand({ command: '/page', userId: 1, storage: s });
    expect(r[0].text).toMatch(/нет книг/);
    expect(s.getState(1, 'fsm')).toBe('IDLE');
  });
  it('/page with reading books', () => {
    const s = new TestStorage();
    s.addBook(1, { title: 'Дюна', author: 'Герберт', status: 'reading', totalPages: 500 });
    const r = handleCommand({ command: '/page', userId: 1, storage: s });
    expect(r[0].text).toMatch(/Дюна/);
    expect(s.getState(1, 'fsm')).toBe('AWAIT_PAGE_BOOK');
  });
  it('/rate with read books', () => {
    const s = new TestStorage();
    s.addBook(1, { title: 'A', author: 'B', status: 'read' });
    const r = handleCommand({ command: '/rate', userId: 1, storage: s });
    expect(r[0].text).toMatch(/Выберите книгу/);
    expect(s.getState(1, 'fsm')).toBe('AWAIT_RATE_BOOK');
  });
  it('unknown command', () => {
    const s = new TestStorage();
    expect(handleCommand({ command: '/xxx', userId: 1, storage: s })[0].text).toMatch(/Не понял/);
  });
});

describe('handleText — FSM', () => {
  it('title -> author', () => {
    const s = new TestStorage();
    s.setState(1, 'fsm', 'AWAIT_TITLE');
    handleText({ text: 'Дюна', userId: 1, storage: s });
    expect(s.getState(1, 'fsm')).toBe('AWAIT_AUTHOR');
  });
  it('invalid title stays', () => {
    const s = new TestStorage();
    s.setState(1, 'fsm', 'AWAIT_TITLE');
    const r = handleText({ text: '   ', userId: 1, storage: s });
    expect(r[0].text).toMatch(/пустым/);
  });
  it('author -> status', () => {
    const s = new TestStorage();
    s.setState(1, 'fsm', 'AWAIT_AUTHOR');
    s.setState(1, 'ctx', { title: 'Дюна' });
    handleText({ text: 'Герберт', userId: 1, storage: s });
    expect(s.getState(1, 'fsm')).toBe('AWAIT_STATUS');
  });
  it('status by text -> pages', () => {
    const s = new TestStorage();
    s.setState(1, 'fsm', 'AWAIT_STATUS');
    s.setState(1, 'ctx', { title: 'Дюна', author: 'Герберт' });
    handleText({ text: 'Прочитано', userId: 1, storage: s });
    expect(s.getState(1, 'fsm')).toBe('AWAIT_PAGES');
  });
  it('pages -> add book -> IDLE', () => {
    const s = new TestStorage();
    s.setState(1, 'fsm', 'AWAIT_PAGES');
    s.setState(1, 'ctx', { title: 'Дюна', author: 'Герберт', status: 'read' });
    handleText({ text: '500', userId: 1, storage: s });
    expect(s.getState(1, 'fsm')).toBe('IDLE');
    expect(s.getBooks(1).length).toBe(1);
  });
  it('users isolated', () => {
    const s = new TestStorage();
    s.setState(1, 'fsm', 'AWAIT_TITLE');
    s.setState(2, 'fsm', 'AWAIT_AUTHOR');
    handleText({ text: 'Дюна', userId: 1, storage: s });
    expect(s.getState(1, 'fsm')).toBe('AWAIT_AUTHOR');
    expect(s.getState(2, 'fsm')).toBe('AWAIT_AUTHOR');
  });
  it('rate flow', () => {
    const s = new TestStorage();
    s.addBook(1, { title: 'A', author: 'B', status: 'read' });
    s.setState(1, 'fsm', 'AWAIT_RATE_BOOK');
    handleText({ text: '#1', userId: 1, storage: s });
    expect(s.getState(1, 'fsm')).toBe('AWAIT_RATE_VALUE');
    const r = handleText({ text: '5', userId: 1, storage: s });
    expect(r[0].text).toMatch(/Оценка сохранена/);
  });
  it('rate non-read fails', () => {
    const s = new TestStorage();
    s.addBook(1, { title: 'A', author: 'B', status: 'reading' });
    s.setState(1, 'fsm', 'AWAIT_RATE_VALUE');
    s.setState(1, 'ctx', { bookId: 1 });
    const r = handleText({ text: '5', userId: 1, storage: s });
    expect(r[0].text).toMatch(/только прочитанные/);
  });
  it('default idle', () => {
    const s = new TestStorage();
    const r = handleText({ text: 'hi', userId: 1, storage: s });
    expect(r[0].text).toMatch(/Не понял/);
  });
});

describe('handleText AWAIT_PAGE_BOOK', () => {
  it('invalid id', () => {
    const s = new TestStorage();
    s.setState(1, 'fsm', 'AWAIT_PAGE_BOOK');
    const r = handleText({ text: 'abc', userId: 1, storage: s });
    expect(r[0].text).toMatch(/номер/);
  });
  it('book not found', () => {
    const s = new TestStorage();
    s.setState(1, 'fsm', 'AWAIT_PAGE_BOOK');
    const r = handleText({ text: '#99', userId: 1, storage: s });
    expect(r[0].text).toMatch(/не найдена/);
  });
  it('book without totalPages', () => {
    const s = new TestStorage();
    s.addBook(1, { title: 'A', author: 'B', status: 'reading', totalPages: 0 });
    s.setState(1, 'fsm', 'AWAIT_PAGE_BOOK');
    const r = handleText({ text: '#1', userId: 1, storage: s });
    expect(r[0].text).toMatch(/не указано/);
  });
  it('moves to AWAIT_PAGE_VALUE', () => {
    const s = new TestStorage();
    s.addBook(1, { title: 'A', author: 'B', status: 'reading', totalPages: 500 });
    s.setState(1, 'fsm', 'AWAIT_PAGE_BOOK');
    handleText({ text: '#1', userId: 1, storage: s });
    expect(s.getState(1, 'fsm')).toBe('AWAIT_PAGE_VALUE');
  });
});

describe('handleText AWAIT_PAGE_VALUE', () => {
  it('updates current page', () => {
    const s = new TestStorage();
    const b = s.addBook(1, { title: 'A', author: 'B', status: 'reading', totalPages: 500 });
    s.setState(1, 'fsm', 'AWAIT_PAGE_VALUE');
    s.setState(1, 'ctx', { bookId: b.id });
    const r = handleText({ text: '150', userId: 1, storage: s });
    expect(r[0].text).toMatch(/150\/500/);
    expect(r[0].text).toMatch(/30%/);
    expect(s.getState(1, 'fsm')).toBe('IDLE');
  });
  it('reaches 100% and marks as read', () => {
    const s = new TestStorage();
    const b = s.addBook(1, { title: 'A', author: 'B', status: 'reading', totalPages: 500 });
    s.setState(1, 'fsm', 'AWAIT_PAGE_VALUE');
    s.setState(1, 'ctx', { bookId: b.id });
    const r = handleText({ text: '500', userId: 1, storage: s });
    expect(r[0].text).toMatch(/100%/);
    expect(s.getBooks(1, 'read').length).toBe(1);
  });
  it('rejects invalid number', () => {
    const s = new TestStorage();
    const b = s.addBook(1, { title: 'A', author: 'B', status: 'reading', totalPages: 500 });
    s.setState(1, 'fsm', 'AWAIT_PAGE_VALUE');
    s.setState(1, 'ctx', { bookId: b.id });
    const r = handleText({ text: 'abc', userId: 1, storage: s });
    expect(r[0].text).toMatch(/целое число/);
  });
  it('book not found', () => {
    const s = new TestStorage();
    s.setState(1, 'fsm', 'AWAIT_PAGE_VALUE');
    s.setState(1, 'ctx', { bookId: 999 });
    const r = handleText({ text: '10', userId: 1, storage: s });
    expect(r[0].text).toMatch(/не найдена/);
  });
});

describe('handleCallback', () => {
  it('status -> pages', () => {
    const s = new TestStorage();
    s.setState(1, 'fsm', 'AWAIT_STATUS');
    s.setState(1, 'ctx', { title: 'A', author: 'B' });
    handleCallback({ data: 'status:read', userId: 1, storage: s });
    expect(s.getState(1, 'fsm')).toBe('AWAIT_PAGES');
  });
  it('filter empty', () => {
    const s = new TestStorage();
    s.setState(1, 'fsm', 'AWAIT_FILTER');
    expect(handleCallback({ data: 'filter:read', userId: 1, storage: s })[0].text).toMatch(/Нет книг/);
  });
  it('filter non-empty', () => {
    const s = new TestStorage();
    s.addBook(1, { title: 'A', author: 'B', status: 'read' });
    s.setState(1, 'fsm', 'AWAIT_FILTER');
    expect(handleCallback({ data: 'filter:read', userId: 1, storage: s })[0].text).toMatch(/Ваши книги/);
  });
  it('old filter button does not interrupt add_book', () => {
    const s = new TestStorage();
    s.setState(1, 'fsm', 'AWAIT_STATUS');
    s.setState(1, 'ctx', { title: 'A', author: 'B' });
    const r = handleCallback({ data: 'filter:read', userId: 1, storage: s });
    expect(r[0].text).toMatch(/устарела/);
    expect(s.getState(1, 'fsm')).toBe('AWAIT_STATUS');
  });
  it('unknown', () => {
    const s = new TestStorage();
    expect(handleCallback({ data: 'zzz', userId: 1, storage: s })[0].text).toMatch(/Не понял/);
  });
});