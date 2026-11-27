import { describe, test, expect, beforeEach } from '@jest/globals';
import { Sudoku } from '../src/game/Sudoku.js';

describe('Sudoku', () => {
  let game;
  beforeEach(() => {
    game = new Sudoku().generate('easy');
  });

  test('generates 9x9 solution and grid', () => {
    expect(game.solution).toHaveLength(9);
    expect(game.solution[0]).toHaveLength(9);
    expect(game.grid).toHaveLength(9);
  });

  test('creates expected number of empty cells (easy=40)', () => {
    expect(game.countEmpty()).toBe(40);
  });

  test('medium and hard have fewer empties', () => {
    const medium = new Sudoku().generate('medium');
    const hard = new Sudoku().generate('hard');
    expect(medium.countEmpty()).toBe(32);
    expect(hard.countEmpty()).toBe(26);
  });

  test('unknown difficulty falls back to easy', () => {
    const g = new Sudoku().generate('nonsense');
    expect(g.difficulty).toBe('easy');
  });

  test('setCell rejects out-of-range coordinates', () => {
    const res = game.setCell(99, 99, 5);
    expect(res.ok).toBe(false);
  });

  test('setCell rejects invalid value', () => {
    expect(game.setCell(0, 0, 0).ok).toBe(false);
    expect(game.setCell(0, 0, 10).ok).toBe(false);
    expect(game.setCell(0, 0, 'x').ok).toBe(false);
  });

  test('setCell rejects editing fixed cells', () => {
    // найдём фиксированную клетку
    let fr = -1;
    let fc = -1;
    for (let r = 0; r < 9 && fr < 0; r++) {
      for (let c = 0; c < 9; c++) {
        if (game.fixed[r][c]) { fr = r; fc = c; break; }
      }
    }
    const res = game.setCell(fr, fc, 1);
    expect(res.ok).toBe(false);
  });

  test('setCell accepts correct move', () => {
    // Найдём пустую клетку и поставим в неё правильное значение
    let placed = false;
    for (let r = 0; r < 9 && !placed; r++) {
      for (let c = 0; c < 9; c++) {
        if (game.grid[r][c] === 0) {
          const res = game.setCell(r, c, game.solution[r][c]);
          expect(res.ok).toBe(true);
          placed = true;
          break;
        }
      }
    }
    expect(placed).toBe(true);
  });

  test('setCell rejects conflicting value', () => {
    // Найдём пустую клетку и поставим заведомо неверное значение,
    // конфликтующее со строкой/столбцом/блоком.
    let done = false;
    for (let r = 0; r < 9 && !done; r++) {
      for (let c = 0; c < 9; c++) {
        if (game.grid[r][c] === 0) {
          // Найдём значение, которое уже есть в строке
          for (let cc = 0; cc < 9; cc++) {
            const v = game.grid[r][cc];
            if (v !== 0 && v !== game.solution[r][c]) {
              const res = game.setCell(r, c, v);
              expect(res.ok).toBe(false);
              done = true;
              break;
            }
          }
          if (done) break;
        }
      }
    }
    expect(done).toBe(true);
  });

  test('isComplete false on fresh game', () => {
    expect(game.isComplete()).toBe(false);
  });

  test('checkSolution reports errors on unsolved field', () => {
    const res = game.checkSolution();
    expect(res.solved).toBe(false);
    expect(res.errors.length).toBeGreaterThan(0);
  });

  test('checkSolution is solved after filling everything correctly', () => {
    // Заполним все пустые клетки правильными значениями
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (game.grid[r][c] === 0) {
          game.grid[r][c] = game.solution[r][c];
        }
      }
    }
    const res = game.checkSolution();
    expect(res.solved).toBe(true);
  });

  describe('getGridString', () => {
    let game;

    beforeEach(() => {
      game = new Sudoku().generate('easy');
    });

    test('renders header with column labels a..i', () => {
      const str = game.getGridString();
      // Буквы a..i должны присутствовать в шапке
      expect(str).toContain('a');
      expect(str).toContain('i');
    });

    test('uses double bar before row numbers', () => {
      const str = game.getGridString();
      // Двойная вертикальная черта ‖ отделяет номера строк
      expect(str).toContain('‖');
    });

    test('uses single bar between 3x3 blocks', () => {
      const str = game.getGridString();
      // Одиночная вертикальная черта │ отделяет блоки 3x3
      expect(str).toContain('│');
    });

    test('uses underscore for empty cells', () => {
      const str = game.getGridString();
      // В лёгкой партии 40 пустых клеток — подчёркивания должны быть
      expect(str).toContain('_');
    });

    test('does not use emoji squares', () => {
      const str = game.getGridString();
      // Старый вариант с ⬜ больше не используется
      expect(str).not.toContain('⬜');
    });

    test('contains horizontal dividers', () => {
      const str = game.getGridString();
      // Разделители блоков содержат эти символы
      expect(str).toContain('═');
      expect(str).toContain('─');
    });

    test('renders exactly 9 data rows', () => {
      const str = game.getGridString();
      const lines = str.split('\n');

      // Считаем строки, начинающиеся с цифры 1..9
      const dataRows = lines.filter((line) => /^[1-9]\s/.test(line));
      expect(dataRows).toHaveLength(9);
    });

    test('each data row has 9 cells (excluding separators)', () => {
      const str = game.getGridString();
      const lines = str.split('\n');

      const dataRows = lines.filter((line) => /^[1-9]\s/.test(line));
      for (const row of dataRows) {
      // Убираем номер строки, ‖ и │, потом считаем токены
        const cleaned = row.replace(/^[1-9]\s+‖\s/, '').replace(/[│]/g, '');
        const tokens = cleaned.trim().split(/\s+/);
        // Каждая клетка окружена пробелами → токенов должно быть 9
        // (т.к. pad добавляет ' ' вокруг значения, cell = " _ " → split даст ["_"])
        // На практике: проверим, что цифр/подчёркиваний ровно 9
        const cells = tokens.filter((t) => /^[1-9_]$/.test(t));
        expect(cells).toHaveLength(9);
      }
    });

    test('numeric values match grid', () => {
    // Проверим, что все непустые клетки поля отражены в строке
      const str = game.getGridString();
      let countInGrid = 0;
      let countInString = 0;

      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (game.grid[r][c] !== 0) countInGrid++;
        }
      }
      // Считаем цифры 1..9 в рендере (кроме номеров строк)
      const lines = str.split('\n').filter((line) => /^[1-9]\s/.test(line));
      for (const row of lines) {
        const digits = row.slice(row.indexOf('‖') + 1).match(/[1-9]/g);
        if (digits) countInString += digits.length;
      }

      expect(countInString).toBe(countInGrid);
    });
  });
});