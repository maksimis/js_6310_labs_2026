import fs from 'fs';
import path from 'path';

const FILE_PATH = path.resolve('data.json');

export function loadUsers() {
  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    const data = JSON.parse(raw);
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data;
    }
    return {};
  } catch {
    return {};
  }
}

export function saveUsers(users) {
  try {
    const data = {};
    users.forEach((value, key) => {
      data[key] = value;
    });
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // пропускаем
  }
}