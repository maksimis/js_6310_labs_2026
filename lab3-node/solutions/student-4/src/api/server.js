import express from 'express';
import { addPlayer, createGame, getGame } from '../services/gameStore.js';
import { isValidDirection, moveSnake, renderField } from '../services/gameLogic.js';

const createServer = () => {
  const app = express();
  app.use(express.json());

  app.post('/api/games', (_req, res) => {
    const game = createGame();
    res.status(201).json({ id: game.id, code: game.code });
  });

  app.post('/api/games/:id/move', (req, res) => {
    const { id } = req.params;
    const { player: playerId, direction } = req.body ?? {};

    if (!playerId || !direction) {
      return res.status(400).json({ error: 'Нужны поля player и direction' });
    }

    if (!isValidDirection(direction)) {
      return res.status(400).json({ error: 'Неверное направление' });
    }

    const game = getGame(id);
    if (!game) {
      return res.status(404).json({ error: 'Партия не найдена' });
    }

    let player = game.players.find((p) => p.id === playerId);
    if (!player) {
      player = addPlayer(game, playerId);
      if (!player) {
        return res.status(400).json({ error: 'Не удалось добавить игрока' });
      }
    }

    const result = moveSnake(player, direction, game.fieldSize, game.fieldSize);
    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }

    res.json({
      id: game.id,
      field: renderField(game, game.fieldSize, game.fieldSize),
      score: player.score,
    });
  });

  return app;
};

export default createServer;