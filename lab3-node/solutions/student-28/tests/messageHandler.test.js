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
    // Заполняем нижнюю строку, кроме столбца 1 (индекс 0)
    for (let c = 1; c < 10; c++) {
      session.field[19][c] = 1;
    }
    // Задаём фигуру I, вертикально или шириной 1
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

  test('game over triggers when field overflows', async () => {
    const session = getSession(1);
    // Блокируем верхнюю строку
    for (let c = 0; c < 10; c++) {
      session.field[0][c] = 1;
    }
    session.nextTetramino = getTetramino('O');
    session.state = STATES.WAIT_DROP_COLUMN;

    const res = await send(1, '1');
    expect(res).toContain('Игра окончена');
    expect(session.activeGame).toBe(false);
    expect(session.state).toBe(STATES.IDLE);
  });

  test('/records displays leaderboard and switches to WAIT_RECORD_NAME', async () => {
    const session = getSession(1);
    session.score = 650;
    const res = await send(1, '/records');
    expect(res).toContain('Таблица лидеров');
    expect(res).toContain('Ваш текущий счёт: 650');
    expect(session.state).toBe(STATES.WAIT_RECORD_NAME);
  });

  test('entering player name saves record and shows updated leaderboard', async () => {
    const session = getSession(1);
    session.score = 750;
    await send(1, '/records');
    const res = await send(1, 'PlayerOne');
    expect(res).toContain('успешно сохранён');
    expect(res).toContain('PlayerOne');
    expect(session.state).toBe(STATES.IDLE);
  });

  test('entering invalid name keeps waiting in WAIT_RECORD_NAME', async () => {
    await send(1, '/records');
    const res = await send(1, 'X');
    expect(res).toContain('слишком короткое');
    expect(getSession(1).state).toBe(STATES.WAIT_RECORD_NAME);
  });

  test('/records save <name> [score] allows direct saving', async () => {
    const res = await send(1, '/records save SuperGamer 950');
    expect(res).toContain('SuperGamer');
    expect(res).toContain('950');
    expect(res).toContain('сохранён');
  });

  test('/records save with invalid name returns error', async () => {
    const res = await send(1, '/records save X 950');
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

  test('/cancel resets FSM state to IDLE', async () => {
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

    await send(2, '/records');
    expect(getSession(2).state).toBe(STATES.WAIT_RECORD_NAME);
    expect(getSession(1).state).toBe(STATES.WAIT_DROP_COLUMN);
  });
});
