const games = new Map();
const sessions = new Map();

let nextGameId = 1;

const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const createSnake = (playerIndex) => {
  if (playerIndex === 0) {
    return [{ x: 1, y: 1 }, { x: 0, y: 1 }];
  }
  return [{ x: 8, y: 8 }, { x: 7, y: 8 }];
};

export const createGame = (fieldSize = 10) => {
  const id = nextGameId++;
  const code = generateCode();
  const game = {
    id,
    code,
    fieldSize,
    players: [],
    status: 'waiting',
    createdAt: new Date(),
  };
  games.set(id, game);
  return game;
};

export const findGameByCode = (code) =>
  [...games.values()].find((g) => g.code === String(code).toUpperCase());

export const getGame = (id) => games.get(Number(id));

export const addPlayer = (game, playerId) => {
  if (!game || game.players.length >= 2) return null;
  if (game.players.some((p) => p.id === playerId)) return null;

  const snake = createSnake(game.players.length);
  const player = {
    id: playerId,
    direction: 'right',
    score: 0,
    snake,
  };
  game.players.push(player);

  if (game.players.length === 2) {
    game.status = 'playing';
  }
  return player;
};

export const getSession = (chatId) => {
  if (!sessions.has(chatId)) {
    sessions.set(chatId, {
      state: 'IDLE',
      gameId: null,
      pendingFieldSize: null,
    });
  }
  return sessions.get(chatId);
};

export const clearSessions = () => sessions.clear();
export const clearGames = () => {
  games.clear();
  nextGameId = 1;
};