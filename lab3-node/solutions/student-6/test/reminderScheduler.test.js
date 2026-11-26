import { beforeEach, expect, jest, test } from '@jest/globals';
import { startReminderLoop } from '../src/utils/reminderScheduler.js';
import { addTask, clearTasks, getTask } from '../src/utils/taskStore.js';

beforeEach(() => clearTasks());

test('Отправляется наступившее напоминание, после чего одноразовое напоминание отключается', async () => {
  const task = addTask(101, {
    title: 'Test reminder',
    reminderAt: new Date(Date.now() - 1000),
  });

  const messages = [];
  const stop = startReminderLoop(
    {
      sendMessage: async (chatId, message) => {
        messages.push({ chatId, message });
      },
    },
    60_000,
  );

  try {
    await new Promise((resolve) => setTimeout(resolve, 30));

    expect(messages.length).toBe(1);
    expect(messages[0].chatId).toBe('101');
    expect(messages[0].message).toMatch(/Test reminder/);
    expect(getTask(101, task.id).reminderEnabled).toBe(false);
  } finally {
    stop();
  }
});

test('При ошибке отправки напоминание не отмечается как доставленное', async () => {
  const task = addTask(202, {
    title: 'Retry reminder',
    reminderAt: new Date(Date.now() - 1000),
  });

  const consoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  let attempts = 0;
  const stop = startReminderLoop(
    {
      sendMessage: async () => {
        attempts += 1;
        throw new Error('network error');
      },
    },
    60_000,
  );

  try {
    await new Promise((resolve) => setTimeout(resolve, 30));

    expect(attempts).toBe(1);
    expect(getTask(202, task.id).reminderEnabled).toBe(true);
  } finally {
    stop();
    consoleError.mockRestore();
  }
});