import { FSM_STATES, StateManager, generateSudoku } from '../src/utils/index.js';

describe('FSM & StateManager Tests', () => {
  let stateManager;

  beforeEach(() => {
    stateManager = new StateManager();
  });

  test('Изоляция состояний разных пользователей', () => {
    stateManager.setState(1001, FSM_STATES.WAITING_DIFFICULTY);
    expect(stateManager.getState(1001)).toBe(FSM_STATES.WAITING_DIFFICULTY);
    expect(stateManager.getState(2002)).toBe(FSM_STATES.IDLE);
  });

  test('Создание игры и использование единственной подсказки', () => {
    const data = generateSudoku('easy');
    stateManager.startNewGame(1001, data);

    expect(stateManager.getState(1001)).toBe(FSM_STATES.PLAYING);
    expect(stateManager.getGame(1001).hintsRemaining).toBe(1);

    // Ищем пустую ячейку для теста подсказки
    let emptyRow, emptyCol;
    for (let r = 0; r < 9; r += 1) {
      for (let c = 0; c < 9; c += 1) {
        if (data.puzzle[r][c] === 0) {
          emptyRow = r + 1;
          emptyCol = c + 1;
          break;
        }
      }
      if (emptyRow) break;
    }

    const firstHint = stateManager.applyHint(1001, emptyRow, emptyCol);
    expect(firstHint.success).toBe(true);
    expect(firstHint.hintsRemaining).toBe(0);

    // Вторая подсказка должна провалиться, т.к. лимит исчерпан
    const secondHint = stateManager.applyHint(1001, emptyRow, emptyCol === 9 ? 1 : emptyCol + 1);
    expect(secondHint.success).toBe(false);
    expect(secondHint.reason).toBe('NO_HINTS_LEFT');
  });

  test('applyHint возвращает NO_GAME если партия не начата', () => {
    const res = stateManager.applyHint(999, 1, 1);
    expect(res.success).toBe(false);
    expect(res.reason).toBe('NO_GAME');
  });

  test('applyHint не тратит подсказку на уже открытую ячейку', () => {
    const data = generateSudoku('easy');
    stateManager.startNewGame(1001, data);
    
    // Ищем любую уже заполненную ячейку на стартовом поле
    let filledRow, filledCol;
    for (let r = 0; r < 9; r += 1) {
      for (let c = 0; c < 9; c += 1) {
        if (data.puzzle[r][c] !== 0) {
          filledRow = r + 1;
          filledCol = c + 1;
          break;
        }
      }
      if (filledRow) break;
    }

    const result = stateManager.applyHint(1001, filledRow, filledCol);
    expect(result.success).toBe(false);
    expect(result.reason).toBe('CELL_ALREADY_REVEALED');
    expect(stateManager.getGame(1001).hintsRemaining).toBe(1); // Подсказка сохранилась
  });

  test('resetUser сбрасывает состояние пользователя в IDLE', () => {
    const data = generateSudoku('easy');
    stateManager.startNewGame(1001, data);
    stateManager.resetUser(1001);

    expect(stateManager.getState(1001)).toBe(FSM_STATES.IDLE);
    expect(stateManager.getGame(1001)).toBeNull();
  });
});