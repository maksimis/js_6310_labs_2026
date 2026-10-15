import dotenv from 'dotenv';

dotenv.config();

export const config = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN || '',
  recordsFile: process.env.RECORDS_FILE || 'records.json',
};

export function validateConfig(cfg = config) {
  if (!cfg.telegramToken) {
    throw new Error('TELEGRAM_BOT_TOKEN is not set in .env');
  }
  return true;
}