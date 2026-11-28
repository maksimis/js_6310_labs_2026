import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import handleMessage, {
  STATES,
  getSession,
  resetSessions,
} from '../src/handlers/messageHandler.js';
import { resetLeaderboard } from '../src/tetris/records.js';
import { getTetramino } from '../src/tetris/tetramino.js';

// Хелпер для эмуляции отправки сообщения
const send = async (userId, text) => {
  const reply = jest.fn();
  await handleMessage(userId, text, reply);
  return reply.mock.calls.map((call) => call[0]).join('\n');
};

describe('messageHandler', () => {
  beforeEach(() => {
    resetSessions();
    resetLeaderboard();
  });

  test('/start and /help return bot description and command list', async () => {
    const startRes = await send(1, '/start');
    expect(startRes).toContain('TetrisBattleBot');
    expect(startRes).toContain('/field');

    const helpRes = await send(1, '/help');
    expect(helpRes).toContain('TetrisBattleBot');
    expect(getSession(1).state).toBe(STATES.IDLE);
  });

  test('/field displays empty field initially', async () => {
    const res = await send(1, '/field');
    expect(res).toContain('Партия не начата');
    expect(res).toContain('Счёт: 0');
    expect(res).toContain('+---------------------+');
  });

  test('/next_tetramino generates a piece and awaits drop column', async () => {
    const res = await send(1, '/next_tetramino');
    expect(res).toContain('Фигура:');
    expect(res).toContain('■');
    expect(getSession(1).state).toBe(STATES.WAIT_DROP_COLUMN);
    expect(getSession(1).nextTetramino).not.toBeNull();
    expect(getSession(1).activeGame).toBe(true);
  });

  test('/field shows pending next tetramino when active', async () => {
    await send(1, '/next_tetramino');
    const res = await send(1, '/field');
    expect(res).toContain('Ожидает сброса:');
    expect(res).toContain('Активная партия');
  });

  test('/drop without arguments asks for column number', async () => {
    const res = await send(1, '/drop');
    expect(res).toContain('Введите номер столбца');
    expect(getSession(1).state).toBe(STATES.WAIT_DROP_COLUMN);
  });

  test('/drop with invalid non-integer argument returns error', async () => {
    const res = await send(1, '/drop abc');
    expect(res).toContain('целым числом от 1 до 10');
  });

  test('/drop with valid column places tetramino and updates field', async () => {
    await send(1, '/next_tetramino');
    const res = await send(1, '/drop 1');
    expect(res).toContain('Фигура сброшена в столбец 1');
    expect(res).toContain('Счёт: 0');
    expect(res).toContain('/next_tetramino');
    expect(getSession(1).state).toBe(STATES.IDLE);
    expect(getSession(1).nextTetramino).toBeNull();
  });

  test('/drop with column number automatically generates piece if none pending', async () => {
    const res = await send(1, '/drop 3');
    expect(res).toContain('Фигура сброшена в столбец 3');
    expect(getSession(1).state).toBe(STATES.IDLE);
  });

  test('dropping piece by sending column number in WAIT_DROP_COLUMN', async () => {
    await send(1, '/next_tetramino');
    const res = await send(1, '2');
    expect(res).toContain('Фигура сброшена в столбец 2');
    expect(getSession(1).state).toBe(STATES.IDLE);
  });

  test('sending invalid column number in WAIT_DROP_COLUMN asks again', async () => {
    await send(1, '/next_tetramino');
    const res = await send(1, 'not-a-number');
    expect(res).toContain('корректный номер столбца');
    expect(getSession(1).state).toBe(STATES.WAIT_DROP_COLUMN);
  });

  test('out of bounds column shows error and does not drop', async () => {
    await send(1, '/next_tetramino');
    getSession(1).nextTetramino = getTetramino('I'); // ширина 4
    const res = await send(1, '10'); // 10 + 4 - 1 > 10
    expect(res).toContain('не помещается');
  });

  test('clearing lines awards points and displays event', async () => {
    const session = getSession(1);
    for (let c = 1; c < 10; c++) {
      session.field[19][c] = 1;
    }
    session.nextTetramino = {
      type: 'CUSTOM',
      name: 'Блок',
      matrix: [[1]],
      width: 1,
      height: 1,
    };
    session.state = STATES.WAIT_DROP_COLUMN;

    const res = await send(1, '1');
    expect(res).toContain('Очищено линий: 1');
    expect(res).toContain('+100 очков');
    expect(session.score).toBe(100);
    expect(session.lines).toBe(1);
  });

  test('dropping piece into an overflowed column ends game and prevents further play without /new_game', async () => {
    const session = getSession(1);
    session.field[0][0] = 1;
    session.nextTetramino = getTetramino('O');
    session.state = STATES.WAIT_DROP_COLUMN;

    const res = await send(1, '1');
    expect(res).toContain('Столбец 1 переполнен');
    expect(res).toContain('Игра окончена');
    expect(session.isGameOver).toBe(true);
    expect(session.activeGame).toBe(false);
    expect(session.state).toBe(STATES.GAME_OVER);

    // Попытка продолжить игру через /drop 5 блокируется
    const dropAfterOver = await send(1, '/drop 5');
    expect(dropAfterOver).toContain('Текущая партия уже завершена');

    // Попытка сброса фигуры без аргументов блокируется
    const dropNoArgAfterOver = await send(1, '/drop');
    expect(dropNoArgAfterOver).toContain('Текущая партия уже завершена');

    // Попытка получить фигуру через /next_tetramino блокируется
    const nextAfterOver = await send(1, '/next_tetramino');
    expect(nextAfterOver).toContain('Текущая партия уже завершена');

    // Обычный ввод номера столбца блокируется
    const textAfterOver = await send(1, '5');
    expect(textAfterOver).toContain('Текущая партия завершена');

    // Просмотр поля в режиме Game Over
    const fieldRes = await send(1, '/field');
    expect(fieldRes).toContain('Партия завершена');

    // /help оставляет состояние Game Over
    await send(1, '/help');
    expect(session.isGameOver).toBe(true);
    expect(session.state).toBe(STATES.GAME_OVER);

    // /cancel оставляет состояние Game Over
    await send(1, '/cancel');
    expect(session.isGameOver).toBe(true);
    expect(session.state).toBe(STATES.GAME_OVER);

    // Старт новой игры сбрасывает статус Game Over
    const newGameRes = await send(1, '/new_game');
    expect(newGameRes).toContain('Новая партия начата');
    expect(session.isGameOver).toBe(false);
  });

  test('guards against game over and zero score in sub-handlers', async () => {
    const session = getSession(1);
    session.isGameOver = true;
    session.state = STATES.WAIT_DROP_COLUMN;
    const dropRes = await send(1, '2');
    expect(dropRes).toContain('Текущая партия уже завершена');

    session.isGameOver = false;
    session.score = 0;
    session.state = STATES.WAIT_RECORD_NAME;
    const nameRes = await send(1, 'Hero');
    expect(nameRes).toContain('Нельзя сохранить рекорд с 0 очков');
  });

  test('/records with 0 score notifies player to earn points first and does not switch state', async () => {
    const session = getSession(1);
    session.score = 0;
    const res = await send(1, '/records');
    expect(res).toContain('Таблица лидеров');
    expect(res).toContain('У вас пока 0 очков');
    expect(session.state).toBe(STATES.IDLE);
  });

  test('/records with positive score asks for player name', async () => {
    const session = getSession(1);
    session.score = 650;
    const res = await send(1, '/records');
    expect(res).toContain('Таблица лидеров');
    expect(res).toContain('Ваш текущий счёт: 650');
    expect(session.state).toBe(STATES.WAIT_RECORD_NAME);
  });

  test('entering player name saves actual game score into leaderboard', async () => {
    const session = getSession(1);
    session.score = 750;
    await send(1, '/records');
    const res = await send(1, 'PlayerOne');
    expect(res).toContain('успешно сохранён');
    expect(res).toContain('PlayerOne');
    expect(res).toContain('750');
    expect(session.state).toBe(STATES.IDLE);
  });

  test('entering invalid name keeps waiting in WAIT_RECORD_NAME', async () => {
    const session = getSession(1);
    session.score = 500;
    await send(1, '/records');
    const res = await send(1, 'X');
    expect(res).toContain('слишком короткое');
    expect(getSession(1).state).toBe(STATES.WAIT_RECORD_NAME);
  });

  test('/records save <name> saves actual session score and rejects custom numbers', async () => {
    const session = getSession(1);
    session.score = 450;
    // Попытка передать читерские очки 999999 должна быть проигнорирована — сохраняется session.score (450)
    const res = await send(1, '/records save Cheater 999999');
    expect(res).toContain('Cheater');
    expect(res).toContain('450');
    expect(res).not.toContain('999999');
  });

  test('/records save with 0 score is rejected', async () => {
    const session = getSession(1);
    session.score = 0;
    const res = await send(1, '/records save Cheater 999999');
    expect(res).toContain('Нельзя сохранить рекорд: у вас 0 очков');
  });

  test('/records save with invalid name returns error', async () => {
    const session = getSession(1);
    session.score = 300;
    const res = await send(1, '/records save X');
    expect(res).toContain('Ошибка сохранения');
  });

  test('/new_game and /reset clear board and score', async () => {
    const session = getSession(1);
    session.score = 500;
    session.lines = 5;
    session.field[19][0] = 1;

    const res = await send(1, '/new_game');
    expect(res).toContain('Новая партия начата');
    expect(session.score).toBe(0);
    expect(session.lines).toBe(0);
    expect(session.field[19][0]).toBe(0);
  });

  test('/cancel resets FSM state', async () => {
    const session = getSession(1);
    session.score = 400;
    await send(1, '/records');
    expect(getSession(1).state).toBe(STATES.WAIT_RECORD_NAME);

    const res = await send(1, '/cancel');
    expect(res).toContain('Действие отменено');
    expect(getSession(1).state).toBe(STATES.IDLE);
  });

  test('unknown command and non-command text in IDLE state show help', async () => {
    expect(await send(1, '/unknown_cmd')).toContain('Неизвестная команда');
    expect(await send(1, 'Привет бот')).toContain('Сначала выберите команду');
  });

  test('non-string or empty input does not crash', async () => {
    expect(await send(1, undefined)).toContain('только текстовые сообщения');
    expect(await send(1, '   ')).toContain('только текстовые сообщения');
  });

  test('states of different users are isolated and independent', async () => {
    await send(1, '/next_tetramino');
    expect(getSession(1).state).toBe(STATES.WAIT_DROP_COLUMN);
    expect(getSession(2).state).toBe(STATES.IDLE);

    const session2 = getSession(2);
    session2.score = 200;
    await send(2, '/records');
    expect(getSession(2).state).toBe(STATES.WAIT_RECORD_NAME);
    expect(getSession(1).state).toBe(STATES.WAIT_DROP_COLUMN);
  });
});
