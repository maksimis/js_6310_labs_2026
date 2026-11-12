import {
  createBoard,
  displayBoard,
  isValidMove,
  makeMove,
  checkWinner,
  isDraw,
  easyDifficulty,
  mediumDifficulty,
  hardDifficulty,
} from '../utils/game.js';

const sessions = new Map();

const DIFFICULTY_FNS = {
  easy: easyDifficulty,
  medium: mediumDifficulty,
  hard: hardDifficulty,
};

const HELP_TEXT =
  'Привет! Я бот для крестиков-ноликов.\n\n' +
  'Команды:\n' +
  '/new_game_easy — новая партия (лёгкая)\n' +
  '/new_game_medium — новая партия (средняя)\n' +
  '/new_game_hard — новая партия (сложная)\n' +
  '/move b2 — сделать ход (колонка a–c, строка 1–3)\n' +
  '/board — показать текущее поле\n' +
  '/start — эта справка';

const AFTER_GAME_HINT =
  '\n\nХочешь ещё? /new_game easy | medium | hard';

function resolveGameState(session) {
  const winner = checkWinner(session.board);
  if (winner === 'X') {
    session.active = false;
    return `Ты выиграл! 🎉\n\n${displayBoard(session.board)}${AFTER_GAME_HINT}`;
  }
  if (winner === 'O') {
    session.active = false;
    return `Бот выиграл 🤖\n\n${displayBoard(session.board)}${AFTER_GAME_HINT}`;
  }
  if (isDraw(session.board)) {
    session.active = false;
    return `Ничья!\n\n${displayBoard(session.board)}${AFTER_GAME_HINT}`;
  }
  return null;
}

const handleMessage = async (text, reply, chatId = 0) => {
  if (typeof text !== 'string' || text === '') {
    return;
  }

  if (text === '/start') {
    await reply(HELP_TEXT);
    return;
  }

  const newGameMap = {
    '/new_game_easy': 'easy',
    '/new_game_medium': 'medium',
    '/new_game_hard': 'hard',
    '/new_game easy': 'easy',
    '/new_game medium': 'medium',
    '/new_game hard': 'hard',
  };

  if (newGameMap[text]) {
    const difficulty = newGameMap[text];

    const session = {
      board: createBoard(),
      difficulty,
      active: true,
    };
    sessions.set(chatId, session);

    await reply(
      `Новая партия (сложность: ${difficulty}).\n` +
      'Ты — X, бот — O.\n' +
      'Твой первый ход: /move a1\n\n' +
      displayBoard(session.board)
    );
    return;
  }

  if (text.startsWith('/new_game')) {
    await reply(
      'Выбери сложность:\n' +
      '/new_game_easy\n' +
      '/new_game_medium\n' +
      '/new_game_hard'
    );
    return;
  }

  if (text === '/board') {
    const session = sessions.get(chatId);
    if (!session || !session.active) {
      await reply('Активной партии нет. Начни новую: /new_game');
      return;
    }
    await reply(displayBoard(session.board));
    return;
  }

  if (text.startsWith('/move')) {
    const session = sessions.get(chatId);
    if (!session || !session.active) {
      await reply('Активной партии нет. Начни новую: /new_game');
      return;
    }

    const parts = text.split(' ');
    const position = parts[1];

    if (!position || !isValidMove(session.board, position)) {
      await reply('Неверный или занятый ход');
      return;
    }

    makeMove(session.board, position, 'X');
    let finished = resolveGameState(session);
    if (finished) {
      await reply(finished);
      return;
    }

    const botMove = DIFFICULTY_FNS[session.difficulty](session.board);
    makeMove(session.board, botMove, 'O');
    finished = resolveGameState(session);
    if (finished) {
      await reply(finished);
      return;
    }

    await reply(`какой твой следующий ход?\n\n${displayBoard(session.board)}`);
    return;
  }

  await reply('Неизвестная команда. Нажми /start, чтобы увидеть список.');
};

export default handleMessage;