import { describe, test, expect } from '@jest/globals';
import {
  validateName,
  parseIngredients,
  parseSteps,
  parseIndex,
} from '../src/utils/index.js';

describe('validateName', () => {
  test('принимает нормальное название', () => {
    expect(validateName('  Борщ ')).toEqual({ ok: true, value: 'Борщ' });
  });

  test('отклоняет пустое название', () => {
    expect(validateName('   ').ok).toBe(false);
  });

  test('отклоняет слишком длинное название', () => {
    expect(validateName('а'.repeat(51)).ok).toBe(false);
  });
});

describe('parseIngredients', () => {
  test('разбирает строки с единицами и без', () => {
    const result = parseIngredients('Молоко - 200 мл\nяйца - 3');
    expect(result).toEqual({
      ok: true,
      value: [
        { name: 'молоко', amount: 200, unit: 'мл' },
        { name: 'яйца', amount: 3, unit: 'шт' },
      ],
    });
  });

  test('поддерживает дробное число через запятую', () => {
    expect(parseIngredients('мука - 0,5 кг').value[0].amount).toBe(0.5);
  });

  test('поддерживает дефис в названии', () => {
    expect(parseIngredients('кофе-гляссе - 2 г').value[0].name).toBe('кофе-гляссе');
  });

  test('отклоняет пустой ввод', () => {
    expect(parseIngredients(' \n ').ok).toBe(false);
  });

  test('отклоняет строку неверного формата и называет её номер', () => {
    const result = parseIngredients('молоко - 200 мл\nмусор');
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Строка 2');
  });

  test('отклоняет нулевое и слишком большое количество', () => {
    expect(parseIngredients('соль - 0 г').ok).toBe(false);
    expect(parseIngredients('соль - 999999 г').ok).toBe(false);
  });

  test('отклоняет слишком много ингредиентов', () => {
    const text = Array.from({ length: 31 }, (_, i) => `продукт${i} - 1 шт`).join('\n');
    expect(parseIngredients(text).ok).toBe(false);
  });
});

describe('parseSteps', () => {
  test('разбирает шаги по строкам', () => {
    expect(parseSteps('Нарезать\n\nЖарить').value).toEqual(['Нарезать', 'Жарить']);
  });

  test('отклоняет пустой ввод', () => {
    expect(parseSteps('  ').ok).toBe(false);
  });

  test('отклоняет слишком много шагов', () => {
    expect(parseSteps(Array(21).fill('шаг').join('\n')).ok).toBe(false);
  });

  test('отклоняет слишком длинный шаг', () => {
    expect(parseSteps('а'.repeat(201)).ok).toBe(false);
  });
});

describe('parseIndex', () => {
  test('возвращает число в диапазоне', () => {
    expect(parseIndex('2', 3)).toBe(2);
  });

  test('игнорирует пробелы вокруг числа', () => {
    expect(parseIndex(' 2 ', 3)).toBe(2);
  });

  test('возвращает null для нечисла, нуля и выхода за диапазон', () => {
    expect(parseIndex('abc', 3)).toBeNull();
    expect(parseIndex('0', 3)).toBeNull();
    expect(parseIndex('4', 3)).toBeNull();
    expect(parseIndex('-1', 3)).toBeNull();
  });
});