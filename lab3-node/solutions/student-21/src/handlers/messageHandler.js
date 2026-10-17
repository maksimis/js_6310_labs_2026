import {
  addTransaction,
  getReport,
} from '../services/transactionService.js';

const sessions = new Map();

const isValidDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(date.getTime())
    && date.toISOString().slice(0, 10) === value;
};

const handleMessage = async (text, reply, userId = 'default') => {
  if (!text) {
    return;
  }

  if (text === '/start') {
    await reply(
      'Привет! Я FinanceBot.\n'
      + 'Добавить расход: /add_transaction\n'
      + 'Отчёт: /report\n'
      + 'Отменить ввод: /cancel',
    );
    return;
  }

  if (text === '/cancel') {
    sessions.delete(userId);
    await reply('Ввод отменён.');
    return;
  }

  if (text === '/add_transaction') {
    sessions.set(userId, { step: 'date' });
    await reply('Введи дату расхода в формате ГГГГ-ММ-ДД.');
    return;
  }

  if (text === '/report') {
    sessions.set(userId, { step: 'reportFrom' });
    await reply('Введи начало периода в формате ГГГГ-ММ-ДД.');
    return;
  }

  const session = sessions.get(userId);

  if (!session) {
    await reply('Выбери команду /add_transaction или /report.');
    return;
  }

  if (session.step === 'date') {
    if (!isValidDate(text)) {
      await reply('Некорректная дата. Пример: 2026-10-16.');
      return;
    }

    session.date = text;
    session.step = 'category';
    await reply('Введи категорию расхода, например Еда.');
    return;
  }

  if (session.step === 'category') {
    if (!text.trim()) {
      await reply('Категория не должна быть пустой. Попробуй ещё раз.');
      return;
    }

    session.category = text.trim();
    session.step = 'amount';
    await reply('Введи сумму расхода числом, например 500.');
    return;
  }

  if (session.step === 'amount') {
    const amount = Number(text.replace(',', '.'));

    if (!Number.isFinite(amount) || amount <= 0) {
      await reply('Сумма должна быть положительным числом. Попробуй ещё раз.');
      return;
    }

    const saved = addTransaction(userId, {
      date: session.date,
      category: session.category,
      amount,
    });

    sessions.delete(userId);

    await reply(
      `Расход сохранён: ${saved.date}, ${saved.category}, ${saved.amount}.`,
    );
    return;
  }

  if (session.step === 'reportFrom') {
    if (!isValidDate(text)) {
      await reply('Некорректная дата. Пример: 2026-10-01.');
      return;
    }

    session.from = text;
    session.step = 'reportTo';
    await reply('Теперь введи конец периода в формате ГГГГ-ММ-ДД.');
    return;
  }

  if (session.step === 'reportTo') {
    if (!isValidDate(text)) {
      await reply('Некорректная дата. Пример: 2026-10-31.');
      return;
    }

    if (text < session.from) {
      await reply('Конец периода не может быть раньше начала. Введи дату ещё раз.');
      return;
    }

    const report = getReport(userId, session.from, text);
    sessions.delete(userId);

    const categories = Object.entries(report.byCategory);

    const categoryText = categories.length
      ? categories.map(([category, total]) => `${category}: ${total}`).join('\n')
      : 'Расходов за этот период нет.';

    await reply(
      `Отчёт за ${session.from} — ${text}\n`
      + `Всего: ${report.total}\n\n`
      + `По категориям:\n${categoryText}`,
    );
  }
};

export default handleMessage;