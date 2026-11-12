
import { beforeEach, expect, test } from '@jest/globals';
import {
  addTask,
  clearTasks,
  completeTask,
  deleteTask,
  getNextReminder,
  getTask,
  getTasks,
  updateTask,
} from '../src/utils/taskStore.js';

beforeEach(() => {
  clearTasks();
});

function futureDate(minutes = 1) {
  return new Date(Date.now() + minutes * 60_000);
}

test('Задачи хранятся отдельно для каждого пользователя', () => {
  const task = addTask(1, {
    title: 'Прочитать книгу',
    reminderAt: futureDate(),
  });

  addTask(2, {
    title: 'Прогуляться',
    reminderAt: futureDate(),
  });

  expect(getTasks(1)).toHaveLength(1);
  expect(getTasks(2)).toHaveLength(1);
  expect(getTask(1, task.id).title).toBe('Прочитать книгу');
  expect(getTask(2, task.id)).toBeNull();
});

test('Некорректные данные задачи отклоняются', () => {
  expect(() => addTask(1, {
    title: ' ',
    reminderAt: futureDate(),
  })).toThrow(TypeError);

  expect(() => addTask(1, {
    title: 'Задача',
    reminderAt: 'завтра',
  })).toThrow(TypeError);

  expect(() => addTask(1, {
    title: 'Задача',
    reminderAt: futureDate(),
    repeat: 'monthly',
  })).toThrow(TypeError);
});

test('Изменяются название, повтор и активность напоминания', () => {
  const task = addTask(1, {
    title: 'Старое название',
    reminderAt: futureDate(),
  });

  const updated = updateTask(1, task.id, {
    title: 'Новое название',
    repeat: 'daily',
    reminderEnabled: false,
  });

  expect(updated.title).toBe('Новое название');
  expect(updated.repeat).toBe('daily');
  expect(updated.reminderEnabled).toBe(false);

  expect(updateTask(1, 999, { repeat: 'none' })).toBeNull();

  expect(() => updateTask(1, task.id, {
    repeat: 'monthly',
  })).toThrow(TypeError);
});

test('Одноразовая задача отмечается выполненной', () => {
  const task = addTask(1, {
    title: 'Выполнить задание',
    reminderAt: futureDate(),
  });

  expect(completeTask(1, task.id).status).toBe('completed');
  expect(getTask(1, task.id).completed).toBe(true);
  expect(completeTask(1, 999).status).toBe('not_found');
});

test('Повторяющаяся задача получает следующее напоминание', () => {
  const task = addTask(1, {
    title: 'Ежедневная задача',
    reminderAt: new Date(Date.now() - 86_400_000),
    repeat: 'daily',
  });

  const result = completeTask(1, task.id);

  expect(result.status).toBe('rescheduled');
  expect(result.task.reminderAt.getTime()).toBeGreaterThan(Date.now());
  expect(result.task.completed).toBe(false);
});

test('Находится ближайшее активное напоминание', () => {
  const later = addTask(1, {
    title: 'Позднее напоминание',
    reminderAt: futureDate(2),
  });

  const earlier = addTask(1, {
    title: 'Раннее напоминание',
    reminderAt: futureDate(1),
  });

  expect(getNextReminder(1).id).toBe(earlier.id);

  updateTask(1, earlier.id, {
    reminderEnabled: false,
  });

  expect(getNextReminder(1).id).toBe(later.id);
});

test('Удаляется только задача указанного пользователя', () => {
  const task = addTask(1, {
    title: 'Удалить',
    reminderAt: futureDate(),
  });

  addTask(2, {
    title: 'Оставить',
    reminderAt: futureDate(),
  });

  expect(deleteTask(1, task.id).title).toBe('Удалить');
  expect(getTask(1, task.id)).toBeNull();
  expect(getTasks(2)).toHaveLength(1);
  expect(deleteTask(1, task.id)).toBeNull();
});
