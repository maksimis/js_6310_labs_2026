export const DEFAULT_CATEGORIES = [
  'продукты',
  'транспорт',
  'развлечения',
  'жильё',
  'здоровье',
  'прочее'
];

const sessions = new Map();

const createSession = () => ({
  state: 'IDLE',
  pendingAmount: null,
  nextExpenseId: 1,
  categories: [...DEFAULT_CATEGORIES],
  expenses: []
});

export const getSession = (chatId) => {
  if (!sessions.has(chatId)) {
    sessions.set(chatId, createSession());
  }
  return sessions.get(chatId);
};

export const addExpense = (session, amount, category, date = new Date()) => {
  const expense = { id: session.nextExpenseId, amount, category, date };
  session.nextExpenseId += 1;
  session.expenses.push(expense);
  return expense;
};

export const deleteExpense = (session, expenseId) => {
  const expenseIndex = session.expenses.findIndex((expense) => expense.id === expenseId);
  if (expenseIndex === -1) {
    return null;
  }
  return session.expenses.splice(expenseIndex, 1)[0];
};

export const addCategory = (session, category) => {
  const normalized = category.trim().toLowerCase();
  if (session.categories.includes(normalized)) {
    return false;
  }
  session.categories.push(normalized);
  return true;
};

export const getCurrentMonthExpenses = (session, date = new Date()) => session.expenses.filter((expense) =>
  expense.date.getFullYear() === date.getFullYear() && expense.date.getMonth() === date.getMonth()
);

export const clearSessions = () => sessions.clear();
