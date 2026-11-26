import { expect, test } from '@jest/globals';
import { handleMessage, resetSessions } from '../src/handlers/messageHandler.js';
import { clearTasks, getTask, getTasks } from '../src/utils/taskStore.js';

function setup() {
  clearTasks();
  resetSessions();
  const sent = [];
  const bot = { sendMessage: async (chatId, text, options) => { sent.push({ chatId, text, options }); return {}; } };
  const send = (userId, text) => handleMessage(bot, { from: { id: userId }, chat: { id: userId + 100 }, text });
  return { sent, send };
}

test('Пошаговое создание задачи работает, а сеансы пользователей независимы', async () => {
  const { send, sent } = setup();
  await send(1, '/add_task');
  await send(2, '/add_task');
  await send(1, 'Read book');
  await send(2, 'Walk');
  await send(1, '2099-10-20 18:30');
  await send(2, '2099-10-21 08:00');
  await send(1, 'daily');
  await send(2, 'none');
  expect(getTasks(1)[0].title).toBe('Read book');
  expect(getTasks(1)[0].repeat).toBe('daily');
  expect(getTasks(2)[0].title).toBe('Walk');
  expect(sent.some((item) => item.text.includes('Задача создана'))).toBeTruthy();
});

test('Некорректная дата отклоняется без сбоя и потери состояния диалога', async () => {
  const { send, sent } = setup();
  await send(1, '/add_task');
  await send(1, 'Study');
  await send(1, 'not a date');
  expect(getTasks(1).length).toBe(0);
  expect(sent.at(-1).text.includes('Дата некорректна')).toBeTruthy();
});

test('Список напоминаний показывает повторение, а команда /done отмечает задачу выполненной', async () => {
  const { send, sent } = setup();
  await send(1, '/add_task');
  await send(1, 'Submit assignment');
  await send(1, '2099-10-20 18:30');
  await send(1, 'none');
  const taskId = getTasks(1)[0].id;
  await send(1, '/reminders');
  expect(sent.at(-1).text.includes('Повтор: без повтора')).toBeTruthy();
  await send(1, `/done ${taskId}`);
  expect(getTask(1, taskId).completed).toBe(true);
  await send(1, '/reminders');
  expect(sent.at(-1).text.includes('выполнена')).toBeTruthy();
});

test('Поддерживаются изменение повторения, отключение напоминания и изменение даты', async () => {
  const { send, sent } = setup();
  await send(1, '/add_task');
  await send(1, 'Workout');
  await send(1, '2099-10-20 18:30');
  await send(1, 'none');
  const id = getTasks(1)[0].id;
  await send(1, `/reminder_repeat ${id} weekly`);
  expect(getTask(1, id).repeat).toBe('weekly');
  await send(1, `/reminder_toggle ${id}`);
  expect(getTask(1, id).reminderEnabled).toBe(false);
  await send(1, `/reminder_edit ${id}`);
  await send(1, '2099-10-22 10:00');
  expect(getTask(1, id).reminderAt.getDate()).toBe(22);
  expect(sent.some((item) => item.text.includes('еженедельно'))).toBeTruthy();
});

test('Неизвестная задача и некорректная команда обрабатываются безопасно', async () => {
  const { send, sent } = setup();
  await send(1, '/done 100');
  await handleMessage({ sendMessage: async (chatId, text) => sent.push({ chatId, text }) }, { from: { id: 1 }, chat: { id: 101 }, text: '/reminder_repeat 100 monthly' });
  await handleMessage({ sendMessage: async () => {} }, { from: { id: 1 }, chat: { id: 101 }, text: '/today' });
  expect(sent.some((item) => item.text.includes('не найдена'))).toBeTruthy();
});


test('Команда /delete удаляет задачу и обрабатывает неизвестный идентификатор', async () => {
  const { send, sent } = setup();
  await send(1, '/add_task');
  await send(1, 'Delete me');
  await send(1, '2099-10-20 18:30');
  await send(1, 'none');
  const id = getTasks(1)[0].id;
  await send(1, `/delete ${id}`);
  expect(getTask(1, id)).toBe(null);
  expect(sent.at(-1).text.includes('удалена')).toBeTruthy();
  await send(1, '/delete 999');
  expect(sent.at(-1).text.includes('не найдена')).toBeTruthy();
});

test('Задачи удаляются с помощью кнопки в списке напоминаний', async () => {
  const { send } = setup();
  await send(1, '/add_task');
  await send(1, 'Delete from menu');
  await send(1, '2099-10-20 18:30');
  await send(1, 'none');
  const id = getTasks(1)[0].id;
  await send(1, '/reminders');
  await send(1, `Удалить #${id}`);
  expect(getTask(1, id)).toBe(null);
});
