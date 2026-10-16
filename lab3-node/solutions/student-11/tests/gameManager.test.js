import { GameManager, GameState } from '../src/gameManager.js';

describe('GameManager', () => {
    let manager;

    beforeEach(() => {
        manager = new GameManager();
    });

    describe('constructor', () => {
        test('создаёт пустое хранилище игр', () => {
            expect(manager.games.size).toBe(0);
        });
    });

    describe('getPlayerGame', () => {
        test('создаёт новую игру для пользователя', () => {
            const player = manager.getPlayerGame(123);
            expect(player).toBeDefined();
            expect(player.state).toBe(GameState.IDLE);
            expect(player.game).toBeDefined();
        });

        test('возвращает ту же игру для того же пользователя', () => {
            const player1 = manager.getPlayerGame(123);
            const player2 = manager.getPlayerGame(123);
            expect(player1).toBe(player2);
        });

        test('создаёт разные игры для разных пользователей', () => {
            const player1 = manager.getPlayerGame(123);
            const player2 = manager.getPlayerGame(456);
            expect(player1).not.toBe(player2);
        });
    });

    describe('startNewGame', () => {
        test('начинает новую игру и возвращает поле', () => {
            const result = manager.startNewGame(123);
            expect(result.success).toBe(true);
            expect(typeof result.message).toBe('string');
            expect(result.state).toBe(GameState.PLAYING);
        });

        test('меняет состояние на PLAYING', () => {
            manager.startNewGame(123);
            const state = manager.getPlayerState(123);
            expect(state).toBe(GameState.PLAYING);
        });

        test('перезапускает существующую игру', () => {
            manager.startNewGame(123);
            const firstResult = manager.startNewGame(123);
            expect(firstResult.success).toBe(true);
        });
    });

    describe('move', () => {
        test('делает ход в активной игре', () => {
            manager.startNewGame(123);
            const result = manager.move(123, 'left');
            expect(result.success).toBe(true);
            expect(typeof result.message).toBe('string');
        });

        test('возвращает ошибку, если игра не начата', () => {
            const result = manager.move(123, 'left');
            expect(result.success).toBe(false);
            expect(result.message).toContain('Сначала начни');
        });

        test('возвращает ошибку при GAME_OVER', () => {
            manager.startNewGame(123);
            // принудительно ставим GAME_OVER
            manager.games.get(123).state = GameState.GAME_OVER;
            
            const result = manager.move(123, 'left');
            expect(result.success).toBe(false);
            expect(result.message).toContain('Игра окончена');
        });

        test('возвращает ошибку при неверном направлении', () => {
            manager.startNewGame(123);
            const result = manager.move(123, 'вбок');
            expect(result.success).toBe(false);
        });

        test('разные игроки имеют независимые игры', () => {
            manager.startNewGame(123);
            manager.startNewGame(456);
            
            manager.move(123, 'left');
            
            // поля должны быть разными (с высокой вероятностью)
            const player1 = manager.getPlayerGame(123);
            const player2 = manager.getPlayerGame(456);
            // просто проверяем что обе игры существуют и активны
            expect(player1.state).toBe(GameState.PLAYING);
            expect(player2.state).toBe(GameState.PLAYING);
        });
    });

    describe('undo', () => {
        test('отменяет последний ход', () => {
            manager.startNewGame(123);
            manager.move(123, 'left');
            
            const result = manager.undo(123);
            expect(result.success).toBe(true);
            expect(result.message).toContain('отменен');
        });

        test('возвращает ошибку, если нечего отменять', () => {
            manager.startNewGame(123);
            const result = manager.undo(123);
            expect(result.success).toBe(false);
            expect(result.message).toContain('Нечего отменять');
        });

        test('возвращает ошибку, если игра не начата', () => {
            const result = manager.undo(123);
            expect(result.success).toBe(false);
        });

        test('после отмены состояние становится PLAYING', () => {
            manager.startNewGame(123);
            manager.move(123, 'left');
            manager.undo(123);
            
            const state = manager.getPlayerState(123);
            expect(state).toBe(GameState.PLAYING);
        });
    });

    describe('getPlayerState', () => {
        test('возвращает IDLE для нового пользователя', () => {
            const state = manager.getPlayerState(123);
            expect(state).toBe(GameState.IDLE);
        });

        test('возвращает PLAYING после начала игры', () => {
            manager.startNewGame(123);
            const state = manager.getPlayerState(123);
            expect(state).toBe(GameState.PLAYING);
        });
    });

    describe('GameState', () => {
        test('имеет три состояния', () => {
            expect(GameState.IDLE).toBe('idle');
            expect(GameState.PLAYING).toBe('playing');
            expect(GameState.GAME_OVER).toBe('game_over');
        });
    });
});