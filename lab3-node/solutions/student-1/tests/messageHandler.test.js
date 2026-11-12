import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import handleMessage, { parseAmount } from '../src/handlers/messageHandler.js';
import { clearSessions, getSession } from '../src/services/expenseStore.js';

const message = (chatId) => ({ chat: { id: chatId } });

describe('message handler', () => {
  beforeEach(() => clearSessions());

  test('shows help on start', async () => {
    const reply = jest.fn();
    await handleMessage('/start', message(1), reply);
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('/add_expense'));
  });

  test('validates amount and adds an expense step by step', async () => {
    const reply = jest.fn();
    await handleMessage('/add_expense', message(1), reply);
    await handleMessage('zero', message(1), reply);
    expect(reply).toHaveBeenLastCalledWith(expect.stringContaining('положительным'));

    await handleMessage('250,5', message(1), reply);
    await handleMessage('продукты', message(1), reply);
    expect(reply).toHaveBeenLastCalledWith(expect.stringContaining('250.50 ₽'));
    expect(getSession(1).expenses).toHaveLength(1);
  });

  test('keeps command states isolated between users', async () => {
    const firstReply = jest.fn();
    const secondReply = jest.fn();
    await handleMessage('/add_expense', message(1), firstReply);
    await handleMessage('100', message(1), firstReply);
    await handleMessage('/report', message(2), secondReply);

    expect(getSession(1).state).toBe('AWAITING_EXPENSE_CATEGORY');
    expect(secondReply).toHaveBeenLastCalledWith('За текущий месяц расходов пока нет.');
  });

  test('adds custom category and lists its amount', async () => {
    const reply = jest.fn();
    await handleMessage('/add_category', message(1), reply);
    await handleMessage('Кофе', message(1), reply);
    await handleMessage('/categories', message(1), reply);

    expect(reply).toHaveBeenLastCalledWith(expect.stringContaining('кофе: 0.00 ₽'));
  });

  test('creates a report with a total, shares and top categories', async () => {
    const reply = jest.fn();
    const session = getSession(1);
    session.expenses.push(
      { amount: 300, category: 'продукты', date: new Date() },
      { amount: 100, category: 'транспорт', date: new Date() }
    );
    await handleMessage('/report', message(1), reply);

    const report = reply.mock.calls.at(-1)[0];
    expect(report).toContain('Всего: 400.00 ₽');
    expect(report).toContain('75.0%');
    expect(report).toContain('Топ-3');
  });

  test('lists and deletes a saved expense by its number', async () => {
    const reply = jest.fn();
    const session = getSession(1);
    session.expenses.push({ id: 4, amount: 300, category: 'продукты', date: new Date() });

    await handleMessage('/expenses', message(1), reply);
    expect(reply).toHaveBeenLastCalledWith(expect.stringContaining('4. продукты — 300.00 ₽'));

    await handleMessage('/delete_expense 4', message(1), reply);
    expect(reply).toHaveBeenLastCalledWith(expect.stringContaining('Расход №4'));
    expect(session.expenses).toHaveLength(0);
  });

  test('validates a missing or unknown expense number', async () => {
    const reply = jest.fn();
    await handleMessage('/delete_expense', message(1), reply);
    expect(reply).toHaveBeenLastCalledWith(expect.stringContaining('Укажите номер'));

    await handleMessage('/delete_expense 99', message(1), reply);
    expect(reply).toHaveBeenLastCalledWith(expect.stringContaining('не найден'));
  });

  test('cancels a state and handles empty or unknown input', async () => {
    const reply = jest.fn();
    await handleMessage('/add_expense', message(1), reply);
    await handleMessage('/cancel', message(1), reply);
    await handleMessage('', message(1), reply);
    await handleMessage('hello', message(1), reply);

    expect(getSession(1).state).toBe('IDLE');
    expect(reply.mock.calls.at(-2)[0]).toContain('текстовую');
    expect(reply.mock.calls.at(-1)[0]).toContain('Неизвестная');
  });
});

describe('parseAmount', () => {
  test('accepts positive decimal values and rejects invalid values', () => {
    expect(parseAmount('2,75')).toBe(2.75);
    expect(parseAmount('0')).toBeNull();
    expect(parseAmount('-3')).toBeNull();
  });
});
