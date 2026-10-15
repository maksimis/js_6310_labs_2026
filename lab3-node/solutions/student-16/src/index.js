import { validateConfig } from './config.js';
import { createBot } from './bot.js';

try {
  validateConfig();
  createBot();
  console.log('QuizBot started');
} catch (err) {
  console.error('Failed to start bot:', err.message);
  process.exit(1);
}