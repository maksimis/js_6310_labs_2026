import { randomUUID } from 'node:crypto';
import { albums, images, persist } from './storage.js';

export const createAlbum = (name, ownerId) => {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { ok: false, error: 'Название альбома не может быть пустым' };
  }
  const id = randomUUID().slice(0, 8);
  const album = { id, name: name.trim(), ownerId, imageIds: [], createdAt: Date.now() };
  albums.set(id, album);
  persist();
  return { ok: true, album };
};

export const listAlbums = (ownerId) =>
  [...albums.values()].filter((a) => a.ownerId === ownerId);

export const getAlbum = (albumId) => albums.get(albumId);

export const addImageToAlbum = (albumId, imageId, ownerId) => {
  const album = albums.get(albumId);
  if (!album) return { ok: false, error: 'Альбом не найден' };
  if (album.ownerId !== ownerId) return { ok: false, error: 'Нет доступа к альбому' };
  const image = images.get(imageId);
  if (!image) return { ok: false, error: 'Изображение не найдено' };
  if (image.ownerId !== ownerId) return { ok: false, error: 'Изображение принадлежит другому пользователю' };
  if (!album.imageIds.includes(imageId)) album.imageIds.push(imageId);
  persist();
  return { ok: true, album };
};

export const removeImageFromAlbum = (albumId, imageId, ownerId) => {
  const album = albums.get(albumId);
  if (!album) return { ok: false, error: 'Альбом не найден' };
  if (album.ownerId !== ownerId) return { ok: false, error: 'Нет доступа к альбому' };
  album.imageIds = album.imageIds.filter((id) => id !== imageId);
  persist();
  return { ok: true, album };
};

export const getAlbumImages = (albumId, ownerId) => {
  const album = albums.get(albumId);
  if (!album) return { ok: false, error: 'Альбом не найден' };
  if (ownerId && album.ownerId !== ownerId) return { ok: false, error: 'Нет доступа к альбому' };
  const list = album.imageIds.map((id) => images.get(id)).filter(Boolean);
  return { ok: true, images: list };
};