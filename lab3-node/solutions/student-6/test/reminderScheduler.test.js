import test from 'node:test';
import assert from 'node:assert/strict';
import { startReminderLoop } from '../src/utils/reminderScheduler.js';
import { addTask, clearTasks, getTask } from '../src/utils/taskStore.js';

test.beforeEach(() => clearTasks());

test('Отправляется наступившее напоминание, после чего одноразовое напоминание отключается', async () => {
  const task = addTask(101, { title: 'Test reminder', reminderAt: new Date(Date.now() - 1000) });
  const messages = [];
  const stop = startReminderLoop({ sendMessage: async (chatId, message) => messages.push({ chatId, message }) }, 60_000);
  try {
    await new Promise((resolve) => setTimeout(resolve, 30));
    assert.equal(messages.length, 1);
    assert.equal(messages[0].chatId, '101');
    assert.match(messages[0].message, /Test reminder/);
    assert.equal(getTask(101, task.id).reminderEnabled, false);
  } finally {
    stop();
  }
});

test('При ошибке отправки напоминание не отмечается как доставленное', async () => {
  const task = addTask(202, { title: 'Retry reminder', reminderAt: new Date(Date.now() - 1000) });
  let attempts = 0;
  const stop = startReminderLoop({ sendMessage: async () => { attempts += 1; throw new Error('network error'); } }, 60_000);
  try {
    await new Promise((resolve) => setTimeout(resolve, 30));
    assert.equal(attempts, 1);
    assert.equal(getTask(202, task.id).reminderEnabled, true);
  } finally {
    stop();
  }
});
