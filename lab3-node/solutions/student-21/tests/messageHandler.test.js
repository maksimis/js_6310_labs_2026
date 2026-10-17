import handleMessage from '../src/handlers/messageHandler.js';
import { beforeEach, describe, test, expect, jest } from '@jest/globals';

describe('Message handler', () => {
  let reply;

  beforeEach(() => {
    reply = jest.fn();
  });

  test('shows FinanceBot commands on /start', async () => {
    await handleMessage('/start', reply);

    expect(reply).toHaveBeenCalledWith(
      'Привет! Я FinanceBot.\n'
      + 'Добавить расход: /add_transaction\n'
      + 'Отчёт: /report\n'
      + 'Отменить ввод: /cancel',
    );
  });

  test('ignores empty text', async () => {
    await handleMessage(undefined, reply);

    expect(reply).not.toHaveBeenCalled();
  });

  test('prompts to choose a command when no session exists', async () => {
    await handleMessage('hello', reply, 'test-user-no-session');

    expect(reply).toHaveBeenCalledWith(
      'Выбери команду /add_transaction или /report.',
    );
  });

  test('cancels the current session', async () => {
    await handleMessage('/add_transaction', reply, 'test-cancel');
    reply.mockClear();

    await handleMessage('/cancel', reply, 'test-cancel');

    expect(reply).toHaveBeenCalledWith('Ввод отменён.');
    reply.mockClear();

    await handleMessage('hello', reply, 'test-cancel');

    expect(reply).toHaveBeenCalledWith(
      'Выбери команду /add_transaction или /report.',
    );
  });

  test('validates date and advances to category', async () => {
    await handleMessage('/add_transaction', reply, 'test-date');
    reply.mockClear();

    await handleMessage('2026-02-30', reply, 'test-date');

    expect(reply).toHaveBeenCalledWith(
      'Некорректная дата. Пример: 2026-10-16.',
    );

    reply.mockClear();
    await handleMessage('2026-02-28', reply, 'test-date');

    expect(reply).toHaveBeenCalledWith(
      'Введи категорию расхода, например Еда.',
    );
  });

  test('validates category and amount, then saves a transaction', async () => {
    const userId = 'test-add-transaction';

    await handleMessage('/add_transaction', reply, userId);
    await handleMessage('2026-10-16', reply, userId);
    reply.mockClear();

    await handleMessage('   ', reply, userId);

    expect(reply).toHaveBeenCalledWith(
      'Категория не должна быть пустой. Попробуй ещё раз.',
    );

    reply.mockClear();
    await handleMessage('Еда', reply, userId);
    await handleMessage('-5', reply, userId);

    expect(reply).toHaveBeenCalledWith(
      'Сумма должна быть положительным числом. Попробуй ещё раз.',
    );

    reply.mockClear();
    await handleMessage('250,50', reply, userId);

    expect(reply).toHaveBeenCalledWith(
      'Расход сохранён: 2026-10-16, Еда, 250.5.',
    );
  });

  test('builds a report for a valid period', async () => {
    const userId = 'test-report';

    await handleMessage('/report', reply, userId);
    reply.mockClear();

    await handleMessage('2026-10-01', reply, userId);
    await handleMessage('2026-10-31', reply, userId);

    expect(reply).toHaveBeenCalledWith(
      expect.stringContaining('Отчёт за 2026-10-01 — 2026-10-31'),
    );
  });

  test('rejects report end date before start date', async () => {
    const userId = 'test-report-dates';

    await handleMessage('/report', reply, userId);
    await handleMessage('2026-10-20', reply, userId);
    reply.mockClear();

    await handleMessage('2026-10-01', reply, userId);

    expect(reply).toHaveBeenCalledWith(
      'Конец периода не может быть раньше начала. Введи дату ещё раз.',
    );
  });
});