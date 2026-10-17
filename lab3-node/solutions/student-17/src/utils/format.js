import { STATUS_LABELS } from './parseInput.js';

export function formatBook(book, progress) {
  const p = book.totalPages
    ? ` (стр. ${book.currentPage}/${book.totalPages}, ${progress}%)`
    : '';
  const r = book.rating ? ` ⭐${book.rating}` : '';
  return `#${book.id} [${STATUS_LABELS[book.status]}] ${book.title} — ${book.author}${p}${r}`;
}

export function formatCollection(books, progressFn) {
  if (books.length === 0) return 'Нет книг с таким статусом.';
  return `Ваши книги:\n${books.map((b) => formatBook(b, progressFn(b.id))).join('\n')}`;
}

export function recommendByRating(avg) {
  if (avg === null || Number.isNaN(avg)) {
    return 'Оцените хотя бы одну книгу, чтобы получить рекомендации.';
  }
  if (avg >= 4.5) return 'Рекомендуем классику: Булгаков, Достоевский, Гарсиа Маркес.';
  if (avg >= 3.5) return 'Рекомендуем современную прозу: Мураками, Робертс.';
  if (avg >= 2.5) return 'Рекомендуем детективы: Кристи, Ларссон.';
  return 'Рекомендуем короткие книги: Вейер, Хемингуэй, Киз.';
}