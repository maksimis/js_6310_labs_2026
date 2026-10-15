// src/utils/storage.js
import { readFile, writeFile, mkdir } from 'fs/promises';
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
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  const filePath = path.join(DATA_DIR, filename);
  await writeFile(filePath, JSON.stringify(state, null, 2), 'utf-8');
}