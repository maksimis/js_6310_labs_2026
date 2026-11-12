import 'dotenv/config';
import { createBot } from './bot/index.js';
import { createApi } from './api/index.js';
import { ProviderRegistry } from './providers/index.js';
import { MockProvider } from './providers/mock.js';
import { OpenAIProvider } from './providers/openai.js';
import { PersistentFSM } from './state/index.js';
import { mkdirSync, existsSync } from 'node:fs';

const registry = new ProviderRegistry();

registry.register(new MockProvider());

if (process.env.OPENAI_API_KEY) {
  registry.register(new OpenAIProvider(process.env.OPENAI_API_KEY));
}

if (!existsSync('./data')) {
  mkdirSync('./data', { recursive: true });
}

const fsm = new PersistentFSM('./data/state.json');

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (botToken && botToken !== 'your_telegram_bot_token_here') {
  const bot = createBot(botToken, fsm, registry);
  bot.launch().then(() => console.log('Telegram bot started'));
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
} else {
  console.log('TELEGRAM_BOT_TOKEN not set — running in API-only mode');
}

const PORT = Number(process.env.PORT) || 3000;
const api = createApi(registry);
api.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});