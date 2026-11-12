// src/utils/storage.js
import { readFile, writeFile, mkdir, rename, unlink } from 'fs/promises';
import { randomUUID } from 'crypto';
import { existsSync } from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('data');

export async function loadState(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!existsSync(filePath)) {
    return null;
  }
  const data = await readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function saveState(filename, state) {
  const filePath = path.join(DATA_DIR, filename);
  const dir = path.dirname(filePath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  // Пишем во временный файл и переименовываем, чтобы не оставить обрезанный JSON
  const tmpPath = `${filePath}.${randomUUID()}.tmp`;
  try {
    await writeFile(tmpPath, JSON.stringify(state, null, 2), 'utf-8');
    await rename(tmpPath, filePath);
  } catch (error) {
    await unlink(tmpPath).catch(() => {});
    throw error;
  }
}
