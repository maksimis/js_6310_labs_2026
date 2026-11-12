import {
  addCategory,
  addExpense,
  deleteExpense,
  getCurrentMonthExpenses,
  getSession
} from '../services/expenseStore.js';

const formatMoney = (amount) => `${amount.toFixed(2)} ₽`;

const parseAmount = (text) => {
  const amount = Number(String(text).replace(',', '.'));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
};

const getChatId = (message) => message?.chat?.id ?? 'default';

const formatCategories = (session) => {
  const monthExpenses = getCurrentMonthExpenses(session);
  const totals = new Map(session.categories.map((category) => [category, 0]));
  monthExpenses.forEach((expense) => {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
  });
  return session.categories.map((category) => `• ${category}: ${formatMoney(totals.get(category))}`).join('\n');
};

const formatReport = (session) => {
  const expenses = getCurrentMonthExpenses(session);
  if (expenses.length === 0) {
    return 'За текущий месяц расходов пока нет.';
  }

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totals = new Map();
  expenses.forEach((expense) => {
    totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount);
  });
  const rows = [...totals.entries()].sort((left, right) => right[1] - left[1]);
  const details = rows.map(([category, amount]) =>
    `• ${category}: ${formatMoney(amount)} (${((amount / total) * 100).toFixed(1)}%)`
  );
  const top = rows.slice(0, 3).map(([category, amount], index) =>
    `${index + 1}. ${category} — ${formatMoney(amount)}`
  );
  return `Отчёт за текущий месяц\n\nВсего: ${formatMoney(total)}\n\nПо категориям:\n${details.join('\n')}\n\nТоп-3:\n${top.join('\n')}`;
};

const formatExpenses = (session) => {
  if (session.expenses.length === 0) {
    return 'Сохранённых расходов пока нет.';
  }
  const rows = session.expenses.map((expense) =>
    `${expense.id}. ${expense.category} — ${formatMoney(expense.amount)} (${expense.date.toLocaleDateString('ru-RU')})`
  );
  return `Сохранённые расходы:\n${rows.join('\n')}\n\nУдалить запись: /delete_expense <номер>`;
};

const parseDeleteCommand = (input) => {
  const match = input.match(/^\/delete_expense(?:\s+(\d+))?$/);
  return match ? Number(match[1]) : null;
};

const helpText = 'Доступные команды:\n/add_expense — добавить расход\n/expenses — список сохранённых расходов\n/delete_expense <номер> — удалить расход\n/categories — категории и суммы за месяц\n/add_category — добавить свою категорию\n/report — отчёт за текущий месяц\n/cancel — отменить текущий ввод';

const handleMessage = async (text, message, reply) => {
  const safeReply = typeof message === 'function' ? message : reply;
  const chatId = typeof message === 'function' ? 'default' : getChatId(message);
  const session = getSession(chatId);

  if (typeof safeReply !== 'function') {
    return;
  }
  if (!text || !String(text).trim()) {
    await safeReply('Отправьте текстовую команду или число.');
    return;
  }

  const input = String(text).trim();
  if (input === '/cancel') {
    session.state = 'IDLE';
    session.pendingAmount = null;
    await safeReply('Текущий ввод отменён.');
    return;
  }
  if (input === '/start') {
    session.state = 'IDLE';
    session.pendingAmount = null;
    await safeReply(`Привет! Я ExpenseBot.\n\n${helpText}`);
    return;
  }
  if (input === '/add_expense') {
    session.state = 'AWAITING_AMOUNT';
    await safeReply('Введите сумму расхода положительным числом, например: 250.50');
    return;
  }
  if (input === '/expenses') {
    session.state = 'IDLE';
    await safeReply(formatExpenses(session));
    return;
  }
  if (input.startsWith('/delete_expense')) {
    const expenseId = parseDeleteCommand(input);
    if (!expenseId) {
      await safeReply('Укажите номер записи: /delete_expense <номер>. Номера можно посмотреть в /expenses.');
      return;
    }
    const deletedExpense = deleteExpense(session, expenseId);
    if (!deletedExpense) {
      await safeReply(`Расход с номером ${expenseId} не найден. Откройте /expenses и повторите попытку.`);
      return;
    }
    session.state = 'IDLE';
    session.pendingAmount = null;
    await safeReply(`Расход №${expenseId} (${deletedExpense.category}, ${formatMoney(deletedExpense.amount)}) удалён.`);
    return;
  }
  if (input === '/categories') {
    session.state = 'IDLE';
    await safeReply(`Категории и расходы за текущий месяц:\n${formatCategories(session)}\n\nДобавить свою категорию: /add_category`);
    return;
  }
  if (input === '/add_category') {
    session.state = 'AWAITING_CATEGORY_NAME';
    await safeReply('Введите название новой категории.');
    return;
  }
  if (input === '/report') {
    session.state = 'IDLE';
    await safeReply(formatReport(session));
    return;
  }

  if (session.state === 'AWAITING_AMOUNT') {
    const amount = parseAmount(input);
    if (!amount) {
      await safeReply('Сумма должна быть положительным числом. Попробуйте ещё раз.');
      return;
    }
    session.pendingAmount = amount;
    session.state = 'AWAITING_EXPENSE_CATEGORY';
    await safeReply(`Выберите категорию: ${session.categories.join(', ')}.`);
    return;
  }
  if (session.state === 'AWAITING_EXPENSE_CATEGORY') {
    const category = input.toLowerCase();
    if (!session.categories.includes(category)) {
      await safeReply(`Такой категории нет. Выберите одну из: ${session.categories.join(', ')}.`);
      return;
    }
    addExpense(session, session.pendingAmount, category);
    await safeReply(`Расход ${formatMoney(session.pendingAmount)} в категории «${category}» добавлен.`);
    session.pendingAmount = null;
    session.state = 'IDLE';
    return;
  }
  if (session.state === 'AWAITING_CATEGORY_NAME') {
    if (input.length > 40) {
      await safeReply('Название категории должно быть не длиннее 40 символов.');
      return;
    }
    const added = addCategory(session, input);
    session.state = 'IDLE';
    await safeReply(added ? `Категория «${input.trim().toLowerCase()}» добавлена.` : 'Такая категория уже существует.');
    return;
  }

  await safeReply(`Неизвестная команда.\n\n${helpText}`);
};

export { formatCategories, formatExpenses, formatReport, parseAmount };
export default handleMessage;
