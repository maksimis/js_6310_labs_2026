import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { loadRecords, saveRecords, addRecord } from '../src/records.js';

let tmpFile;

beforeEach(async () => {
  tmpFile = path.join(os.tmpdir(), `records-${Date.now()}-${Math.random()}.json`);
});

afterEach(async () => {
  await fs.rm(tmpFile, { force: true });
});

describe('records', () => {
  test('loadRecords returns [] when file missing', async () => {
    expect(await loadRecords(tmpFile)).toEqual([]);
  });

  test('saveRecords sorts and trims', async () => {
    const saved = await saveRecords(
      [{ name: 'a', score: 1 }, { name: 'b', score: 5 }],
      tmpFile,
    );
    expect(saved[0].name).toBe('b');
    expect(saved.length).toBe(2);
  });

  test('saveRecords handles corrupted file', async () => {
    await fs.writeFile(tmpFile, 'not-json', 'utf8');
    expect(await loadRecords(tmpFile)).toEqual([]);
  });

  test('addRecord appends valid record', async () => {
    await addRecord({ name: 'user', score: 3, topic: 'it', mode: 'open' }, tmpFile);
    const records = await loadRecords(tmpFile);
    expect(records.length).toBe(1);
    expect(records[0].score).toBe(3);
  });

  test('addRecord rejects invalid', async () => {
    await expect(addRecord({ name: '', score: -1 }, tmpFile)).rejects.toThrow();
  });
});