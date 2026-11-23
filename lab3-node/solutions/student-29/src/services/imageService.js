import { randomUUID } from 'node:crypto';
import { images, persist } from './storage.js';

export const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const MAX_SIZE = 5 * 1024 * 1024;

export const validateImage = ({ mime, size }) => {
  if (!mime || !ALLOWED_MIME.includes(mime)) {
    return { ok: false, error: 'Недопустимый формат. Разрешены: jpg, png, gif, webp' };
  }
  if (!size || size > MAX_SIZE) {
    return { ok: false, error: `Размер превышает ${MAX_SIZE / 1024 / 1024} МБ` };
  }
  return { ok: true };
};

export const saveImage = ({ filename, mime, size, ownerId }) => {
  const check = validateImage({ mime, size });
  if (!check.ok) return check;
  const id = randomUUID().slice(0, 8);
  const url = `/uploads/${filename}`;
  const image = { id, filename, url, ownerId, mime, size, createdAt: Date.now() };
  images.set(id, image);
  persist();
  return { ok: true, image };
};

export const getImage = (id) => images.get(id);

export const deleteImage = (id) => {
  const img = images.get(id);
  if (!img) return { ok: false, error: 'Изображение не найдено' };
  images.delete(id);
  persist();
  return { ok: true };
};