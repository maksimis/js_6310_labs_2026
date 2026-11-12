// tests/storage.test.js
import { describe, it, expect, afterEach } from '@jest/globals';
import { loadState, saveState } from '../src/utils/storage.js';
import { unlink, writeFile } from 'fs/promises';
import path from 'path';

const TEST_FILE = 'test_state.json';
const TEST_PATH = path.resolve('data', TEST_FILE);
const NESTED_FILE = 'boards/test_nested_state.json';
const NESTED_PATH = path.resolve('data', NESTED_FILE);

describe('Storage', () => {
  afterEach(async () => {
    for (const filePath of [TEST_PATH, NESTED_PATH]) {
      try {
        await unlink(filePath);
      } catch {
        // Файл может не существовать, это нормально
      }
    }
  });

  it('должна возвращать null для несуществующего файла', async () => {
    const result = await loadState('nonexistent_file.json');
    expect(result).toBeNull();
  });

  it('должна сохранять и загружать состояние', async () => {
    const data = { tasks: [{ id: '001', title: 'Test' }] };
    await saveState(TEST_FILE, data);
    const loaded = await loadState(TEST_FILE);
    expect(loaded).toEqual(data);
  });

  it('должна перезаписывать существующий файл', async () => {
    await saveState(TEST_FILE, { version: 1 });
    await saveState(TEST_FILE, { version: 2 });
    const loaded = await loadState(TEST_FILE);
    expect(loaded.version).toBe(2);
  });

  it('должна создавать вложенные папки', async () => {
    const data = { tasks: [{ id: '001', title: 'Test' }] };
    await saveState(NESTED_FILE, data);

    expect(await loadState(NESTED_FILE)).toEqual(data);
  });

  it('должна выбрасывать ошибку при некорректном JSON', async () => {
    await writeFile(TEST_PATH, '{ invalid json', 'utf-8');

    await expect(loadState(TEST_FILE)).rejects.toThrow();
  });
});
