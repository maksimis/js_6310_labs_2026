import 'dotenv/config';
import { createApp } from './app.js';
import { initVkBot } from './vkBot.js';
import { UserFSM } from './messageHandler.js';

const PORT = process.env.PORT || 3000;
const fsm = new UserFSM();

const app = createApp();
app.listen(PORT, () => {
  console.log(`API слушает http://localhost:${PORT}`);
});

if (process.env.VK_TOKEN) {
  try {
    const vk = initVkBot(process.env.VK_TOKEN, fsm);
    vk.updates
      .start()
      .then(() => console.log('VK-бот запущен'))
      .catch((err) => console.error('Ошибка VK-бота:', err.message));
  } catch (err) {
    console.error('Не удалось инициализировать VK-бота:', err.message);
  }
} else {
  console.warn('VK_TOKEN не задан — VK-бот не запущен, работает только API.');
}