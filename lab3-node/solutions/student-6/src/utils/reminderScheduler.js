import { getKnownUserIds, getTasks, updateTask } from './taskStore.js';

export function startReminderLoop(bot, intervalMs = 15_000) {
  const sent = new Set();
  let checking = false;

  const checkReminders = async () => {
    if (checking) {
      return;
    }
    checking = true;
    try {
      const now = new Date();
      for (const userId of getKnownUserIds()) {
        for (const task of getTasks(userId)) {
          const key = `${userId}:${task.id}:${task.reminderAt.getTime()}`;
          if (!task.reminderEnabled || task.completed || task.reminderAt > now || sent.has(key)) {
            continue;
          }
          try {
            await bot.sendMessage(userId, `⏰ Напоминание: ${task.title} (#${task.id})`);
            sent.add(key);
            if (task.repeat !== 'none') {
              const next = new Date(task.reminderAt);
              next.setDate(next.getDate() + (task.repeat === 'daily' ? 1 : 7));
              while (next <= new Date()) {
                next.setDate(next.getDate() + (task.repeat === 'daily' ? 1 : 7));
              }
              updateTask(userId, task.id, { reminderAt: next });
            } else {
              updateTask(userId, task.id, { reminderEnabled: false });
            }
          } catch (error) {
            console.error('Reminder delivery failed:', error.message);
          }
        }
      }
    } finally {
      checking = false;
    }
  };

  // Check immediately, then continue checking on the configured interval.
  void checkReminders();
  const timer = setInterval(() => { void checkReminders(); }, intervalMs);
  return () => clearInterval(timer);
}

