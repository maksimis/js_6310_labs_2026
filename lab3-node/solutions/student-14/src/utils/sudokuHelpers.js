export const SIZE = 9;
export const BLOCK = 3;
export const LETTERS = 'abcdefghi';

/**
 * Парсит координату вида "a1" -> { row: 0, col: 0 }.
 * Возвращает null, если формат неверен.
 */
export function parseCoord(raw) {
  if (typeof raw !== 'string') return null;
  const str = raw.trim().toLowerCase();
  if (str.length !== 2) return null;

  const col = LETTERS.indexOf(str[0]);
  const row = Number(str[1]) - 1;

  if (col < 0 || row < 0 || row >= SIZE) return null;
  return { row, col };
}

/**
 * Проверяет, что значение — целое от 1 до 9.
 */
export function isValidValue(value) {
  const num = Number(value);
  return Number.isInteger(num) && num >= 1 && num <= SIZE;
}

/**
 * Проверяет, что координаты внутри поля.
 */
export function inBounds(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

/**
 * Позиция блока 3x3 для клетки (row, col).
 */
export function blockOf(row, col) {
  return {
    blockRow: Math.floor(row / BLOCK),
    blockCol: Math.floor(col / BLOCK),
  };
}