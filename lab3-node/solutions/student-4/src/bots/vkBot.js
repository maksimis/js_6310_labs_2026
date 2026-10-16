import { VK } from 'vk-io';
import dotenv from 'dotenv';
import handleMessage from '../handlers/messageHandler.js';

const runVkBot = () => {
  dotenv.config();
  const token = process.env.VK_GROUP_TOKEN;

  if (!token) {
    console.log('VK_GROUP_TOKEN не задан — VK-бот пропущен');
    return null;
  }

  const vk = new VK({ token });

  vk.updates.on('message_new', async (context) => {
    if (context.isOutbox) return;

    const chatId = context.senderId;
    const reply = (text) => context.send(text);

    await handleMessage(context.text, chatId, reply);
  });

  vk.updates
      .startPolling()
      .then(() => console.log('VK-бот запущен.'))
      .catch((error) => console.error('Ошибка VK-бота:', error.message));

  return vk;
};

export default runVkBot;