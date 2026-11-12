import {
  describe,
  test,
  expect,
  beforeEach,
} from '@jest/globals';

import {
  addTransaction,
  getReport,
  clearTransactions,
} from '../src/services/transactionService.js';

const userId = '910022';

describe('transactionService', () => {
  beforeEach(() => {
    clearTransactions(userId);
  });

  test('добавляет транзакцию', () => {
    const result = addTransaction(userId, {
      date: '2026-10-16',
      category: 'Еда',
      amount: 500,
    });

    expect(result).toEqual({
      date: '2026-10-16',
      category: 'Еда',
      amount: 500,
    });
  });

  test('отклоняет отрицательную сумму', () => {
    expect(() => addTransaction(userId, {
      date: '2026-10-16',
      category: 'Еда',
      amount: -100,
    })).toThrow('Сумма должна быть положительным числом');
  });

  test('считает общую сумму и расходы по категориям', () => {
    addTransaction(userId, {
      date: '2026-10-10',
      category: 'Еда',
      amount: 500,
    });

    addTransaction(userId, {
      date: '2026-10-12',
      category: 'Транспорт',
      amount: 200,
    });

    addTransaction(userId, {
      date: '2026-10-15',
      category: 'Еда',
      amount: 300,
    });

    expect(
      getReport(userId, '2026-10-10', '2026-10-15'),
    ).toEqual({
      total: 1000,
      byCategory: {
        Еда: 800,
        Транспорт: 200,
      },
    });
  });

  test('отклоняет пустую дату', () => {
    expect(() => addTransaction(userId, {
      date: '',
      category: 'Еда',
      amount: 100,
    })).toThrow('Укажи дату транзакции');
  });

  test('отклоняет пустую категорию', () => {
    expect(() => addTransaction(userId, {
      date: '2026-10-16',
      category: ' ',
      amount: 100,
    })).toThrow('Укажи категорию транзакции');
  });

  test('отклоняет некорректный период отчёта', () => {
    expect(
      () => getReport(userId, '2026-10-31', '2026-10-01'),
    ).toThrow('Укажи корректный период');
  });
});