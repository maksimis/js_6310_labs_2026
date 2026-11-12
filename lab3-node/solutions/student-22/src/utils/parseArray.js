// Ограничения на массив: слишком длинный массив даст слишком много шагов
// и не поместится в одно сообщение Telegram.
export const MIN_LENGTH = 2;
export const MAX_LENGTH = 10;

// Разбирает строку вида "5 3 8 1" или "5, 3, 8, 1" в массив чисел.
// Возвращает { array } при успехе или { error } с текстом ошибки.
export function parseArray(text) {
  if (typeof text !== 'string') {
    return { error: 'Отправьте числа текстом.' };
  }

  const parts = text.split(/[\s,;]+/).filter((part) => part !== '');

  if (parts.length < MIN_LENGTH) {
    return { error: `Нужно минимум ${MIN_LENGTH} числа.` };
  }
  if (parts.length > MAX_LENGTH) {
    return { error: `Слишком много чисел: максимум ${MAX_LENGTH}.` };
  }

  const array = parts.map(Number);
  const hasInvalid = array.some((value) => !Number.isFinite(value));
  if (hasInvalid) {
    return { error: 'Массив должен состоять только из чисел, например: 5 3 8 1' };
  }

  return { array };
}
