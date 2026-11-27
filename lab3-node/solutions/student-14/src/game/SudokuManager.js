import { Sudoku } from './Sudoku.js';
import { GameState } from './GameState.js';
import { parseCoord, isValidValue } from '../utils/sudokuHelpers.js';

export { GameState };

export class SudokuManager {
  constructor() {
    /** @type {Map<number|string, { game: Sudoku|null, state: string, startedAt: number|null, stats: Array }>} */
    this.sessions = new Map();
  }

  getSession(userId) {
    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, {
        game: null,
        state: GameState.IDLE,
        startedAt: null,
        stats: [],
      });
    }
    return this.sessions.get(userId);
  }

  getState(userId) {
    return this.getSession(userId).state;
  }

  /**
   * Обработка команды /generate
   */
  generate(userId, difficulty) {
    const session = this.getSession(userId);
    const level = ['easy', 'medium', 'hard'].includes(difficulty)
      ? difficulty
      : 'easy';

    const game = new Sudoku().generate(level);
    session.game = game;
    session.state = GameState.PLAYING;
    session.startedAt = Date.now();

    return {
      success: true,
      message:
        `🧩 Судоку (${this.#label(level)}) сгенерирована!\n\n` +
        `${game.getGridString()}\n\n` +
        `Пустых клеток: ${game.countEmpty()}\n` +
        'Ход: /play a1 5\nПроверка: /check',
      state: session.state,
    };
  }

  /**
   * Обработка команды /play
   */
  play(userId, coord, value) {
    const session = this.getSession(userId);

    if (session.state === GameState.IDLE) {
      return {
        success: false,
        message: '❌ Сначала сгенерируй судоку: /generate easy',
        state: session.state,
      };
    }
    if (session.state === GameState.SOLVED) {
      return {
        success: false,
        message: '✅ Эта партия уже решена. Начни новую: /generate',
        state: session.state,
      };
    }

    const parsed = parseCoord(coord);
    if (!parsed) {
      return {
        success: false,
        message: '❌ Неверная координата. Пример: a1, b5, i9',
        state: session.state,
      };
    }
    if (!isValidValue(value)) {
      return {
        success: false,
        message: '❌ Неверное значение. Допустимо от 1 до 9',
        state: session.state,
      };
    }

    const result = session.game.setCell(parsed.row, parsed.col, Number(value));
    if (!result.ok) {
      return {
        success: false,
        message: `❌ ${result.reason}\n\n${session.game.getGridString()}`,
        state: session.state,
      };
    }

    const game = session.game;
    let extra = '';
    if (game.isComplete()) {
      const check = game.checkSolution();
      if (check.solved) {
        session.state = GameState.SOLVED;
        const elapsed = this.#elapsedSeconds(session.startedAt);
        session.stats.push({
          difficulty: game.difficulty,
          seconds: elapsed,
          finishedAt: new Date().toISOString(),
        });
        return {
          success: true,
          message:
            `🎉 Поздравляю! Судоку решена за ${elapsed} сек.\n\n` +
            `${game.getGridString()}`,
          state: session.state,
        };
      }
      extra = '\n⚠️ Поле заполнено, но есть ошибки. Проверь /check';
    }

    return {
      success: true,
      message:
        `✅ Ход принят.\n\n${game.getGridString()}\n\n` +
        `Осталось клеток: ${game.countEmpty()}${extra}`,
      state: session.state,
    };
  }

  /**
   * Обработка команды /check
   */
  check(userId) {
    const session = this.getSession(userId);

    if (session.state === GameState.IDLE || !session.game) {
      return {
        success: false,
        message: '❌ Сначала сгенерируй судоку: /generate easy',
        state: session.state,
      };
    }

    const game = session.game;
    const check = game.checkSolution();

    if (check.solved) {
      session.state = GameState.SOLVED;
      const elapsed = this.#elapsedSeconds(session.startedAt);
      session.stats.push({
        difficulty: game.difficulty,
        seconds: elapsed,
        finishedAt: new Date().toISOString(),
      });
      return {
        success: true,
        message:
          `🎉 Решение верное! Время: ${elapsed} сек.\n\n` +
          `${game.getGridString()}`,
        state: session.state,
      };
    }

    const preview = check.errors
        .slice(0, 10)
        .map((e) => `• ${this.#cellName(e.row, e.col)} — сейчас ${e.value || '⬜'}`)
        .join('\n');

    return {
      success: false,
      message:
        `❌ Ошибки (${check.errors.length}):\n${preview}\n\n` +
        `${game.getGridString()}`,
      state: session.state,
    };
  }

  /**
   * Обработка команды /reset
   */
  reset(userId) {
    const session = this.getSession(userId);
    session.game = null;
    session.state = GameState.IDLE;
    session.startedAt = null;
    return {
      success: true,
      message: '🔄 Сессия сброшена. Начни новую: /generate easy',
      state: session.state,
    };
  }

  // ---------------------------------------------------------------------------

  #elapsedSeconds(startedAt) {
    if (!startedAt) return 0;
    return Math.round((Date.now() - startedAt) / 1000);
  }

  #label(level) {
    return { easy: 'лёгкая', medium: 'средняя', hard: 'сложная' }[level] || level;
  }

  #cellName(row, col) {
    const letters = 'abcdefghi';
    return `${letters[col]}${row + 1}`;
  }
}