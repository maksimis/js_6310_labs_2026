import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { loadUsers, saveUsers } from '../src/utils/storage.js';

const FILE_PATH = path.resolve('data.json');

describe('Хранилище', () => {
  beforeEach(() => {
    if (fs.existsSync(FILE_PATH)) fs.unlinkSync(FILE_PATH);
  });

  afterEach(() => {
    if (fs.existsSync(FILE_PATH)) fs.unlinkSync(FILE_PATH);
  });

  test('loadUsers возвращает {} если файла нет', () => {
    expect(loadUsers()).toEqual({});
  });

  test('saveUsers записывает Map в файл, loadUsers читает обратно', () => {
    const users = new Map();
    users.set('1', { text: 'abc', startedAt: 123, history: [] });
    saveUsers(users);

    const loaded = loadUsers();
    expect(loaded).toEqual({ 1: { text: 'abc', startedAt: 123, history: [] } });
  });

  test('loadUsers возвращает {} для битого файла', () => {
    fs.writeFileSync(FILE_PATH, 'not a json', 'utf-8');
    expect(loadUsers()).toEqual({});
  });
});