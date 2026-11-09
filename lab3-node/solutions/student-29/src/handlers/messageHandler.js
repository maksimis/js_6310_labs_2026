import { STATES } from '../fsm/states.js';
import { getState, setState, resetState } from '../fsm/userStates.js';
import { saveImage } from '../services/imageService.js';
import {
  createAlbum,
  listAlbums,
  addImageToAlbum,
  getAlbumImages,
  removeImageFromAlbum,
} from '../services/albumService.js';

const COMMANDS_HELP = [
  'Команды:',
  '/upload — загрузить картинку (отправьте фото)',
  '/albums — работа с альбомами',
  '/show — показать / удалить картинки альбома',
  '/cancel — отменить текущий шаг',
].join('\n');

const handleIdle = async (text, reply, userId, attachments) => {
  if (text === '/start') {
    await reply(`Привет! Я GalleryBot.\n${COMMANDS_HELP}`);
    return;
  }
  if (text === '/cancel') {
    await reply('Нечего отменять.');
    return;
  }
  if (text === '/upload') {
    if (attachments?.length) {
      const file = attachments[0];
      const result = saveImage({ ...file, ownerId: userId });
      await reply(result.ok
        ? `Загружено. ID: ${result.image.id}\nURL: ${result.image.url}`
        : `Ошибка: ${result.error}`);
      return;
    }
    setState(userId, STATES.UPLOAD_AWAITING_PHOTO);
    await reply('Отправьте картинку (jpg, png, gif, webp, до 5 МБ). /cancel — отмена.');
    return;
  }
  if (text === '/albums') {
    const userAlbums = listAlbums(userId);
    const albumList = userAlbums.length
      ? userAlbums.map((a) => `ID ${a.id} — ${a.name}`).join('\n')
      : '(альбомов пока нет)';
    setState(userId, STATES.ALBUM_MENU);
    await reply(`Ваши альбомы:\n${albumList}\n\n1) Создать новый\n2) Добавить картинку в альбом\n\nВведите номер или /cancel`);
    return;
  }
  if (text === '/show') {
    setState(userId, STATES.SHOW_AWAITING_ALBUM_ID);
    await reply('Введите ID альбома или /cancel');
    return;
  }
  await reply(`Не понимаю. ${COMMANDS_HELP}`);
};

const handleUploadAwaitingPhoto = async (text, reply, userId, attachments) => {
  if (text === '/cancel') {
    resetState(userId);
    await reply('Отменено.');
    return;
  }
  if (!attachments?.length) {
    await reply('Нужна картинка. Отправьте фото или /cancel');
    return;
  }
  const file = attachments[0];
  const result = saveImage({ ...file, ownerId: userId });
  resetState(userId);
  await reply(result.ok
    ? `Загружено. ID: ${result.image.id}\nURL: ${result.image.url}`
    : `Ошибка: ${result.error}`);
};

const handleAlbumMenu = async (text, reply, userId) => {
  if (text === '/cancel') {
    resetState(userId);
    await reply('Отменено.');
    return;
  }
  if (text === '1') {
    setState(userId, STATES.ALBUM_AWAITING_NAME);
    await reply('Введите название альбома или /cancel');
    return;
  }
  if (text === '2') {
    setState(userId, STATES.ALBUM_AWAITING_ALBUM_ID);
    await reply('Введите ID альбома или /cancel');
    return;
  }
  await reply('Введите 1 или 2, либо /cancel');
};

const handleAlbumAwaitingName = async (text, reply, userId) => {
  if (text === '/cancel') {
    resetState(userId);
    await reply('Отменено.');
    return;
  }
  const result = createAlbum(text, userId);
  resetState(userId);
  await reply(result.ok
    ? `Альбом "${result.album.name}" создан. ID: ${result.album.id}`
    : `Ошибка: ${result.error}`);
};

const handleAlbumAwaitingAlbumId = async (text, reply, userId) => {
  if (text === '/cancel') {
    resetState(userId);
    await reply('Отменено.');
    return;
  }
  setState(userId, STATES.ALBUM_AWAITING_IMAGE_ID, { albumId: text });
  await reply('Введите ID картинки или /cancel');
};

const handleAlbumAwaitingImageId = async (text, reply, userId, context) => {
  if (text === '/cancel') {
    resetState(userId);
    await reply('Отменено.');
    return;
  }
  const result = addImageToAlbum(context.albumId, text, userId);
  resetState(userId);
  await reply(result.ok
    ? `Добавлено в альбом "${result.album.name}"`
    : `Ошибка: ${result.error}`);
};

const handleShowAwaitingAlbumId = async (text, reply, userId) => {
  if (text === '/cancel') {
    resetState(userId);
    await reply('Отменено.');
    return;
  }
  const result = getAlbumImages(text, userId);
  if (!result.ok) {
    resetState(userId);
    await reply(`Ошибка: ${result.error}`);
    return;
  }
  if (result.images.length === 0) {
    resetState(userId);
    await reply('В альбоме нет картинок.');
    return;
  }
  const list = result.images.map((img) => `ID ${img.id} — ${img.url}`).join('\n');
  setState(userId, STATES.SHOW_AWAITING_DELETE_ID, { albumId: text });
  await reply(`${list}\n\nВведите ID картинки для удаления или /cancel`);
};

const handleShowAwaitingDeleteId = async (text, reply, userId, context) => {
  if (text === '/cancel') {
    resetState(userId);
    await reply('Отменено.');
    return;
  }
  const result = removeImageFromAlbum(context.albumId, text, userId);
  resetState(userId);
  await reply(result.ok
    ? 'Удалено.'
    : `Ошибка: ${result.error}`);
};

const handleMessage = async (text, reply, options = {}) => {
  const userId = options.userId ?? 'anonymous';
  const attachments = options.attachments ?? [];
  const { state, context } = getState(userId);

  switch (state) {
  case STATES.IDLE:
    return handleIdle(text, reply, userId, attachments);
  case STATES.UPLOAD_AWAITING_PHOTO:
    return handleUploadAwaitingPhoto(text, reply, userId, attachments);
  case STATES.ALBUM_MENU:
    return handleAlbumMenu(text, reply, userId);
  case STATES.ALBUM_AWAITING_NAME:
    return handleAlbumAwaitingName(text, reply, userId);
  case STATES.ALBUM_AWAITING_ALBUM_ID:
    return handleAlbumAwaitingAlbumId(text, reply, userId);
  case STATES.ALBUM_AWAITING_IMAGE_ID:
    return handleAlbumAwaitingImageId(text, reply, userId, context);
  case STATES.SHOW_AWAITING_ALBUM_ID:
    return handleShowAwaitingAlbumId(text, reply, userId);
  case STATES.SHOW_AWAITING_DELETE_ID:
    return handleShowAwaitingDeleteId(text, reply, userId, context);
  default:
    resetState(userId);
    return handleIdle(text, reply, userId, attachments);
  }
};

export default handleMessage;