import { SudokuManager, GameState } from '../game/SudokuManager.js';

const manager = new SudokuManager();

const HELP_TEXT =
  '📖 Команды Судоку:\n\n' +
  '/generate <easy|medium|hard> — новая партия\n' +
  '/play <клетка> <цифра> — например, /play a1 5\n' +
  '/check — проверить решение\n' +
  '/reset — сбросить текущую партию\n' +
  '/help — эта справка';

/**
 * Обрабатывает текст и userId, возвращает { success, message, state }.
 */
export async function handleCommand(text, userId) {
  const raw = typeof text === 'string' ? text.trim() : '';
  if (!raw) {
    return { success: false, message: '', state: GameState.IDLE };
  }

  const [cmd, ...args] = raw.split(/\s+/);
  const command = cmd.toLowerCase();

  if (command === '/start' || command === '/help') {
    return {
      success: true,
      message: `👋 Привет! Я бот «Судоку».\n\n${HELP_TEXT}`,
      state: manager.getState(userId),
    };
  }

  if (command === '/generate') {
    return manager.generate(userId, (args[0] || 'easy').toLowerCase());
  }

  if (command === '/play') {
    if (args.length < 2) {
      return {
        success: false,
        message: '❌ Формат: /play a1 5',
        state: manager.getState(userId),
      };
    }
    return manager.play(userId, args[0], args[1]);
  }

  if (command === '/check') {
    return manager.check(userId);
  }

  if (command === '/reset') {
    return manager.reset(userId);
  }

  return {
    success: false,
    message: `🤔 Не понимаю команду.\n\n${HELP_TEXT}`,
    state: manager.getState(userId),
  };
}

/**
 * Совместимость с существующим скелетом:
 * handleMessage(text, reply) — вызывает reply с текстом ответа.
 */
const handleMessage = async (text, reply) => {
  const result = await handleCommand(text, 'default');
  if (result.message && typeof reply === 'function') {
    await reply(result.message);
  }
  return result;
};

export default handleMessage;