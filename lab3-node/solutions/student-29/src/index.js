import app from './api/server.js';
import runVkBot from './bots/vkBot.js';

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API на http://localhost:${PORT}`));

runVkBot();