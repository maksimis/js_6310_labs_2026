// tests/boardStore.test.js
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

const storage = {
  loadState: jest.fn(),
  saveState: jest.fn().mockResolvedValue(undefined)
};

jest.unstable_mockModule('../src/utils/storage.js', () => storage);

const { getBoard, saveBoard, isValidUserId } = await import('../src/core/boardStore.js');
const { Board, Task } = await import('../src/core/models.js');

describe('boardStore', () => {
  beforeEach(() => {
    storage.loadState.mockReset();
    storage.saveState.mockReset();
    storage.saveState.mockResolvedValue(undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('isValidUserId', () => {
    it('принимает числовые ID', () => {
      expect(isValidUserId('123')).toBe(true);
      expect(isValidUserId(123)).toBe(true);
      expect(isValidUserId('0001')).toBe(true);
    });

    it('отклоняет нечисловые и пустые ID', () => {
      expect(isValidUserId('abc')).toBe(false);
      expect(isValidUserId('../123')).toBe(false);
      expect(isValidUserId('')).toBe(false);
      expect(isValidUserId(null)).toBe(false);
      expect(isValidUserId(undefined)).toBe(false);
      expect(isValidUserId('1'.repeat(21))).toBe(false);
    });
  });

  describe('getBoard', () => {
    it('создаёт новую доску, если файла нет', async () => {
      storage.loadState.mockResolvedValue(null);

      const board = await getBoard('201');

      expect(board).toBeInstanceOf(Board);
      expect(board.tasks).toEqual([]);
      expect(storage.loadState).toHaveBeenCalledWith('boards/201.json');
    });

    it('кэширует доску и не читает файл повторно', async () => {
      storage.loadState.mockResolvedValue(null);

      const first = await getBoard('202');
      const second = await getBoard('202');

      expect(second).toBe(first);
      expect(storage.loadState).toHaveBeenCalledTimes(1);
    });

    it('объединяет одновременные запросы к одной доске', async () => {
      let resolveLoad;
      storage.loadState.mockImplementation(() => new Promise((resolve) => {
        resolveLoad = resolve;
      }));

      const first = getBoard('208');
      const second = getBoard('208');

      resolveLoad(null);

      const [firstBoard, secondBoard] = await Promise.all([first, second]);

      expect(secondBoard).toBe(firstBoard);
      expect(storage.loadState).toHaveBeenCalledTimes(1);
    });

    it('восстанавливает задачи и лимиты из файла', async () => {
      storage.loadState.mockResolvedValue({
        wipLimits: { 'In Progress': 1 },
        tasks: [
          {
            id: '001',
            title: 'Первая',
            status: 'In Progress',
            history: ['To Do', 'In Progress'],
            createdAt: '2026-01-01T00:00:00.000Z'
          },
          {
            id: '002',
            title: 'Вторая'
          },
          {
            id: '003'
          }
        ]
      });

      const board = await getBoard('203');

      expect(board.tasks).toHaveLength(2);
      expect(board.tasks[0]).toBeInstanceOf(Task);
      expect(board.tasks[0].status).toBe('In Progress');
      expect(board.tasks[0].history).toEqual(['To Do', 'In Progress']);
      expect(board.tasks[0].createdAt).toBe('2026-01-01T00:00:00.000Z');
      expect(board.tasks[1].status).toBe('To Do');
      expect(board.tasks[1].history).toEqual(['To Do']);
      expect(board.wipLimits['In Progress']).toBe(1);
      expect(board.wipLimits['To Do']).toBe(5);
    });

    it('создаёт новую доску при некорректной структуре файла', async () => {
      storage.loadState.mockResolvedValue({ tasks: 'not-an-array' });

      const board = await getBoard('204');

      expect(board.tasks).toEqual([]);
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Некорректный формат'));
    });

    it('создаёт новую доску, если файл не удалось прочитать', async () => {
      storage.loadState.mockRejectedValue(new Error('Unexpected token'));

      const board = await getBoard('205');

      expect(board.tasks).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Не удалось загрузить'));
    });

    it('хранит доски разных пользователей независимо', async () => {
      storage.loadState.mockResolvedValue(null);

      const first = await getBoard('206');
      const second = await getBoard('207');
      first.addTask(new Task(first.getNextId(), 'Только у первого'));

      expect(second.tasks).toEqual([]);
      expect(first.tasks).toHaveLength(1);
    });

    it('отклоняет некорректный ID', async () => {
      await expect(getBoard('../etc')).rejects.toThrow('Некорректный ID пользователя');
    });
  });

  describe('saveBoard', () => {
    it('сохраняет доску в файл пользователя', async () => {
      const board = new Board();
      board.addTask(new Task('1', 'Задача'));

      await saveBoard('301', board);

      expect(storage.saveState).toHaveBeenCalledWith('boards/301.json', board);
    });

    it('обновляет кэш после сохранения', async () => {
      const board = new Board();

      await saveBoard('302', board);

      expect(await getBoard('302')).toBe(board);
      expect(storage.loadState).not.toHaveBeenCalled();
    });

    it('отклоняет некорректный ID', async () => {
      await expect(saveBoard('user/1', new Board())).rejects.toThrow('Некорректный ID пользователя');
    });
  });
});
