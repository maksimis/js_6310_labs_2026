// src/core/boardStore.js
import { loadState, saveState } from '../utils/storage.js';
import { Board, Task } from './models.js';

const USER_ID_PATTERN = /^\d{1,20}$/;
const boards = new Map();
const loading = new Map();

export function isValidUserId(userId) {
  return USER_ID_PATTERN.test(String(userId ?? ''));
}

function toBoard(userId, savedData) {
  const board = new Board();

  if (!savedData) {
    return board;
  }

  if (!Array.isArray(savedData.tasks)) {
    console.warn(`⚠️ Некорректный формат доски пользователя ${userId}, создана новая доска.`);
    return board;
  }

  if (savedData.wipLimits && typeof savedData.wipLimits === 'object') {
    board.wipLimits = { ...board.wipLimits, ...savedData.wipLimits };
  }

  board.tasks = savedData.tasks
      .filter(t => t && typeof t.id === 'string' && typeof t.title === 'string')
      .map(t => {
        const task = new Task(t.id, t.title);
        task.status = t.status || task.status;
        task.history = Array.isArray(t.history) && t.history.length > 0
          ? t.history
          : [task.status];
        task.createdAt = t.createdAt || task.createdAt;
        return task;
      });

  return board;
}

async function loadBoard(key) {
  try {
    const savedData = await loadState(`boards/${key}.json`);
    return toBoard(key, savedData);
  } catch (error) {
    console.error(`❌ Не удалось загрузить доску пользователя ${key}: ${error.message}`);
    return new Board();
  }
}

export async function getBoard(userId) {
  const key = String(userId);

  if (!isValidUserId(key)) {
    throw new Error('Некорректный ID пользователя');
  }

  if (boards.has(key)) {
    return boards.get(key);
  }

  if (loading.has(key)) {
    return loading.get(key);
  }

  const pending = loadBoard(key);
  loading.set(key, pending);

  try {
    const board = await pending;
    boards.set(key, board);
    return board;
  } finally {
    loading.delete(key);
  }
}

export async function saveBoard(userId, board) {
  const key = String(userId);

  if (!isValidUserId(key)) {
    throw new Error('Некорректный ID пользователя');
  }

  await saveState(`boards/${key}.json`, board);
  boards.set(key, board);
}
