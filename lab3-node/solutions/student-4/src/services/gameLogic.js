const DIRECTIONS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

export const isValidDirection = (direction) =>
  Object.hasOwn(DIRECTIONS, direction);

export const moveSnake = (player, direction, fieldWidth, fieldHeight) => {
  if (!isValidDirection(direction)) {
    return { ok: false, error: 'Неверное направление' };
  }

  const { dx, dy } = DIRECTIONS[direction];
  const head = player.snake[0];
  const newHead = { x: head.x + dx, y: head.y + dy };

  if (
    newHead.x < 0 || newHead.x >= fieldWidth ||
    newHead.y < 0 || newHead.y >= fieldHeight
  ) {
    return { ok: false, error: 'Стена' };
  }

  if (player.snake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
    return { ok: false, error: 'Столкновение с собой' };
  }

  player.snake.unshift(newHead);
  player.snake.pop();
  player.direction = direction;
  player.score += 1;

  return { ok: true };
};

export const renderField = (game, width = 10, height = 10) => {
  const field = Array.from({ length: height }, () => Array(width).fill('.'));

  game.players.forEach((player, index) => {
    const symbol = index === 0 ? '🟢' : '🔵';
    player.snake.forEach(({ x, y }) => {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        field[y][x] = symbol;
      }
    });
  });

  return field.map((row) => row.join('')).join('\n');
};