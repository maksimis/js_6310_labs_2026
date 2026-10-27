import { VK } from 'vk-io'
import dotenv from 'dotenv'
import handleMessage from '../handlers/messageHandler.js'

const runVkBot = () => {
  dotenv.config();
  const token = process.env.VK_GROUP_TOKEN;

  if (!token) {
    console.log('VK_GROUP_TOKEN не задан — VK-бот пропущен');
    return;
  }

  // Создаем экземпляр бота
  const vk = new VK({ token });

  // Обрабатываем входящие сообщения
  vk.updates.on('message_new', async (context) => {
    // Пропускаем исходящие сообщения (ответы бота), чтобы избежать бесконечного цикла
    if (context.isOutbox) {
      return;
    }

    await handleMessage(context.text, (text) => context.send(text));
  });

  // Запускаем бота
  vk.updates.startPolling().then(() => {
    console.log('VK-бот запущен...');
  }).catch((error) => {
    console.error('Ошибка запуска VK-бота:', error.message);
  });
}

export default runVkBot;