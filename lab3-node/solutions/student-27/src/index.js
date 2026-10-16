import runTelegramBot from './bots/telegramBot.js';
import runVkBot from './bots/vkBot.js';
import { startApi } from './services/api.js';

runTelegramBot();
runVkBot();
startApi(process.env.PORT || 3000);