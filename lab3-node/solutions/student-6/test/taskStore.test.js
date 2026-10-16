import test from 'node:test';
import assert from 'node:assert/strict';
import { addTask, clearTasks, completeTask, deleteTask, getNextReminder, getTask, getTasks, updateTask } from '../src/utils/taskStore.js';

test.beforeEach(() => clearTasks());

const future = () => new Date(Date.now() + 60_000);

test('Задачи сохраняются отдельно для каждого пользователя', () => {
  const task = addTask(1, { title: 'Read', reminderAt: future() });
  addTask(2, { title: 'Walk', reminderAt: future() });
  assert.equal(getTasks(1).length, 1);
  assert.equal(getTasks(2).length, 1);
  assert.equal(getTask(1, task.id).title, 'Read');
  assert.equal(getTask(2, task.id), null);
});

test('Поля задачи проходят проверку корректности', () => {
  assert.throws(() => addTask(1, { title: ' ', reminderAt: future() }), TypeError);
  assert.throws(() => addTask(1, { title: 'x', reminderAt: 'tomorrow' }), TypeError);
  assert.throws(() => addTask(1, { title: 'x', reminderAt: future(), repeat: 'monthly' }), TypeError);
});

test('Обновляются напоминание, повторение, активность и название задачи', () => {
  const task = addTask(1, { title: 'Old', reminderAt: future() });
  const updated = updateTask(1, task.id, { title: 'New', repeat: 'daily', reminderEnabled: false });
  assert.equal(updated.title, 'New');
  assert.equal(updated.repeat, 'daily');
  assert.equal(updated.reminderEnabled, false);
  assert.equal(updateTask(1, 999, { repeat: 'none' }), null);
  assert.throws(() => updateTask(1, task.id, { repeat: 'monthly' }), TypeError);
});

test('Одноразовая задача отмечается выполненной, а её статус сохраняется', () => {
  const task = addTask(1, { title: 'Once', reminderAt: future() });
  assert.equal(completeTask(1, task.id).status, 'completed');
  assert.equal(getTask(1, task.id).completed, true);
  assert.equal(completeTask(1, 999).status, 'not_found');
});

test('При выполнении повторяющейся задачи назначается следующее напоминание', () => {
  const task = addTask(1, { title: 'Daily', reminderAt: new Date(Date.now() - 86_400_000), repeat: 'daily' });
  const result = completeTask(1, task.id);
  assert.equal(result.status, 'rescheduled');
  assert.ok(result.task.reminderAt > new Date());
  assert.equal(result.task.completed, false);
});

test('Возвращается ближайшее активное напоминание в будущем', () => {
  const later = addTask(1, { title: 'Later', reminderAt: new Date(Date.now() + 120_000) });
  const earlier = addTask(1, { title: 'Earlier', reminderAt: future() });
  assert.equal(getNextReminder(1).id, earlier.id);
  updateTask(1, earlier.id, { reminderEnabled: false });
  assert.equal(getNextReminder(1).id, later.id);
});


test('Удаляется только задача выбранного пользователя, а для отсутствующей задачи возвращается null', () => {
  const task = addTask(1, { title: 'Remove me', reminderAt: future() });
  addTask(2, { title: 'Keep me', reminderAt: future() });
  assert.equal(deleteTask(1, task.id).title, 'Remove me');
  assert.equal(getTask(1, task.id), null);
  assert.equal(getTasks(2).length, 1);
  assert.equal(deleteTask(1, task.id), null);
});
