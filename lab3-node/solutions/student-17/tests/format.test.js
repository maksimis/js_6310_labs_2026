import { formatBook, formatCollection, recommendByRating } from '../src/utils/format.js';

describe('formatBook', () => {
  it('with pages and rating', () => {
    const book = {
      id: 1, title: 'Дюна', author: 'Герберт',
      status: 'read', currentPage: 50, totalPages: 100, rating: 5,
    };
    expect(formatBook(book, 50))
      .toMatch(/#1 \[прочитано\] Дюна — Герберт \(стр\. 50\/100, 50%\) ⭐5/);
  });

  it('without pages', () => {
    const book = {
      id: 2, title: 'A', author: 'B', status: 'want',
      currentPage: 0, totalPages: 0, rating: null,
    };
    expect(formatBook(book, 0)).toMatch(/#2 \[хочу прочитать\] A — B$/);
  });
});

describe('formatCollection', () => {
  it('empty', () => {
    expect(formatCollection([], () => 0)).toMatch(/Нет книг/);
  });

  it('non-empty', () => {
    const books = [{
      id: 1, title: 'A', author: 'B', status: 'read',
      currentPage: 0, totalPages: 10, rating: 5,
    }];
    expect(formatCollection(books, () => 0)).toMatch(/Ваши книги/);
  });
});

describe('recommendByRating', () => {
  it('null', () => expect(recommendByRating(null)).toMatch(/Оцените/));
  it('NaN', () => expect(recommendByRating(NaN)).toMatch(/Оцените/));
  it('>=4.5', () => expect(recommendByRating(5)).toMatch(/классику/));
  it('>=3.5', () => expect(recommendByRating(4)).toMatch(/современную/));
  it('>=2.5', () => expect(recommendByRating(3)).toMatch(/детективы/));
  it('<2.5', () => expect(recommendByRating(1)).toMatch(/короткие/));
});