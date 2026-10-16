export const isValidTitle = (text) => {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (trimmed.length === 0 || trimmed.length > 100) return false;
  if (trimmed.startsWith('/')) return false;
  return true;
};

export const isValidDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const match = dateStr.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return false;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 2024 || year > 2100) return false;

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) return false;

  const inputDate = new Date(year, month - 1, day, 23, 59, 59, 999);
  const now = new Date();
  if (inputDate < now) return false;

  return true;
};

export const isPositiveNumber = (val) => {
  const num = Number(val);
  return !Number.isNaN(num) && num > 0 && Number.isFinite(num);
};

export const isNonNegativeNumber = (val) => {
  const num = Number(val);
  return !Number.isNaN(num) && num >= 0 && Number.isFinite(num);
};

export const isValidId = (val) => {
  const num = Number(val);
  return Number.isInteger(num) && num > 0;
};