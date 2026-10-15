import { COMMANDS, GAME_STATES, DIFFICULTIES } from '../game/constants.js';
import {
  getGame,
  createGame,
  updateGame,
  deleteGame,
  setState,
} from '../game/gameState.js';
import { checkGuess, getSequenceText } from '../game/gameLogic.js';

const handleMessage = async (text, reply, userId = 'default') => {
  if (!text) return;

  const command = String(text).trim().toLowerCase();

  // /start
  if (command === COMMANDS.START) {
    await reply(
      'Привет! Я SimonBot 🎮\n\n' +
      'Команды:\n' +
      '/new_game — новая игра\n' +
      '/sequence — показать последовательность\n' +
      '/guess <цвет> — ответить\n' +
      '/help — помощь'
    );
    return;
  }

  // /help
  if (command === COMMANDS.HELP) {
    await reply(
      'Как играть:\n' +
      '1. /new_game — выбери сложность\n' +
      '2. /sequence — запомни цвета\n' +
      '3. /guess red — повтори'
    );
    return;
  }

  // /new_game
  if (command === COMMANDS.NEW_GAME) {
    setState(userId, GAME_STATES.CHOOSING_DIFFICULTY);
    await reply(
      'Выбери сложность:\n' +
      '1 — лёгкая (3 цвета)\n' +
      '2 — средняя (5 цветов)\n' +
      '3 — сложная (8 цветов)'
    );
    return;
  }

  // FSM: выбор сложности
  const game = getGame(userId);
  if (game && game.state === GAME_STATES.CHOOSING_DIFFICULTY) {
    const difficultyMap = { '1': 'easy', '2': 'medium', '3': 'hard' };
    const difficulty = difficultyMap[command];

    if (!difficulty) {
      await reply('Пожалуйста, выбери 1, 2 или 3');
      return;
    }

    const newGame = createGame(userId, difficulty);
    await reply(
      `Игра началась! Сложность: ${DIFFICULTIES[difficulty].name}\n` +
      `Запомни последовательность из ${newGame.sequence.length} цветов`
    );
    return;
  }

  // /sequence
  if (command === COMMANDS.SEQUENCE) {
    if (!game || game.state !== GAME_STATES.PLAYING) {
      await reply('Сначала начни игру: /new_game');
      return;
    }
    await reply(`Последовательность: ${getSequenceText(game.sequence)}`);
    return;
  }

  // /guess
  if (command.startsWith(COMMANDS.GUESS)) {
    if (!game || game.state !== GAME_STATES.PLAYING) {
      await reply('Сначала начни игру: /new_game');
      return;
    }

    const guess = command.replace(COMMANDS.GUESS, '').trim();
    if (!guess) {
      await reply('Укажи цвет: /guess red');
      return;
    }

    if (!checkGuess(game.sequence, guess)) {
      await reply('Неверный цвет! Доступные: red, green, blue, yellow');
      return;
    }

    const expectedColor = game.sequence[game.currentStep];

    if (guess === expectedColor) {
      const newStep = game.currentStep + 1;
      updateGame(userId, { currentStep: newStep });

      if (newStep === game.sequence.length) {
        await reply('🎉 Победа! Ты запомнил всю последовательность!');
        deleteGame(userId);
      } else {
        await reply(`✅ Правильно! Шаг ${newStep}`);
      }
    } else {
      const record = Math.max(game.record, game.currentStep);
      updateGame(userId, { state: GAME_STATES.GAME_OVER, record });
      await reply(
        `❌ Ошибка! Ты прерван на шаге ${game.currentStep}\n` +
        `Текущий рекорд: ${record}`
      );
    }
    return;
  }

  // Неизвестная команда
  await reply('Неизвестная команда. Используй /help');
};

export default handleMessage;