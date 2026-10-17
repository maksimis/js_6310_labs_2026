import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dataDirectory = fileURLToPath(
  new URL('../../data/users/', import.meta.url)
);

const getUserStoragePath = (userId) => {
  if (!/^\d+$/.test(String(userId))) {
    throw new Error('Некорректный ID пользователя');
  }

  return join(dataDirectory, `${userId}.json`);
};

export const loadTransactions = (userId) => {
  const storagePath = getUserStoragePath(userId);

  if (!existsSync(storagePath)) return [];

  const content = readFileSync(storagePath, 'utf8');
  const transactions = JSON.parse(content);

  if (!Array.isArray(transactions)) {
    throw new Error('Файл транзакций должен содержать массив');
  }

  return transactions;
};

export const saveTransactions = (userId, transactions) => {
  const storagePath = getUserStoragePath(userId);

  mkdirSync(dirname(storagePath), { recursive: true });

  writeFileSync(
    storagePath,
    JSON.stringify(transactions, null, 2),
    'utf8'
  );
};