import { VK } from 'vk-io';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import handleMessage from '../handlers/messageHandler.js';

dotenv.config();

const UPLOAD_DIR = path.resolve('uploads');

const ensureUploadDir = () => {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
};

const pickPhoto = async (context) => {
  // Загружаем полные данные сообщения
  await context.loadMessagePayload();
  
  if (!context.attachments?.length) return null;

  for (const att of context.attachments) {
    if (att.type === 'photo' && Array.isArray(att.sizes) && att.sizes.length) {
      const largest = att.sizes[att.sizes.length - 1];
      return { url: largest.url, mime: 'image/jpeg', ext: '.jpg' };
    }
    if (att.type === 'doc') {
      const ext = (att.ext || '').toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
        const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
        return { url: att.url, mime, ext: `.${ext}` };
      }
    }
  }
  return null;
};

const downloadPhoto = async (url, ext) => {
  ensureUploadDir();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const filePath = path.join(UPLOAD_DIR, filename);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Не удалось скачать файл: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return { filename, size: buffer.length };
};

const runVkBot = () => {
  const token = process.env.VK_GROUP_TOKEN;
  if (!token) {
    console.log('VK_GROUP_TOKEN не задан — VK-бот пропущен');
    return;
  }

  const vk = new VK({ token });

  vk.updates.on('message_new', async (context) => {
    if (context.isOutbox) return;

    const userId = `vk:${context.senderId}`;
    const text = context.text ?? '';
    const reply = (t) => context.send(t);

    try {
      const attachments = [];
      const photo = await pickPhoto(context);
      if (photo) {
        const file = await downloadPhoto(photo.url, photo.ext);
        attachments.push({ filename: file.filename, mime: photo.mime, size: file.size });
      }
      await handleMessage(text, reply, { userId, attachments });
    } catch (error) {
      console.error('Ошибка обработки сообщения VK:', error.message);
      await reply(`Ошибка: ${error.message}`);
    }
  });

  vk.updates.startPolling()
      .then(() => console.log('VK-бот запущен...'))
      .catch((error) => console.error('Ошибка запуска VK-бота:', error.message));
};

export default runVkBot;