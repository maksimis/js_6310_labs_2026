import {
  addPlayer,
  createGame,
  findGameByCode,
  getGame,
  getSession,
} from '../services/gameStore.js';
import { isValidDirection, moveSnake, renderField } from '../services/gameLogic.js';

const helpText =
  'Доступные команды:\n' +
  '/create_game — создать партию\n' +
  '/join <код> — подключиться к партии\n' +
  '/move <направление> — ход (up/down/left/right)\n' +
  '/field — показать поле\n' +
  '/cancel — отменить действие\n' +
  '/help — список команд';

const handleMessage = async (text, chatId, reply) => {
  const session = getSession(chatId);
  const input = (text ?? '').trim();

  if (!input) return;

  const [command, ...args] = input.split(/\s+/);

  if (command === '/start' || command === '/help') {
    session.state = 'IDLE';
    session.pendingFieldSize = null;
    await reply(`Привет! Я SnakeBot.\n\n${helpText}`);
    return;
  }

  if (command === '/cancel') {
    session.state = 'IDLE';
    session.pendingFieldSize = null;
    await reply('Действие отменено.');
    return;
  }

  // ===== FSM: ждём размер поля =====
  if (session.state === 'AWAITING_FIELD_SIZE') {
    const size = Number(input);

    if (!Number.isInteger(size) || size < 5 || size > 50) {
      await reply('Размер поля — целое число от 5 до 50. Попробуйте ещё раз или /cancel.');
      return;
    }

    const game = createGame(size);
    addPlayer(game, chatId);
    session.state = 'IDLE';
    session.gameId = game.id;
    session.pendingFieldSize = null;

    await reply(
      `Партия создана.\nID: ${game.id}\nРазмер: ${size}x${size}\n` +
        `Код приглашения: ${game.code}\nОтправьте другу: /join ${game.code}`,
    );
    return;
  }

  if (command === '/create_game') {
    session.state = 'AWAITING_FIELD_SIZE';
    session.pendingFieldSize = null;
    await reply('Введите размер поля (целое число от 5 до 50), например: 10');
    return;
  }

  if (command === '/join') {
    const code = args[0];
    if (!code) {
      await reply('Укажите код: /join <код>');
      return;
    }
    const game = findGameByCode(code);
    if (!game) {
      await reply('Партия с таким кодом не найдена.');
      return;
    }
    const player = addPlayer(game, chatId);
    if (!player) {
      await reply('Не удалось подключиться: партия заполнена или вы уже в ней.');
      return;
    }
    session.state = 'IDLE';
    session.gameId = game.id;
    await reply(
      `Вы подключены к партии ${game.id}.\nСтатус: ${game.status}\n` +
        `Игроков: ${game.players.length}/2`,
    );
    return;
  }

  if (command === '/move') {
    const direction = (args[0] ?? '').toLowerCase();
    if (!isValidDirection(direction)) {
      await reply('Направление должно быть: up, down, left, right');
      return;
    }
    if (!session.gameId) {
      await reply('Вы не в партии. Создайте /create_game или подключитесь /join.');
      return;
    }
    const game = getGame(session.gameId);
    if (!game) {
      await reply('Партия не найдена.');
      return;
    }
    const player = game.players.find((p) => p.id === chatId);
    if (!player) {
      await reply('Вы не участник этой партии.');
      return;
    }
    const result = moveSnake(player, direction, game.fieldSize, game.fieldSize);
    if (!result.ok) {
      await reply(`Ход невозможен: ${result.error}`);
      return;
    }
    await reply(
      `Ход выполнен. Ваш счёт: ${player.score}\n\n${renderField(game, game.fieldSize, game.fieldSize)}`,
    );
    return;
  }

  if (command === '/field') {
    if (!session.gameId) {
      await reply('Вы не в партии.');
      return;
    }
    const game = getGame(session.gameId);
    if (!game) {
      await reply('Партия не найдена.');
      return;
    }
    await reply(renderField(game, game.fieldSize, game.fieldSize));
    return;
  }

  await reply(`Неизвестная команда.\n\n${helpText}`);
};

export { isValidDirection, helpText };
export default handleMessage;