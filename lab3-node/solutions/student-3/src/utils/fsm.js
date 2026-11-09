export const FSM_STATES = {
  IDLE: 'IDLE',
  WAITING_DIFFICULTY: 'WAITING_DIFFICULTY',
  PLAYING: 'PLAYING',
  WAITING_SOLVE_BOARD: 'WAITING_SOLVE_BOARD',
  WAITING_HINT_CELL: 'WAITING_HINT_CELL'
};

export class StateManager {
  constructor() {
    this.sessions = new Map();
  }

  getUserSession(chatId) {
    const key = String(chatId);
    if (!this.sessions.has(key)) {
      this.sessions.set(key, {
        state: FSM_STATES.IDLE,
        game: null
      });
    }
    return this.sessions.get(key);
  }

  getState(chatId) {
    return this.getUserSession(chatId).state;
  }

  setState(chatId, state) {
    const session = this.getUserSession(chatId);
    session.state = state;
  }

  startNewGame(chatId, { puzzle, solution, difficulty, difficultyName }) {
    const session = this.getUserSession(chatId);
    session.game = {
      puzzle,
      solution,
      difficulty,
      difficultyName,
      hintsRemaining: 1
    };
    session.state = FSM_STATES.PLAYING;
    return session.game;
  }

  getGame(chatId) {
    return this.getUserSession(chatId).game;
  }

  applyHint(chatId, row, col) {
    const session = this.getUserSession(chatId);
    if (!session.game) {
      return { success: false, reason: 'NO_GAME' };
    }

    if (session.game.hintsRemaining <= 0) {
      return {
        success: false,
        reason: 'NO_HINTS_LEFT',
        hintsRemaining: 0
      };
    }

    const rIdx = row - 1;
    const cIdx = col - 1;

    // Проверка: ячейка уже открыта
    if (session.game.puzzle[rIdx][cIdx] !== 0) {
      return {
        success: false,
        reason: 'CELL_ALREADY_REVEALED',
        value: session.game.puzzle[rIdx][cIdx]
      };
    }

    const value = session.game.solution[rIdx][cIdx];

    session.game.puzzle[rIdx][cIdx] = value;
    session.game.hintsRemaining -= 1;
    session.state = FSM_STATES.PLAYING;

    return {
      success: true,
      row,
      col,
      value,
      hintsRemaining: session.game.hintsRemaining,
      puzzle: session.game.puzzle
    };
  }

  resetUser(chatId) {
    const key = String(chatId);
    this.sessions.set(key, {
      state: FSM_STATES.IDLE,
      game: null
    });
  }
}