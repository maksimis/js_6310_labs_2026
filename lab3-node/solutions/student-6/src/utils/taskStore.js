let nextId = 1;
const tasksByUser = new Map();

function userTasks(userId) {
  if (!tasksByUser.has(String(userId))) {
    tasksByUser.set(String(userId), []);
  }
  return tasksByUser.get(String(userId));
}

export function addTask(userId, { title, reminderAt, repeat = 'none' }) {
  if (typeof title !== 'string' || title.trim().length === 0 || title.trim().length > 200) {
    throw new TypeError('Название задачи должно содержать от 1 до 200 символов.');
  }
  if (!(reminderAt instanceof Date) || Number.isNaN(reminderAt.getTime())) {
    throw new TypeError('Некорректная дата напоминания.');
  }
  if (!['none', 'daily', 'weekly'].includes(repeat)) {
    throw new TypeError('Повтор должен быть none, daily или weekly.');
  }
  const task = {
    id: nextId++,
    userId: String(userId),
    title: title.trim(),
    reminderAt: new Date(reminderAt.getTime()),
    repeat,
    completed: false,
    reminderEnabled: true,
    createdAt: new Date(),
  };
  userTasks(userId).push(task);
  return task;
}

export function getKnownUserIds() {
  return [...tasksByUser.keys()];
}

export function getTasks(userId) {
  return userTasks(userId).map((task) => ({ ...task, reminderAt: new Date(task.reminderAt), createdAt: new Date(task.createdAt) }));
}

export function getTask(userId, taskId) {
  const task = userTasks(userId).find((item) => item.id === Number(taskId));
  return task ? { ...task, reminderAt: new Date(task.reminderAt), createdAt: new Date(task.createdAt) } : null;
}

export function updateTask(userId, taskId, changes) {
  const task = userTasks(userId).find((item) => item.id === Number(taskId));
  if (!task) {
    return null;
  }
  if (Object.hasOwn(changes, 'reminderAt')) {
    if (!(changes.reminderAt instanceof Date) || Number.isNaN(changes.reminderAt.getTime())) {
      throw new TypeError('Некорректная дата напоминания.');
    }
    task.reminderAt = new Date(changes.reminderAt);
  }
  if (Object.hasOwn(changes, 'repeat')) {
    if (!['none', 'daily', 'weekly'].includes(changes.repeat)) {
      throw new TypeError('Недопустимый режим повтора.');
    }
    task.repeat = changes.repeat;
  }
  if (Object.hasOwn(changes, 'reminderEnabled')) {
    task.reminderEnabled = Boolean(changes.reminderEnabled);
  }
  if (Object.hasOwn(changes, 'title')) {
    if (typeof changes.title !== 'string' || !changes.title.trim() || changes.title.trim().length > 200) {
      throw new TypeError('Название задачи должно содержать от 1 до 200 символов.');
    }
    task.title = changes.title.trim();
  }
  return { ...task, reminderAt: new Date(task.reminderAt), createdAt: new Date(task.createdAt) };
}

export function deleteTask(userId, taskId) {
  const tasks = userTasks(userId);
  const index = tasks.findIndex((item) => item.id === Number(taskId));
  if (index === -1) {
    return null;
  }
  const [deleted] = tasks.splice(index, 1);
  return { ...deleted, reminderAt: new Date(deleted.reminderAt), createdAt: new Date(deleted.createdAt) };
}

export function completeTask(userId, taskId) {
  const task = userTasks(userId).find((item) => item.id === Number(taskId));
  if (!task) {
    return { status: 'not_found', task: null };
  }
  if (task.repeat !== 'none') {
    const previous = new Date(task.reminderAt);
    do {
      previous.setDate(previous.getDate() + (task.repeat === 'daily' ? 1 : 7));
    } while (previous <= new Date());
    task.reminderAt = previous;
    task.completed = false;
    return { status: 'rescheduled', task: { ...task, reminderAt: new Date(task.reminderAt), createdAt: new Date(task.createdAt) } };
  }
  task.completed = true;
  return { status: 'completed', task: { ...task, reminderAt: new Date(task.reminderAt), createdAt: new Date(task.createdAt) } };
}

export function getNextReminder(userId) {
  const task = userTasks(userId)
    .filter((item) => item.reminderEnabled && !item.completed && item.reminderAt >= new Date())
    .sort((a, b) => a.reminderAt - b.reminderAt)[0];
  return task ? { ...task, reminderAt: new Date(task.reminderAt), createdAt: new Date(task.createdAt) } : null;
}

export function clearTasks() {
  tasksByUser.clear();
  nextId = 1;
}
