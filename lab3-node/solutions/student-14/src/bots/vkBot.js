import { VK } from 'vk-io';
import { handleCommand } from '../handlers/messageHandler.js';

const runVkBot = () => {
  const token = process.env.VK_GROUP_TOKEN;

  if (!token) {
    console.log('VK_GROUP_TOKEN не задан — VK-бот пропущен');
    return null;
  }

  const vk = new VK({ token });

  vk.updates.on('message_new', async (context) => {
    if (context.isOutbox) return;
    try {
      const result = await handleCommand(context.text, context.senderId);
      if (result.message) {
        await context.send(result.message);
      }
    } catch (err) {
      console.error('VK handler error:', err.message);
      await context.send('❌ Внутренняя ошибка. Попробуй ещё раз.');
    }
  });

  vk.updates
      .startPolling()
      .then(() => console.log('VK-бот запущен...'))
      .catch((error) => console.error('Ошибка запуска VK-бота:', error.message));

  return vk;
};

export default runVkBot;