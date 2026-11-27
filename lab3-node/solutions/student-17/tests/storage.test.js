import { Storage } from '../src/bots/vkBot.js';

describe('Storage (vkBot)', () => {
  let s;
  beforeEach(() => { s = new Storage(); });

  it('adds and lists books', () => {
    s.addBook(1, { title: 'A', author: 'B', status: 'want', totalPages: 100 });
    s.addBook(1, { title: 'C', author: 'D', status: 'read', totalPages: 200 });
    expect(s.getBooks(1).length).toBe(2);
    expect(s.getBooks(1, 'want').length).toBe(1);
    expect(s.getBooks(1, 'read').length).toBe(1);
  });

  it('isolates users', () => {
    s.addBook(1, { title: 'A', author: 'B' });
    s.addBook(2, { title: 'C', author: 'D' });
    expect(s.getBooks(1).length).toBe(1);
    expect(s.getBooks(2).length).toBe(1);
  });

  it('updates a book', () => {
    const b = s.addBook(1, { title: 'A', author: 'B' });
    expect(s.updateBook(1, b.id, { currentPage: 50 }).currentPage).toBe(50);
    expect(s.updateBook(1, 999, {})).toBeNull();
  });

  it('rates only read books', () => {
    const b = s.addBook(1, { title: 'A', author: 'B', status: 'reading' });
    expect(s.rateBook(1, b.id, 5).ok).toBe(false);
    s.updateBook(1, b.id, { status: 'read' });
    expect(s.rateBook(1, b.id, 5).ok).toBe(true);
    expect(s.rateBook(1, 999, 5).ok).toBe(false);
  });

  it('computes average rating', () => {
    expect(s.averageRating(1)).toBeNull();
    const a = s.addBook(1, { title: 'A', author: 'B', status: 'read' });
    const b = s.addBook(1, { title: 'C', author: 'D', status: 'read' });
    s.rateBook(1, a.id, 4);
    s.rateBook(1, b.id, 2);
    expect(s.averageRating(1)).toBe(3);
  });

  it('computes progress', () => {
    const b = s.addBook(1, { title: 'A', author: 'B', totalPages: 200 });
    s.updateBook(1, b.id, { currentPage: 50 });
    expect(s.progress(1, b.id)).toBe(25);
    s.updateBook(1, b.id, { currentPage: 200 });
    expect(s.progress(1, b.id)).toBe(100);
    expect(s.progress(1, 999)).toBe(0);
  });

  it('stores states', () => {
    s.setState(1, 'k', 'v');
    expect(s.getState(1, 'k')).toBe('v');
  });
});