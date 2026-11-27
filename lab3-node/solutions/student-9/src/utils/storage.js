import fs from 'fs';
import path from 'path';

// Используем тестовый файл, если задана переменная окружения, иначе обычный
const DB_FILE = process.env.TEST_DB_FILE || path.join(process.cwd(), 'habits.json');

// Вспомогательная функция для получения локальной даты в формате YYYY-MM-DD
const getLocalDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const loadDB = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Ошибка чтения базы:', e);
  }
  return {};
};

const saveDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Ошибка записи базы:', e);
  }
};

export const getUserState = (userId) => {
  const db = loadDB();
  if (!db[userId]) db[userId] = {};
  if (!db[userId]._state) db[userId]._state = { step: 'IDLE', data: {} };
  return db[userId]._state;
};

export const setUserState = (userId, step, data) => {
  const db = loadDB();
  if (!db[userId]) db[userId] = {};
  db[userId]._state = { step, data };
  saveDB(db);
};

export const addHabit = (userId, habitName, frequency) => {
  const db = loadDB();
  if (!db[userId]) db[userId] = {};
  
  // Дополнительная защита от перезаписи служебных полей
  if (habitName === '_state' || habitName === '__proto__') return false;

  db[userId][habitName] = { 
    frequency, 
    history: [], 
    createdAt: new Date().toISOString() 
  };
  saveDB(db);
  return true;
};

export const checkHabit = (userId, habitName) => {
  const db = loadDB();
  // ИСПРАВЛЕНО: безопасная проверка hasOwnProperty для линтера
  if (!db[userId] || !Object.prototype.hasOwnProperty.call(db[userId], habitName)) return false;
  
  const today = getLocalDate();
  if (!db[userId][habitName].history.includes(today)) {
    db[userId][habitName].history.push(today);
    saveDB(db);
  }
  return true;
};

export const getProgress = (userId, habitName) => {
  const db = loadDB();
  // ИСПРАВЛЕНО: безопасная проверка hasOwnProperty для линтера
  if (!db[userId] || !Object.prototype.hasOwnProperty.call(db[userId], habitName)) return null;
  
  const history = db[userId][habitName].history.sort();
  const today = getLocalDate();
  const isDoneToday = history.includes(today);
  
  let streak = 0;
  const checkDate = new Date();
  if (!isDoneToday) checkDate.setDate(checkDate.getDate() - 1);
  
  while (true) {
    const dateStr = getLocalDate(checkDate);
    if (history.includes(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return { history, isDoneToday, streak, frequency: db[userId][habitName].frequency };
};

export const getUserHabits = (userId) => {
  const db = loadDB();
  return db[userId] ? Object.keys(db[userId]).filter(k => k !== '_state') : [];
};