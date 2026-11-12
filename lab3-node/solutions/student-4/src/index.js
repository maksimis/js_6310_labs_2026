import 'dotenv/config';
import runVkBot from './bots/vkBot.js';
import createServer from './api/server.js';

runVkBot();

const port = process.env.PORT || 3000;
const app = createServer();
app.listen(port, () => {
  console.log(`API-сервер запущен на http://localhost:${port}`);
});