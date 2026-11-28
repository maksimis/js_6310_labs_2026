import {
  createEmptyField,
  dropTetramino,
  formatFieldMessage,
} from '../tetris/field.js';
import {
  getRandomTetramino,
  formatTetramino,
} from '../tetris/tetramino.js';
import {
  addRecord,
  formatLeaderboard,
} from '../tetris/records.js';

// Состояния конечного автомата (FSM)
export const STATES = {
  IDLE: 'idle',
  WAIT_RECORD_NAME: 'waitRecordName',
  WAIT_DROP_COLUMN: 'waitDropColumn',
  GAME_OVER: 'gameOver',
};

// Хранилище сессий пользователей (состояние каждого пользователя независимо)
const sessions = new Map();

// Создание или получение существующей сессии пользователя
export function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      state: STATES.IDLE,
      field: createEmptyField(),
      score: 0,
      lines: 0,
      activeGame: false,
      isGameOver: false,
      nextTetramino: null,
      pendingRecordScore: null,
    });
  }
  return sessions.get(userId);
}

// Очистка сессий (для тестов)
export function resetSessions() {
  sessions.clear();
}

const HELP_TEXT = [
  '🎮 Я TetrisBattleBot — помощник для мультиплеерного тетриса с рекордами!',
  '',
  'Доступные команды:',
  '/field — показать поле и счёт активной партии',
  '/next_tetramino — выдать следующее случайное тетрамино',
  '/drop [столбец] — сбросить фигуру в выбранный столбец (1-10)',
  '/records — показать таблицу лидеров и сохранить счёт',
  '/new_game — начать новую партию со сбросом поля',
  '/cancel — отменить текущий пошаговый ввод',
].join('\n');

// Обработка прямого сброса фигуры
async function performDrop(session, colNumber, reply) {
  if (!session.nextTetramino) {
    session.nextTetramino = getRandomTetramino();
    session.activeGame = true;
  }

  const colIndex = colNumber - 1;
  const result = dropTetramino(session.field, session.nextTetramino, colIndex);

  if (!result.success) {
    if (result.gameOver) {
      session.isGameOver = true;
      session.activeGame = false;
      session.nextTetramino = null;
      session.state = STATES.GAME_OVER;
      await reply([
        result.error,
        `Итоговый счёт: ${session.score} очков.`,
        session.score > 0
          ? 'Сохраните ваш результат командой /records или начните заново: /new_game'
          : 'Начните заново командой /new_game',
      ].join('\n'));
      return;
    }
    // Некорректный столбец (выход за границы ширины поля) — ждём повторного ввода
    session.state = STATES.WAIT_DROP_COLUMN;
    await reply(`${result.error}\nОтправьте другой номер столбца (или используйте /drop [номер]):`);
    return;
  }

  session.field = result.newField;
  session.score += result.addedScore;
  session.lines += result.linesCleared;
  session.activeGame = true;
  session.nextTetramino = null;
  session.state = STATES.IDLE;

  const events = [`✅ Фигура сброшена в столбец ${result.placedCol} (строка ${result.placedRow}).`];
  if (result.linesCleared > 0) {
    events.push(`🔥 Очищено линий: ${result.linesCleared} (+${result.addedScore} очков)!`);
  }

  const fieldView = formatFieldMessage(session.field, {
    score: session.score,
    lines: session.lines,
    activeGame: true,
    isGameOver: false,
  });

  await reply(`${events.join('\n')}\n\n${fieldView}\n\nСледующий ход: /next_tetramino`);
}

// Обработчик команды /field
async function handleFieldCommand(session, reply) {
  const message = formatFieldMessage(session.field, {
    score: session.score,
    lines: session.lines,
    activeGame: session.activeGame,
    isGameOver: session.isGameOver,
  });

  let extra = '';
  if (session.isGameOver) {
    extra = '\nПартия завершена. Введите /new_game для новой игры.';
  } else if (session.nextTetramino) {
    extra = `\nОжидает сброса: ${session.nextTetramino.name} (используйте /drop [1-10])`;
  }

  await reply(`${message}${extra}`);
}

// Обработчик команды /next_tetramino
async function handleNextTetraminoCommand(session, reply) {
  if (session.isGameOver) {
    await reply('💥 Текущая партия уже завершена (Игра окончена)! Чтобы начать новую партию, используйте команду /new_game.');
    return;
  }

  session.nextTetramino = getRandomTetramino();
  session.activeGame = true;
  session.state = STATES.WAIT_DROP_COLUMN;

  const maxCol = session.field[0].length - session.nextTetramino.width + 1;
  const response = [
    formatTetramino(session.nextTetramino),
    '',
    `Сбросьте фигуру командой /drop [номер 1-${maxCol}] или просто отправьте номер столбца в ответном сообщении:`,
  ].join('\n');

  await reply(response);
}

