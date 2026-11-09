import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.resolve('data');
const IMAGES_FILE = path.join(DATA_DIR, 'images.json');
const ALBUMS_FILE = path.join(DATA_DIR, 'albums.json');

const isTest = process.env.NODE_ENV === 'test';

export const images = new Map();
export const albums = new Map();

const ensureDir = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
};

export const persist = () => {
  if (isTest) return;
  ensureDir();
  fs.writeFileSync(IMAGES_FILE, JSON.stringify([...images.entries()], null, 2));
  fs.writeFileSync(ALBUMS_FILE, JSON.stringify([...albums.entries()], null, 2));
};

export const load = () => {
  if (isTest) return;
  ensureDir();
  if (fs.existsSync(IMAGES_FILE)) {
    for (const [k, v] of JSON.parse(fs.readFileSync(IMAGES_FILE, 'utf8'))) images.set(k, v);
  }
  if (fs.existsSync(ALBUMS_FILE)) {
    for (const [k, v] of JSON.parse(fs.readFileSync(ALBUMS_FILE, 'utf8'))) albums.set(k, v);
  }
};

export const reset = () => {
  images.clear();
  albums.clear();
  if (isTest) return;
  fs.rmSync(IMAGES_FILE, { force: true });
  fs.rmSync(ALBUMS_FILE, { force: true });
};