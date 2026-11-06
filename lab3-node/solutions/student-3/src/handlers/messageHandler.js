import {
  FSM_STATES,
  normalizeDifficulty,
  generateSudoku,
  formatBoard,
  parseUserBoard,
  checkSolution,
  parseCellCoordinates
} from '../utils/index.js';

const processDifficultyStep = async (bot, chatId, text, stateManager) => {
  const difficulty = normalizeDifficulty(text);
  if (!difficulty) {
    await bot.sendMessage(
      chatId,
      '⚠️ Некорректная сложность. Пожалуйста, введите: "лёгкая", "средняя" или "сложная" (или цифру 1, 2, 3).'
    );
    return;
  }

  const sudokuData = generateSudoku(difficulty);
  const game = stateManager.startNewGame(chatId, sudokuData);
  const boardText = formatBoard(game.puzzle);

  const response = [
    `🎲 *Партия создана!* (Сложность: *${game.difficultyName}*)`,
    `Доступно подсказок: *${game.hintsRemaining}*`,
    '',
    '```',
    boardText,
    '```',
    '',
    'Доступные действия:',
    '• /solve — проверить заполненное поле',
    '• /hint — получить подсказку для клетки (1 за партию)'
  ].join('\n');

  await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
};

const processHintStep = async (bot, chatId, text, stateManager) => {
  const game = stateManager.getGame(chatId);
  const coords = parseCellCoordinates(text);
  
  if (!coords.isValid) {
    await bot.sendMessage(chatId, `⚠️ ${coords.error}`);
    return;
  }

  const result = stateManager.applyHint(chatId, coords.row, coords.col);
  
  if (!result.success) {
    if (result.reason === 'CELL_ALREADY_REVEALED') {
      await bot.sendMessage(
        chatId,
        `ℹ️ В клетке (строка ${coords.row}, столбец ${coords.col}) уже стоит цифра *${result.value}*.\n\nПодсказка не потрачена! Введите координаты пустой клетки или используйте /cancel.`,
        { parse_mode: 'Markdown' }
      );
      return;
    }

    stateManager.setState(chatId, FSM_STATES.PLAYING);
    await bot.sendMessage(
      chatId,
      '❌ Подсказки в этой партии закончились (осталось подсказок: 0).'
    );
    return;
  }

  const verification = checkSolution(result.puzzle, game.solution);
  if (verification.isSolved) {
    stateManager.resetUser(chatId);
    
    const winResponse = [
      `💡 *Подсказка открыта!* Значение в клетке (строка ${result.row}, столбец ${result.col}): *${result.value}*`,
      '',
      '🎉 *Поздравляем! Это была последняя клетка, судоку решено абсолютно верно!*',
      '',
      'Итоговое поле:',
      '```',
      formatBoard(game.solution),
      '```',
      '',
      'Чтобы начать новую партию, используйте /generate.'
    ].join('\n');

    await bot.sendMessage(chatId, winResponse, { parse_mode: 'Markdown' });
    return;
  }

  const boardText = formatBoard(result.puzzle);
  const response = [
    '💡 *Подсказка открыта!*',
    `Значение в клетке (строка ${result.row}, столбец ${result.col}): *${result.value}*`,
    `Осталось подсказок: *${result.hintsRemaining}*`,
    '',
    '```',
    boardText,
    '```'
  ].join('\n');

  await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
};

const processSolveStep = async (bot, chatId, text, stateManager) => {
  const game = stateManager.getGame(chatId);
  const parsed = parseUserBoard(text);

  if (!parsed.isValid) {
    await bot.sendMessage(
      chatId,
      `⚠️ ${parsed.error}\nПопробуйте отправить поле ещё раз (81 цифра или точка) либо введите /cancel.`
    );
    return;
  }

  const verification = checkSolution(parsed.board, game.solution);

  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      if (parsed.board[r][c] !== 0 && parsed.board[r][c] === game.solution[r][c]) {
        game.puzzle[r][c] = parsed.board[r][c];
      }
    }
  }

  if (verification.isSolved) {
    stateManager.resetUser(chatId);
    
    const winResponse = [
      '🎉 *Поздравляем! Судоку решено абсолютно верно!*',
      '',
      'Итоговое поле:',
      '```',
      formatBoard(game.solution),
      '```',
      '',
      'Чтобы начать новую партию, используйте /generate.'
    ].join('\n');

    await bot.sendMessage(chatId, winResponse, { parse_mode: 'Markdown' });
    return;
  }

  stateManager.setState(chatId, FSM_STATES.PLAYING);

  const lines = ['🔍 *Результат проверки поля:*'];

  if (verification.errors.length > 0) {
    lines.push(`❌ Обнаружено ошибок в заполнении: *${verification.errors.length}*`);
    const sampleErrors = verification.errors.slice(0, 5).map(
      (err) => `• Клетка (строка ${err.row}, столбец ${err.col}): введено ${err.actual}`
    );
    lines.push(...sampleErrors);
  } else {
    lines.push('✅ В заполненных клетках ошибок нет, но остались пустые ячейки.');
  }

  // Добавлено условие: game.hintsRemaining > 0
  if (verification.suggestedHint && game.hintsRemaining > 0) {
    const { row, col } = verification.suggestedHint;
    lines.push(
      '',
      `💡 *Рекомендация:* вы можете потратить свою подсказку на эту ячейку. Введите команду: \`/hint ${row} ${col}\``
    );
  }

  lines.push(
    '',
    'Текущее поле (с учётом верных ответов):',
    '```',
    formatBoard(game.puzzle),
    '```'
  );

  await bot.sendMessage(chatId, lines.join('\n'), { parse_mode: 'Markdown' });
};

