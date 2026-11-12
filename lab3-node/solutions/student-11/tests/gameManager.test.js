import { GameManager, GameState } from '../src/gameManager.js';

describe('GameManager', () => {
  let manager;

  beforeEach(() => {
    manager = new GameManager();
  });

  describe('constructor', () => {
    test('создаёт пустую карту игр', () => {
      expect(manager.games).toBeInstanceOf(Map);
      expect(manager.games.size).toBe(0);
    });
  });

  describe('getPlayerGame', () => {
    test('создаёт новую игру для нового пользователя', () => {
      const player = manager.getPlayerGame(123);
      expect(player.state).toBe(GameState.IDLE);
      expect(player.game).toBeInstanceOf(Object);
      expect(manager.games.size).toBe(1);
    });

    test('возвращает существующую игру для того же пользователя', () => {
      const player1 = manager.getPlayerGame(123);
      const player2 = manager.getPlayerGame(123);
      expect(player1).toBe(player2);
      expect(manager.games.size).toBe(1);
    });
  });

  describe('startNewGame', () => {
    test('меняет состояние на PLAYING и запускает игру', () => {
      const result = manager.startNewGame(123);
      expect(result.success).toBe(true);
      expect(result.state).toBe(GameState.PLAYING);
      expect(typeof result.message).toBe('string');
    });

    test('перезапускает игру, если она уже была GAME_OVER', () => {
      manager.startNewGame(123);
      const player = manager.getPlayerGame(123);
      player.state = GameState.GAME_OVER;
      
      const result = manager.startNewGame(123);
      expect(result.success).toBe(true);
      expect(result.state).toBe(GameState.PLAYING);
    });
  });

  describe('move', () => {
    test('возвращает ошибку, если игра не начата', () => {
      const result = manager.move(123, 'left');
      expect(result.success).toBe(false);
      // Исправлено: ищем просто "Сначала начни", так как в коде есть слово "новую"
      expect(result.message).toContain('Сначала начни');
    });

    test('делает ход в активной игре', () => {
      manager.startNewGame(123);
      
      // Гарантируем, что ход возможен, чтобы тест не был "хрупким" (flaky)
      const player = manager.getPlayerGame(123);
      player.game.grid = [
        [0, 0, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];

      const result = manager.move(123, 'left');
      expect(result.success).toBe(true);
      expect(typeof result.message).toBe('string');
    });

    test('возвращает ошибку при неверном направлении', () => {
      manager.startNewGame(123);
      const result = manager.move(123, 'вбок');
      expect(result.success).toBe(false);
      expect(result.message).toContain('Неверное направление');
    });
  });

  describe('undo', () => {
    test('возвращает ошибку, если игра не начата', () => {
      const result = manager.undo(123);
      expect(result.success).toBe(false);
    });

    test('возвращает ошибку, если история пуста', () => {
      manager.startNewGame(123);
      const result = manager.undo(123);
      expect(result.success).toBe(false);
      expect(result.message).toContain('Нечего отменять');
    });

    test('успешно отменяет ход', () => {
      manager.startNewGame(123);
      const player = manager.getPlayerGame(123);
      
      // Подготавливаем поле и историю вручную для стабильности теста
      player.game.grid = [[0, 0, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
      player.game.history.push(player.game.grid.map(row => [...row]));
      player.game.moveLeft();

      const result = manager.undo(123);
      expect(result.success).toBe(true);
      // Исправлено: в коде используется "отменен" (без ё), а в тесте было "отменён"
      expect(result.message).toContain('отменен');
    });
  });

  describe('getPlayerState', () => {
    test('возвращает текущее состояние игрока', () => {
      expect(manager.getPlayerState(123)).toBe(GameState.IDLE);
      manager.startNewGame(123);
      expect(manager.getPlayerState(123)).toBe(GameState.PLAYING);
    });
  });
});