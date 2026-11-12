// Хранилище целей в оперативной памяти: Map<userId, Array<Goal>>
const userGoals = new Map();

/**
 * Получить все цели пользователя
 */
export const getUserGoals = (userId) => {
  if (!userGoals.has(userId)) {
    userGoals.set(userId, []);
  }
  return userGoals.get(userId);
};

/**
 * Добавить новую цель пользователю
 */
export const addGoal = (userId, title, deadline) => {
  const goals = getUserGoals(userId);
  const newGoal = {
    id: goals.length + 1,
    title: title.trim(),
    deadline: deadline.trim(),
    keyResults: [],
  };
  goals.push(newGoal);
  return newGoal;
};

/**
 * Найти цель по ID
 */
export const getGoalById = (userId, goalId) => {
  const goals = getUserGoals(userId);
  return goals.find((g) => g.id === Number(goalId)) || null;
};

/**
 * Добавить ключевой результат к цели
 */
export const addKeyResult = (userId, goalId, title, target) => {
  const goal = getGoalById(userId, goalId);
  if (!goal) return null;

  const newKeyResult = {
    id: goal.keyResults.length + 1,
    title: title.trim(),
    target: Number(target),
    current: 0,
  };

  goal.keyResults.push(newKeyResult);
  return newKeyResult;
};

/**
 * Обновить фактическое значение ключевого результата
 */
export const updateProgress = (userId, goalId, krId, actualValue) => {
  const goal = getGoalById(userId, goalId);
  if (!goal) return null;

  const kr = goal.keyResults.find((k) => k.id === Number(krId));
  if (!kr) return null;

  kr.current = Number(actualValue);
  return kr;
};

/**
 * Прогресс одного ключевого результата в процентах (0..100)
 */
export const calculateKrProgress = (kr) => {
  if (!kr || kr.target <= 0) return 0;
  const ratio = Math.min(1, Math.max(0, kr.current / kr.target));
  return Math.round(ratio * 100);
};

/**
 * Прогресс цели в процентах (как средняя доля выполненных ключевых результатов)
 */
export const calculateGoalProgress = (goal) => {
  if (!goal || !goal.keyResults || goal.keyResults.length === 0) {
    return 0;
  }
  const total = goal.keyResults.reduce((sum, kr) => sum + calculateKrProgress(kr), 0);
  return Math.round(total / goal.keyResults.length);
};

/**
 * Общий прогресс по всем целям пользователя
 */
export const calculateOverallProgress = (userId) => {
  const goals = getUserGoals(userId);
  if (goals.length === 0) return 0;

  const total = goals.reduce((sum, goal) => sum + calculateGoalProgress(goal), 0);
  return Math.round(total / goals.length);
};

/**
 * Очистить цели (для тестов)
 */
export const clearAllGoals = () => {
  userGoals.clear();
};