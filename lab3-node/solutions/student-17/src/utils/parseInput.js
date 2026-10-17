export const STATUSES = ['want', 'reading', 'read'];

export const STATUS_LABELS = {
  want: 'хочу прочитать',
  reading: 'читаю',
  read: 'прочитано',
};

export function parseTitle(text) {
  if (typeof text !== 'string') return { ok: false, error: 'Название должно быть строкой' };
  const t = text.trim();
  if (!t) return { ok: false, error: 'Название не может быть пустым' };
  if (t.length > 200) return { ok: false, error: 'Слишком длинное название' };
  return { ok: true, value: t };
}

export function parseAuthor(text) {
  if (typeof text !== 'string') return { ok: false, error: 'Автор должен быть строкой' };
  const t = text.trim();
  if (!t) return { ok: false, error: 'Автор не может быть пустым' };
  if (t.length > 200) return { ok: false, error: 'Слишком длинное имя автора' };
  return { ok: true, value: t };
}

export function parseStatus(text) {
  if (typeof text !== 'string' || !STATUSES.includes(text)) {
    return { ok: false, error: 'Недопустимый статус' };
  }
  return { ok: true, value: text };
}

export function parseRating(text) {
  const n = Number(text);
  if (!Number.isInteger(n) || n < 1 || n > 5) {
    return { ok: false, error: 'Оценка должна быть от 1 до 5' };
  }
  return { ok: true, value: n };
}

export function parsePages(text) {
  const n = Number(text);
  if (!Number.isInteger(n) || n < 0) {
    return { ok: false, error: 'Введите целое число страниц (0 — не знаю)' };
  }
  return { ok: true, value: n };
}

export function parseBookId(text) {
  const n = Number(String(text).replace('#', '').trim());
  if (!Number.isInteger(n) || n < 1) {
    return { ok: false, error: 'Отправьте номер книги, например #1' };
  }
  return { ok: true, value: n };
}