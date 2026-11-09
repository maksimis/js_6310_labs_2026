import { jest } from '@jest/globals';
import { handleMessage } from '../src/handlers/messageHandler.js';
import { StateManager, FSM_STATES } from '../src/utils/index.js';

describe('Message Handler & Bot Scenarios Tests', () => {
  let botMock;
  let stateManager;

  beforeEach(() => {
    botMock = {
      sendMessage: jest.fn().mockResolvedValue(true)
    };
    stateManager = new StateManager();
  });

  test('Игнорирует пустой объект сообщения и предупреждает при отсутствии текста', async () => {
    await handleMessage(botMock, null, stateManager);
    expect(botMock.sendMessage).not.toHaveBeenCalled();

    await handleMessage(botMock, { chat: { id: 1 } }, stateManager);
    expect(botMock.sendMessage).toHaveBeenCalledWith(
      1,
      expect.stringContaining('текстовое сообщение')
    );
  });

  test('Команды /start и /help отправляют справку', async () => {
    await handleMessage(botMock, { chat: { id: 1 }, text: '/start' }, stateManager);
    expect(botMock.sendMessage).toHaveBeenCalledWith(
      1,
      expect.stringContaining('SudokuBot'),
      expect.any(Object)
    );
  });

  test('Пошаговый сценарий /generate -> выбор сложности', async () => {
    await handleMessage(botMock, { chat: { id: 1 }, text: '/generate' }, stateManager);
    expect(stateManager.getState(1)).toBe(FSM_STATES.WAITING_DIFFICULTY);

    await handleMessage(botMock, { chat: { id: 1 }, text: 'неизвестно' }, stateManager);
    expect(botMock.sendMessage).toHaveBeenLastCalledWith(
      1,
      expect.stringContaining('Некорректная сложность')
    );

    await handleMessage(botMock, { chat: { id: 1 }, text: 'лёгкая' }, stateManager);
    expect(stateManager.getState(1)).toBe(FSM_STATES.PLAYING);
    expect(botMock.sendMessage).toHaveBeenLastCalledWith(
      1,
      expect.stringContaining('Партия создана!'),
      expect.any(Object)
    );
  });

  test('Пошаговый сценарий /hint (1 подсказка на партию)', async () => {
    await handleMessage(botMock, { chat: { id: 1 }, text: '/hint' }, stateManager);
    expect(botMock.sendMessage).toHaveBeenLastCalledWith(
      1,
      expect.stringContaining('нет активной партии')
    );

    await handleMessage(botMock, { chat: { id: 1 }, text: '/generate 1' }, stateManager);
    await handleMessage(botMock, { chat: { id: 1 }, text: '/hint' }, stateManager);
    expect(stateManager.getState(1)).toBe(FSM_STATES.WAITING_HINT_CELL);

    await handleMessage(botMock, { chat: { id: 1 }, text: '99 99' }, stateManager);
    expect(botMock.sendMessage).toHaveBeenLastCalledWith(
      1,
      expect.stringContaining('от 1 до 9')
    );

    // ДИНАМИЧЕСКИЙ ПОИСК ПУСТОЙ КЛЕТКИ ДЛЯ ТЕСТА
    const game = stateManager.getGame(1);
    let emptyRow = 1, emptyCol = 1;
    for (let r = 0; r < 9; r += 1) {
      for (let c = 0; c < 9; c += 1) {
        if (game.puzzle[r][c] === 0) {
          emptyRow = r + 1;
          emptyCol = c + 1;
          break;
        }
      }
      if (game.puzzle[emptyRow - 1][emptyCol - 1] === 0) break;
    }

    // Отправляем найденные пустые координаты вместо жестких '1 1'
    await handleMessage(botMock, { chat: { id: 1 }, text: `${emptyRow} ${emptyCol}` }, stateManager);
    
    expect(stateManager.getState(1)).toBe(FSM_STATES.PLAYING);
    expect(stateManager.getGame(1).hintsRemaining).toBe(0);

    await handleMessage(botMock, { chat: { id: 1 }, text: '/hint' }, stateManager);
    expect(botMock.sendMessage).toHaveBeenLastCalledWith(
      1,
      expect.stringContaining('Лимит подсказок исчерпан')
    );
  });

  test('Пошаговый сценарий /solve (ошибки и верное решение)', async () => {
    await handleMessage(botMock, { chat: { id: 1 }, text: '/solve' }, stateManager);
    expect(botMock.sendMessage).toHaveBeenLastCalledWith(
      1,
      expect.stringContaining('нет активной партии')
    );

    await handleMessage(botMock, { chat: { id: 1 }, text: '/generate 2' }, stateManager);
    await handleMessage(botMock, { chat: { id: 1 }, text: '/solve' }, stateManager);
    expect(stateManager.getState(1)).toBe(FSM_STATES.WAITING_SOLVE_BOARD);

    await handleMessage(botMock, { chat: { id: 1 }, text: '123' }, stateManager);
    expect(botMock.sendMessage).toHaveBeenLastCalledWith(
      1,
      expect.stringContaining('Некорректная длина поля')
    );

    const game = stateManager.getGame(1);
    const wrongBoard = game.solution.map((r) => [...r]);
    wrongBoard[0][0] = wrongBoard[0][0] === 9 ? 1 : 9;
    const wrongStr = wrongBoard.flat().join('');

    await handleMessage(botMock, { chat: { id: 1 }, text: wrongStr }, stateManager);
    expect(botMock.sendMessage).toHaveBeenLastCalledWith(
      1,
      expect.stringContaining('Обнаружено ошибок'),
      expect.any(Object)
    );

    const correctStr = game.solution.flat().join('');
    await handleMessage(botMock, { chat: { id: 1 }, text: `/solve ${correctStr}` }, stateManager);
    expect(botMock.sendMessage).toHaveBeenLastCalledWith(
      1,
      expect.stringContaining('Поздравляем!'),
      expect.any(Object)
    );
    expect(stateManager.getState(1)).toBe(FSM_STATES.IDLE);
  });

  test('Команда /cancel, текстовые сообщения вне команд и неизвестные команды', async () => {
    await handleMessage(botMock, { chat: { id: 1 }, text: 'привет' }, stateManager);
    expect(botMock.sendMessage).toHaveBeenLastCalledWith(
      1,
      expect.stringContaining('Используйте команду /generate')
    );

    await handleMessage(botMock, { chat: { id: 1 }, text: '/cancel' }, stateManager);
    expect(botMock.sendMessage).toHaveBeenLastCalledWith(
      1,
      expect.stringContaining('Состояние сброшено')
    );

    await handleMessage(botMock, { chat: { id: 1 }, text: '/generate 1' }, stateManager);
    await handleMessage(botMock, { chat: { id: 1 }, text: 'обычный текст' }, stateManager);
    expect(botMock.sendMessage).toHaveBeenLastCalledWith(
      1,
      expect.stringContaining('Вы находитесь в режиме партии')
    );

    await handleMessage(botMock, { chat: { id: 1 }, text: '/cancel' }, stateManager);
    expect(botMock.sendMessage).toHaveBeenLastCalledWith(
      1,
      expect.stringContaining('вернулись к активной партии')
    );

    await handleMessage(botMock, { chat: { id: 1 }, text: '/unknown' }, stateManager);
    expect(botMock.sendMessage).toHaveBeenLastCalledWith(
      1,
      expect.stringContaining('Неизвестная команда')
    );
  });
});