export const handleMessage = async (bot, msg, stateManager) => {
  try {
    if (!msg || !msg.chat || typeof msg.chat.id === 'undefined') {
      return;
    }

    const chatId = msg.chat.id;
    const text = typeof msg.text === 'string' ? msg.text.trim() : '';

    if (!text) {
      await bot.sendMessage(chatId, '⚠️ Пожалуйста, отправьте текстовое сообщение или команду.');
      return;
    }

    if (text.startsWith('/')) {
      const [rawCommand, ...args] = text.split(/\s+/);
      const command = rawCommand.toLowerCase().replace(/@\w+$/, '');
      const argText = args.join(' ');

      switch (command) {
      case '/start':
      case '/help': {
        const welcome = [
          '👋 *Добро пожаловать в SudokuBot!*',
          '',
          'Доступные команды:',
          '• `/generate` — сгенерировать судоку (лёгкая, средняя, сложная)',
          '• `/solve` — проверить введённое поле и найти ошибки',
          '• `/hint` — показать правильное значение в выбранной клетке (1 за партию)',
          '• `/cancel` — отменить текущий шаг'
        ].join('\n');
        await bot.sendMessage(chatId, welcome, { parse_mode: 'Markdown' });
        return;
      }

      case '/cancel': {
        const game = stateManager.getGame(chatId);
        if (game) {
          stateManager.setState(chatId, FSM_STATES.PLAYING);
          await bot.sendMessage(chatId, '↩️ Текущий ввод отменён. Вы вернулись к активной партии.');
        } else {
          stateManager.resetUser(chatId);
          await bot.sendMessage(chatId, '↩️ Состояние сброшено. Введите /generate для начала новой игры.');
        }
        return;
      }

      case '/generate': {
        if (argText) {
          await processDifficultyStep(bot, chatId, argText, stateManager);
          return;
        }
        stateManager.setState(chatId, FSM_STATES.WAITING_DIFFICULTY);
        await bot.sendMessage(
          chatId,
          'Выберите сложность судоку:\n1 — Лёгкая\n2 — Средняя\n3 — Сложная\n\nОтправьте название или номер сложности:'
        );
        return;
      }

      case '/solve': {
        const game = stateManager.getGame(chatId);
        if (!game) {
          await bot.sendMessage(chatId, '⚠️ У вас нет активной партии. Сначала запустите /generate.');
          return;
        }

        if (argText) {
          await processSolveStep(bot, chatId, argText, stateManager);
          return;
        }

        stateManager.setState(chatId, FSM_STATES.WAITING_SOLVE_BOARD);
        await bot.sendMessage(
          chatId,
          '📝 Отправьте заполненное поле (81 символ: цифры от 1 до 9, а для пустых клеток — 0 или точка `.`):',
          { parse_mode: 'Markdown' }
        );
        return;
      }

      case '/hint': {
        const game = stateManager.getGame(chatId);
        if (!game) {
          await bot.sendMessage(chatId, '⚠️ У вас нет активной партии. Сначала запустите /generate.');
          return;
        }

        if (game.hintsRemaining <= 0) {
          await bot.sendMessage(
            chatId,
            `❌ Лимит подсказок исчерпан! Осталось подсказок: ${game.hintsRemaining}.`
          );
          return;
        }

        if (argText) {
          await processHintStep(bot, chatId, argText, stateManager);
          return;
        }

        stateManager.setState(chatId, FSM_STATES.WAITING_HINT_CELL);
        await bot.sendMessage(
          chatId,
          `💡 Доступно подсказок: ${game.hintsRemaining}.\nВведите координаты клетки через пробел (строка и столбец от 1 до 9, например: \`2 5\`):`,
          { parse_mode: 'Markdown' }
        );
        return;
      }

      default: {
        await bot.sendMessage(chatId, '❓ Неизвестная команда. Используйте /help для просмотра доступных команд.');
        return;
      }
      }
    }

    const currentState = stateManager.getState(chatId);

    switch (currentState) {
    case FSM_STATES.WAITING_DIFFICULTY:
      await processDifficultyStep(bot, chatId, text, stateManager);
      break;

    case FSM_STATES.WAITING_HINT_CELL:
      await processHintStep(bot, chatId, text, stateManager);
      break;

    case FSM_STATES.WAITING_SOLVE_BOARD:
      await processSolveStep(bot, chatId, text, stateManager);
      break;

    case FSM_STATES.PLAYING:
      await bot.sendMessage(
        chatId,
        'Вы находитесь в режиме партии. Используйте /solve для проверки решения или /hint для получения подсказки.'
      );
      break;

    default:
      await bot.sendMessage(
        chatId,
        'Используйте команду /generate для создания новой игры в Судоку или /help для справки.'
      );
      break;
    }
  } catch (error) {
    console.error('Ошибка обработки сообщения:', error);
    if (msg?.chat?.id) {
      await bot.sendMessage(msg.chat.id, '⚠️ Произошла ошибка при обработке запроса. Попробуйте ещё раз.');
    }
  }
};