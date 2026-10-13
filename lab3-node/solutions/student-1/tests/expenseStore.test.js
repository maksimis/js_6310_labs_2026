import { describe, expect, test } from '@jest/globals';
import {
  DEFAULT_CATEGORIES,
  addCategory,
  addExpense,
  clearSessions,
  deleteExpense,
  getCurrentMonthExpenses,
  getSession
} from '../src/services/expenseStore.js';

describe('expense store', () => {
  test('creates an independent default session for each chat', () => {
    clearSessions();
    const first = getSession(1);
    const second = getSession(2);

    expect(first.categories).toEqual(DEFAULT_CATEGORIES);
    expect(second).not.toBe(first);
    expect(second.expenses).toEqual([]);
  });

  test('adds only unique normalized categories', () => {
    clearSessions();
    const session = getSession(1);

    expect(addCategory(session, ' Кофе ')).toBe(true);
    expect(addCategory(session, 'кофе')).toBe(false);
    expect(session.categories).toContain('кофе');
  });

  test('returns expenses only from the selected month', () => {
    clearSessions();
    const session = getSession(1);
    addExpense(session, 100, 'продукты', new Date(2026, 9, 2));
    addExpense(session, 300, 'транспорт', new Date(2026, 8, 30));

    expect(getCurrentMonthExpenses(session, new Date(2026, 9, 10))).toHaveLength(1);
  });

  test('assigns an identifier and deletes an expense by it', () => {
    clearSessions();
    const session = getSession(1);
    const expense = addExpense(session, 100, 'продукты');

    expect(expense.id).toBe(1);
    expect(deleteExpense(session, 1)).toEqual(expense);
    expect(deleteExpense(session, 1)).toBeNull();
  });
});
