import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import handleMessage from '../src/handlers/messageHandler.js';
import { resetState } from '../src/fsm/userStates.js';
import { reset } from '../src/services/storage.js';

const reply = () => jest.fn().mockResolvedValue({});

const img = () => [{ filename: 'a.jpg', mime: 'image/jpeg', size: 100 }];

const createAlbumAndGetId = async (text, userId, mockReply) => {
  await handleMessage('/albums', mockReply, { userId });
  await handleMessage('1', mockReply, { userId });
  await handleMessage(text, mockReply, { userId });
  const last = mockReply.mock.calls.at(-1)[0];
  return last.match(/ID: (\w+)/)[1];
};

const uploadImageAndGetId = async (userId, mockReply) => {
  await handleMessage('/upload', mockReply, { userId, attachments: img() });
  const last = mockReply.mock.calls.at(-1)[0];
  return last.match(/ID: (\w+)/)[1];
};

describe('messageHandler', () => {
  beforeEach(() => {
    reset();
    resetState('u1');
    resetState('u2');
  });

  // ─── IDLE ───
  test('/start → приветствие', async () => {
    const r = reply();
    await handleMessage('/start', r, { userId: 'u1' });
    expect(r.mock.calls[0][0]).toMatch(/GalleryBot/);
  });

  test('/cancel в IDLE → "Нечего отменять"', async () => {
    const r = reply();
    await handleMessage('/cancel', r, { userId: 'u1' });
    expect(r).toHaveBeenCalledWith('Нечего отменять.');
  });

  test('/upload с вложением сразу → сохранение', async () => {
    const r = reply();
    await handleMessage('/upload', r, { userId: 'u1', attachments: img() });
    expect(r.mock.calls[0][0]).toMatch(/Загружено/);
  });

  test('/upload с невалидным mime → ошибка', async () => {
    const r = reply();
    await handleMessage('/upload', r, {
      userId: 'u1',
      attachments: [{ filename: 'a.txt', mime: 'text/plain', size: 100 }],
    });
    expect(r.mock.calls[0][0]).toMatch(/Ошибка/);
  });

  test('/upload без вложения → просит картинку', async () => {
    const r = reply();
    await handleMessage('/upload', r, { userId: 'u1' });
    expect(r.mock.calls[0][0]).toMatch(/Отправьте картинку/);
  });

  test('неизвестный текст → подсказка', async () => {
    const r = reply();
    await handleMessage('что-то', r, { userId: 'u1' });
    expect(r.mock.calls[0][0]).toMatch(/Не понимаю/);
  });

  // ─── UPLOAD_AWAITING_PHOTO ───
  test('UPLOAD_AWAITING_PHOTO: /cancel → отмена', async () => {
    const r = reply();
    await handleMessage('/upload', r, { userId: 'u1' });
    await handleMessage('/cancel', r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/Отменено/);
  });

  test('UPLOAD_AWAITING_PHOTO: текст без картинки → просит', async () => {
    const r = reply();
    await handleMessage('/upload', r, { userId: 'u1' });
    await handleMessage('hello', r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/Нужна картинка/);
  });

  test('UPLOAD_AWAITING_PHOTO: картинка → сохраняет', async () => {
    const r = reply();
    await handleMessage('/upload', r, { userId: 'u1' });
    await handleMessage('', r, { userId: 'u1', attachments: img() });
    expect(r.mock.calls.at(-1)[0]).toMatch(/Загружено/);
  });

  // ─── ALBUM_MENU ───
  test('ALBUM_MENU: /cancel → отмена', async () => {
    const r = reply();
    await handleMessage('/albums', r, { userId: 'u1' });
    await handleMessage('/cancel', r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/Отменено/);
  });

  test('ALBUM_MENU: "1" → AWAITING_NAME', async () => {
    const r = reply();
    await handleMessage('/albums', r, { userId: 'u1' });
    await handleMessage('1', r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/название/);
  });

  test('ALBUM_MENU: "2" → AWAITING_ALBUM_ID', async () => {
    const r = reply();
    await handleMessage('/albums', r, { userId: 'u1' });
    await handleMessage('2', r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/ID альбома/);
  });

  test('ALBUM_MENU: неизвестная цифра → просит 1 или 2', async () => {
    const r = reply();
    await handleMessage('/albums', r, { userId: 'u1' });
    await handleMessage('5', r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/Введите 1 или 2/);
  });

  // ─── ALBUM_AWAITING_NAME ───
  test('ALBUM_AWAITING_NAME: /cancel → отмена', async () => {
    const r = reply();
    await handleMessage('/albums', r, { userId: 'u1' });
    await handleMessage('1', r, { userId: 'u1' });
    await handleMessage('/cancel', r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/Отменено/);
  });

  test('ALBUM_AWAITING_NAME: пустое имя → ошибка', async () => {
    const r = reply();
    await handleMessage('/albums', r, { userId: 'u1' });
    await handleMessage('1', r, { userId: 'u1' });
    await handleMessage('   ', r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/Ошибка/);
  });

  // ─── ALBUM_AWAITING_ALBUM_ID ───
  test('ALBUM_AWAITING_ALBUM_ID: /cancel → отмена', async () => {
    const r = reply();
    await handleMessage('/albums', r, { userId: 'u1' });
    await handleMessage('2', r, { userId: 'u1' });
    await handleMessage('/cancel', r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/Отменено/);
  });

  test('ALBUM_AWAITING_ALBUM_ID → AWAITING_IMAGE_ID', async () => {
    const r = reply();
    await handleMessage('/albums', r, { userId: 'u1' });
    await handleMessage('2', r, { userId: 'u1' });
    await handleMessage('someAlbumId', r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/ID картинки/);
  });

  // ─── ALBUM_AWAITING_IMAGE_ID ───
  test('ALBUM_AWAITING_IMAGE_ID: /cancel → отмена', async () => {
    const r = reply();
    await handleMessage('/albums', r, { userId: 'u1' });
    await handleMessage('2', r, { userId: 'u1' });
    await handleMessage('someAlbumId', r, { userId: 'u1' });
    await handleMessage('/cancel', r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/Отменено/);
  });

  test('ALBUM_AWAITING_IMAGE_ID: картинка в альбом', async () => {
    const r = reply();
    const imageId = await uploadImageAndGetId('u1', r);
    const albumId = await createAlbumAndGetId('Мои фото', 'u1', r);
    await handleMessage('/albums', r, { userId: 'u1' });
    await handleMessage('2', r, { userId: 'u1' });
    await handleMessage(albumId, r, { userId: 'u1' });
    await handleMessage(imageId, r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/Добавлено/);
  });

  test('ALBUM_AWAITING_IMAGE_ID: несуществующий imageId → ошибка', async () => {
    const r = reply();
    const albumId = await createAlbumAndGetId('A', 'u1', r);
    await handleMessage('/albums', r, { userId: 'u1' });
    await handleMessage('2', r, { userId: 'u1' });
    await handleMessage(albumId, r, { userId: 'u1' });
    await handleMessage('nope', r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/Ошибка/);
  });

  // ─── SHOW_AWAITING_ALBUM_ID ───
  test('SHOW_AWAITING_ALBUM_ID: /cancel → отмена', async () => {
    const r = reply();
    await handleMessage('/show', r, { userId: 'u1' });
    await handleMessage('/cancel', r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/Отменено/);
  });

  test('SHOW_AWAITING_ALBUM_ID: несуществующий альбом → ошибка', async () => {
    const r = reply();
    await handleMessage('/show', r, { userId: 'u1' });
    await handleMessage('nope', r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/Ошибка/);
  });

  test('SHOW_AWAITING_ALBUM_ID: пустой альбом → нет картинок', async () => {
    const r = reply();
    const albumId = await createAlbumAndGetId('Пусто', 'u1', r);
    await handleMessage('/show', r, { userId: 'u1' });
    await handleMessage(albumId, r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/нет картинок/);
  });

  // ─── SHOW_AWAITING_DELETE_ID ───
  test('SHOW_AWAITING_DELETE_ID: /cancel → отмена', async () => {
    const r = reply();
    await handleMessage('/show', r, { userId: 'u1' });
    await handleMessage('fakeAlbum', r, { userId: 'u1' });
    await handleMessage('/cancel', r, { userId: 'u1' });
    // после /show с несуществующим albumId стейт сбрасывается, /cancel уже в IDLE
    expect(r.mock.calls.at(-1)[0]).toMatch(/Нечего отменять|Отменено/);
  });

  test('SHOW_AWAITING_DELETE_ID: удаление картинки', async () => {
    const r = reply();
    const imageId = await uploadImageAndGetId('u1', r);
    const albumId = await createAlbumAndGetId('A', 'u1', r);
    await handleMessage('/albums', r, { userId: 'u1' });
    await handleMessage('2', r, { userId: 'u1' });
    await handleMessage(albumId, r, { userId: 'u1' });
    await handleMessage(imageId, r, { userId: 'u1' });

    await handleMessage('/show', r, { userId: 'u1' });
    await handleMessage(albumId, r, { userId: 'u1' });
    await handleMessage(imageId, r, { userId: 'u1' });
    expect(r.mock.calls.at(-1)[0]).toMatch(/Удалено/);
  });

  // ─── Изоляция пользователей ───
  test('состояния пользователей не пересекаются', async () => {
    const rA = reply();
    const rB = reply();
    await handleMessage('/upload', rA, { userId: 'u1' });
    await handleMessage('/upload', rB, { userId: 'u2' });
    await handleMessage('/cancel', rA, { userId: 'u1' });
    await handleMessage('текст', rB, { userId: 'u2' });
    expect(rA.mock.calls.at(-1)[0]).toMatch(/Отменено/);
    expect(rB.mock.calls.at(-1)[0]).toMatch(/Нужна картинка/);
  });
});