// Обработчик команды /records
async function handleRecordsCommand(session, args, reply) {
  if (args.length >= 2 && args[0].toLowerCase() === 'save') {
    const name = args[1];
    if (session.score <= 0) {
      await reply('Нельзя сохранить рекорд: у вас 0 очков. Сначала сыграйте партию и наберите очки!');
      return;
    }
    const addResult = addRecord(name, session.score);
    if (!addResult.success) {
      await reply(`Ошибка сохранения: ${addResult.error}`);
      return;
    }
    session.state = session.isGameOver ? STATES.GAME_OVER : STATES.IDLE;
    await reply([
      `🎉 Счёт ${addResult.record.score} игрока ${addResult.record.name} сохранён (место #${addResult.rank})!`,
      '',
      formatLeaderboard(),
    ].join('\n'));
    return;
  }

  if (session.score <= 0) {
    await reply([
      formatLeaderboard(),
      '',
      'У вас пока 0 очков. Чтобы сохранить рекорд, сначала наберите очки в игре (/next_tetramino, /drop)!',
    ].join('\n'));
    session.state = session.isGameOver ? STATES.GAME_OVER : STATES.IDLE;
    return;
  }

  session.pendingRecordScore = session.score;
  session.state = STATES.WAIT_RECORD_NAME;

  await reply([
    formatLeaderboard(),
    '',
    `Ваш текущий счёт: ${session.score}.`,
    'Введите имя игрока (от 2 до 20 символов), чтобы сохранить результат в таблице рекордов (или /cancel):',
  ].join('\n'));
}

// Обработчик команды /drop
async function handleDropCommand(session, args, reply) {
  if (session.isGameOver) {
    await reply('💥 Текущая партия уже завершена (Игра окончена)! Чтобы начать новую партию, используйте команду /new_game.');
    return;
  }

  if (args.length > 0) {
    const colNumber = Number(args[0]);
    if (!Number.isInteger(colNumber)) {
      await reply('Номер столбца должен быть целым числом от 1 до 10.');
      return;
    }
    await performDrop(session, colNumber, reply);
    return;
  }

  if (!session.nextTetramino) {
    session.nextTetramino = getRandomTetramino();
    session.activeGame = true;
  }

  session.state = STATES.WAIT_DROP_COLUMN;
  const maxCol = session.field[0].length - session.nextTetramino.width + 1;
  await reply([
    `Текущая фигура: ${session.nextTetramino.name} (ширина: ${session.nextTetramino.width})`,
    `Введите номер столбца для сброса (от 1 до ${maxCol}):`,
  ].join('\n'));
}

// Обработчики состояний при обычном текстовом вводе
async function onWaitRecordName(session, text, reply) {
  if (session.score <= 0) {
    session.state = session.isGameOver ? STATES.GAME_OVER : STATES.IDLE;
    await reply('Нельзя сохранить рекорд с 0 очков. Сначала наберите очки в игре!');
    return;
  }

  const result = addRecord(text, session.score);

  if (!result.success) {
    await reply(`${result.error}\nПопробуйте ввести другое имя (или /cancel для отмены):`);
    return;
  }

  session.state = session.isGameOver ? STATES.GAME_OVER : STATES.IDLE;
  session.pendingRecordScore = null;

  await reply([
    `🎉 Счёт ${result.record.score} игрока ${result.record.name} успешно сохранён (место #${result.rank})!`,
    '',
    formatLeaderboard(),
  ].join('\n'));
}

async function onWaitDropColumn(session, text, reply) {
  if (session.isGameOver) {
    await reply('💥 Текущая партия уже завершена (Игра окончена)! Чтобы начать новую партию, используйте команду /new_game.');
    return;
  }
  const colNumber = Number(text);
  if (!Number.isInteger(colNumber)) {
    await reply('Пожалуйста, отправьте корректный номер столбца от 1 до 10 (или /cancel):');
    return;
  }
  await performDrop(session, colNumber, reply);
}

// Таблица соответствия состояний и обработчиков текстового ввода
const stateHandlers = {
  [STATES.WAIT_RECORD_NAME]: onWaitRecordName,
  [STATES.WAIT_DROP_COLUMN]: onWaitDropColumn,
};

// Главная функция обработки входящих сообщений
const handleMessage = async (userId, text, reply) => {
  if (typeof text !== 'string' || text.trim() === '') {
    await reply('Я понимаю только текстовые сообщения. Список команд: /help');
    return;
  }

  const session = getSession(userId);
  const trimmed = text.trim();

  // Обработка команд, начинающихся со слэша
  if (trimmed.startsWith('/')) {
    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
    case '/start':
    case '/help':
      session.state = session.isGameOver ? STATES.GAME_OVER : STATES.IDLE;
      await reply(HELP_TEXT);
      return;

    case '/field':
      await handleFieldCommand(session, reply);
      return;

    case '/next_tetramino':
      await handleNextTetraminoCommand(session, reply);
      return;

    case '/drop':
      await handleDropCommand(session, args, reply);
      return;

    case '/records':
      await handleRecordsCommand(session, args, reply);
      return;

    case '/new_game':
    case '/reset':
      session.field = createEmptyField();
      session.score = 0;
      session.lines = 0;
      session.activeGame = true;
      session.isGameOver = false;
      session.nextTetramino = null;
      session.pendingRecordScore = null;
      session.state = STATES.IDLE;
      await reply('🎮 Новая партия начата! Поле очищено.\nИспользуйте /next_tetramino, чтобы получить первую фигуру.');
      return;

    case '/cancel':
      session.state = session.isGameOver ? STATES.GAME_OVER : STATES.IDLE;
      session.pendingRecordScore = null;
      await reply('Действие отменено. Текущее состояние сброшено в режим ожидания команд (/help).');
      return;

    default:
      await reply('Неизвестная команда. Введите /help для просмотра доступных команд.');
      return;
    }
  }

  // Обработка сообщений в зависимости от текущего состояния FSM
  const handler = stateHandlers[session.state];
  if (!handler) {
    if (session.isGameOver) {
      await reply('💥 Текущая партия завершена (Игра окончена)! Чтобы начать новую партию, введите /new_game.');
      return;
    }
    await reply(`Сначала выберите команду.\n${HELP_TEXT}`);
    return;
  }

  await handler(session, trimmed, reply);
};

export default handleMessage;
