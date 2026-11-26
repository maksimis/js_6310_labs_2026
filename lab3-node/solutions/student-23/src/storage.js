const tasks = new Map();
const stats = new Map();

export function saveTask(task) {
  tasks.set(task.id, task);
  return task;
}

export function getTask(id) {
  return tasks.get(id);
}

export function clearTasks() {
  tasks.clear();
}

export function updateStats(userId, correct) {
  const current = stats.get(String(userId)) || { total: 0, correct: 0 };
  current.total += 1;
  if (correct) current.correct += 1;
  stats.set(String(userId), current);
  return current;
}

export function getStats(userId) {
  return stats.get(String(userId)) || { total: 0, correct: 0 };
}

export function clearStats() {
  stats.clear();
}