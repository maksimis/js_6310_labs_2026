import { Game2048 } from '../src/game.js';

describe('Game2048', () => {
    let game;

    beforeEach(() => {
        game = new Game2048();
    });

    describe('constructor', () => {
        test('создаёт пустое поле 4x4', () => {
            const newGame = new Game2048();
            expect(newGame.grid).toHaveLength(4);
            newGame.grid.forEach(row => {
                expect(row).toHaveLength(4);
                row.forEach(cell => expect(cell).toBe(0));
            });
        });

        test('история ходов пуста', () => {
            const newGame = new Game2048();
            expect(newGame.history).toEqual([]);
        });
    });

    describe('startNewGame', () => {
        test('создаёт поле с двумя плитками', () => {
            const result = game.startNewGame();
            expect(typeof result).toBe('string');
            
            let nonZeroCount = 0;
            game.grid.forEach(row => {
                row.forEach(cell => {
                    if (cell !== 0) nonZeroCount++;
                });
            });
            expect(nonZeroCount).toBe(2);
        });

        test('очищает историю', () => {
            game.startNewGame();
            expect(game.history).toEqual([]);
        });

        test('возвращает строковое представление поля', () => {
            const result = game.startNewGame();
            const lines = result.split('\n');
            expect(lines).toHaveLength(4);
        });
    });

    describe('addRandomTile', () => {
        test('добавляет плитку 2 или 4', () => {
            game.startNewGame();
            const emptyBefore = game.grid.flat().filter(c => c === 0).length;
            game.addRandomTile();
            const emptyAfter = game.grid.flat().filter(c => c === 0).length;
            expect(emptyAfter).toBe(emptyBefore - 1);
        });

        test('не добавляет плитку на полное поле', () => {
            game.grid = [
                [2, 4, 8, 16],
                [32, 64, 128, 256],
                [512, 1024, 2048, 2],
                [4, 8, 16, 32]
            ];
            game.addRandomTile();
            expect(game.grid[0][0]).toBe(2);
            expect(game.grid[3][3]).toBe(32);
        });
    });

    describe('moveLeft', () => {
        test('двигает плитки влево', () => {
            game.grid = [
                [0, 0, 0, 2],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            game.moveLeft();
            expect(game.grid[0][0]).toBe(2);
            expect(game.grid[0][3]).toBe(0);
        });

        test('сливает одинаковые плитки', () => {
            game.grid = [
                [2, 2, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            game.moveLeft();
            expect(game.grid[0][0]).toBe(4);
            expect(game.grid[0][1]).toBe(0);
        });

        test('возвращает true, если поле изменилось', () => {
            game.grid = [
                [0, 0, 0, 2],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            expect(game.moveLeft()).toBe(true);
        });

        test('возвращает false, если поле не изменилось', () => {
            game.grid = [
                [2, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            expect(game.moveLeft()).toBe(false);
        });
    });

    describe('moveRight', () => {
        test('двигает плитки вправо', () => {
            game.grid = [
                [2, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            game.moveRight();
            expect(game.grid[0][3]).toBe(2);
            expect(game.grid[0][0]).toBe(0);
        });

        test('сливает одинаковые плитки', () => {
            game.grid = [
                [0, 0, 2, 2],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            game.moveRight();
            expect(game.grid[0][3]).toBe(4);
        });
    });

    describe('moveUp', () => {
        test('двигает плитки вверх', () => {
            game.grid = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [2, 0, 0, 0]
            ];
            game.moveUp();
            expect(game.grid[0][0]).toBe(2);
            expect(game.grid[3][0]).toBe(0);
        });

        test('сливает одинаковые плитки', () => {
            game.grid = [
                [2, 0, 0, 0],
                [2, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            game.moveUp();
            expect(game.grid[0][0]).toBe(4);
        });
    });

    describe('moveDown', () => {
        test('двигает плитки вниз', () => {
            game.grid = [
                [2, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            game.moveDown();
            expect(game.grid[3][0]).toBe(2);
            expect(game.grid[0][0]).toBe(0);
        });

        test('сливает одинаковые плитки', () => {
            game.grid = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [2, 0, 0, 0],
                [2, 0, 0, 0]
            ];
            game.moveDown();
            expect(game.grid[3][0]).toBe(4);
        });
    });

    // тесты для move() с проверкой направления
    describe('move', () => {
        test('двигает плитки через move() с английским направлением', () => {
            game.grid = [
                [0, 0, 0, 2],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            // move() добавит случайную плитку поэтому проверяем только что ход прошёл
            const result = game.move('left');
            expect(typeof result).toBe('string');
        });

        test('возвращает ошибку при неверном направлении', () => {
            const result = game.move('вбок');
            expect(result).toContain('Неверное направление');
        });

        test('поддерживает русские направления', () => {
            game.grid = [
                [0, 0, 0, 2],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            const result = game.move('влево');
            expect(typeof result).toBe('string');
        });

        test('сохраняет состояние в историю перед ходом', () => {
            game.startNewGame();
            const gridBefore = game.grid.map(row => [...row]);
            game.move('left');
            expect(game.history.length).toBeGreaterThan(0);
            expect(game.history[0]).toEqual(gridBefore);
        });
    });

    describe('undo', () => {
        test('отменяет последний ход', () => {
            game.startNewGame();
            const gridBefore = game.grid.map(row => [...row]);
            game.move('left');
            const result = game.undo();
            expect(result).not.toBeNull();
            expect(game.grid).toEqual(gridBefore);
        });

        test('возвращает null, если история пуста', () => {
            const result = game.undo();
            expect(result).toBeNull();
        });

        test('может отменить несколько ходов', () => {
            game.startNewGame();
            game.move('left');
            game.move('up');
            const firstUndo = game.undo();
            expect(firstUndo).not.toBeNull();
            const secondUndo = game.undo();
            expect(secondUndo).not.toBeNull();
        });
    });

    describe('checkWin', () => {
        test('возвращает false, если 2048 не достигнуто', () => {
            game.startNewGame();
            expect(game.checkWin()).toBe(false);
        });

        test('возвращает true, если есть плитка 2048', () => {
            game.grid = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 2048, 0],
                [0, 0, 0, 0]
            ];
            expect(game.checkWin()).toBe(true);
        });

        test('возвращает true, если есть плитка больше 2048', () => {
            game.grid = [
                [4096, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            expect(game.checkWin()).toBe(true);
        });
    });

    describe('hasAvailableMoves', () => {
        test('возвращает true, если есть пустые клетки', () => {
            game.startNewGame();
            expect(game.hasAvailableMoves()).toBe(true);
        });

        test('возвращает true, если есть соседние одинаковые плитки', () => {
            game.grid = [
                [2, 2, 4, 8],
                [16, 32, 64, 128],
                [256, 512, 1024, 2048],
                [2, 4, 8, 16]
            ];
            expect(game.hasAvailableMoves()).toBe(true);
        });

        test('возвращает false, если ходов нет', () => {
            game.grid = [
                [2, 4, 2, 4],
                [4, 2, 4, 2],
                [2, 4, 2, 4],
                [4, 2, 4, 2]
            ];
            expect(game.hasAvailableMoves()).toBe(false);
        });
    });

    describe('gridToString', () => {
        test('возвращает строку с 4 строками', () => {
            game.startNewGame();
            const result = game.gridToString();
            const lines = result.split('\n');
            expect(lines).toHaveLength(4);
        });

        test('пустые клетки отображаются как ⬜', () => {
            game.grid = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            const result = game.gridToString();
            expect(result).toContain('⬜');
        });

        test('числа отображаются корректно', () => {
            game.grid = [
                [2, 4, 8, 16],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            const result = game.gridToString();
            expect(result).toContain('2');
            expect(result).toContain('4');
            expect(result).toContain('8');
            expect(result).toContain('16');
        });
    });
});