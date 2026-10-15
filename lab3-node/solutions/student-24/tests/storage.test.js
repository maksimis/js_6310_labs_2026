// tests/storage.test.js
import { describe, it, expect, afterEach } from 'vitest';
import { loadState, saveState } from '../src/utils/storage.js';
import { unlink } from 'fs/promises';
import path from 'path';

const TEST_FILE = 'test_state.json';
const TEST_PATH = path.resolve('data', TEST_FILE);

describe('Storage', () => {
  afterEach(async () => {
    try {
      await unlink(TEST_PATH);
    } catch {
      // Файл может не существовать, это нормально
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
});