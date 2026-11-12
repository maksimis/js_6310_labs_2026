import { addTask, completeTask, deleteTask, getNextReminder, getTask, getTasks, updateTask } from '../utils/taskStore.js';
import { formatDateTime, isSameLocalDay, parseLocalDateTime } from '../utils/dateUtils.js';

const sessions = new Map();
const repeatLabels = { none: 'без повтора', daily: 'ежедневно', weekly: 'еженедельно' };

function taskLine(task) {
  const status = task.completed ? '✅ выполнена' : '🕒 активна';
  const reminder = task.reminderEnabled ? 'включено' : 'отключено';
  return `#${task.id} — ${task.title}\n   Напоминание: ${formatDateTime(task.reminderAt)}\n   Повтор: ${repeatLabels[task.repeat]}\n   Статус: ${status}; уведомления: ${reminder}`;
}

function sessionFor(userId) {
  return sessions.get(String(userId));
}

function setSession(userId, session) {
  sessions.set(String(userId), session);
}

function clearSession(userId) {
  sessions.delete(String(userId));
}

export function resetSessions() {
  sessions.clear();
}

export async function handleMessage(bot, message) {
  const userId = message?.from?.id;
  const chatId = message?.chat?.id;
  const text = typeof message?.text === 'string' ? message.text.trim() : '';
  if (userId === undefined || chatId === undefined || !text) {
    return;
  }
  const reply = (content, options = {}) => bot.sendMessage(chatId, content, options);
  if (text === '/start' || text === '/help') {
    clearSession(userId);
    await reply('Привет! Я TaskBot — планировщик задач.\n/add_task — создать задачу\n/today — задачи на сегодня\n/reminders — настройки напоминаний\n/done ID — отметить задачу выполненной\n/delete ID — удалить задачу\n/cancel — отменить текущий ввод');
    return;
  }
  if (text === '/cancel') {
    clearSession(userId);
    await reply('Текущий ввод отменён.');
    return;
  }
  if (text === '/add_task') {
    setSession(userId, { step: 'title' });
    await reply('Введите название задачи (до 200 символов).');
    return;
  }
  if (text === '/today') {
    const today = getTasks(userId).filter((task) => isSameLocalDay(task.reminderAt, new Date()));
    await reply(today.length ? `Задачи на сегодня:\n\n${today.map(taskLine).join('\n\n')}\n\nЧтобы отметить разовую задачу: /done ID` : 'На сегодня задач нет.');
    return;
  }
  if (text === '/reminders') {
    const tasks = getTasks(userId).sort((a, b) => a.reminderAt - b.reminderAt);
    const next = getNextReminder(userId);
    const overview = next ? `Ближайшее напоминание: #${next.id} «${next.title}» — ${formatDateTime(next.reminderAt)}.` : 'Нет ближайших активных напоминаний.';
    const keyboard = tasks.map((task) => [{ text: `${task.reminderEnabled ? '🔔' : '🔕'} #${task.id} ${task.title}` }, { text: `Изменить #${task.id}` }, { text: `Повтор #${task.id}` }, { text: `${task.reminderEnabled ? 'Отключить' : 'Включить'} #${task.id}` }, { text: `Удалить #${task.id}` }]);
    await reply(`${overview}\n\n${tasks.length ? tasks.map(taskLine).join('\n\n') : 'Задач пока нет.'}\n\nКоманды: /reminder_edit ID, /reminder_repeat ID none|daily|weekly, /reminder_toggle ID, /done ID, /delete ID`, {
      reply_markup: tasks.length ? { keyboard, resize_keyboard: true, one_time_keyboard: false } : { remove_keyboard: true },
    });
    return;
  }
  const editCommand = /^\/reminder_edit\s+(\d+)$/i.exec(text);
  if (editCommand) {
    const task = getTask(userId, editCommand[1]);
    if (!task) {
      await reply('Задача с таким ID не найдена.');
      return;
    }
    setSession(userId, { step: 'edit_date', taskId: task.id });
    await reply(`Введите новую дату и время для «${task.title}» в формате ГГГГ-ММ-ДД ЧЧ:ММ.`);
    return;
  }
  const repeatCommand = /^\/reminder_repeat\s+(\d+)\s+(none|daily|weekly)$/i.exec(text);
  if (repeatCommand) {
    const task = updateTask(userId, repeatCommand[1], { repeat: repeatCommand[2].toLowerCase() });
    await reply(task ? `Повтор задачи #${task.id} изменён: ${repeatLabels[task.repeat]}.` : 'Задача с таким ID не найдена.');
    return;
  }
  const toggleCommand = /^\/reminder_toggle\s+(\d+)$/i.exec(text);
  if (toggleCommand) {
    const task = getTask(userId, toggleCommand[1]);
    if (!task) {
      await reply('Задача с таким ID не найдена.');
      return;
    }
    const updated = updateTask(userId, task.id, { reminderEnabled: !task.reminderEnabled });
    await reply(`Напоминания для задачи #${updated.id} ${updated.reminderEnabled ? 'включены' : 'отключены'}.`);
    return;
  }
  const deleteCommand = /^\/delete\s+(\d+)$/i.exec(text);
  if (deleteCommand) {
    const taskId = Number(deleteCommand[1]);
    const deleted = deleteTask(userId, taskId);
    if (!deleted) {
      await reply('Задача с таким ID не найдена. Посмотрите ID в /today или /reminders.');
      return;
    }
    const session = sessionFor(userId);
    if (session?.taskId === deleted.id) {
      clearSession(userId);
    }
    await reply(`Задача #${deleted.id} «${deleted.title}» удалена.`);
    return;
  }
  const doneCommand = /^\/done\s+(\d+)$/i.exec(text);
  if (doneCommand) {
    const result = completeTask(userId, doneCommand[1]);
    if (result.status === 'not_found') {
      await reply('Задача с таким ID не найдена. Посмотрите ID в /today или /reminders.');
    } else if (result.status === 'rescheduled') {
      await reply(`Задача #${result.task.id} отмечена выполненной за текущий период. Следующее напоминание: ${formatDateTime(result.task.reminderAt)}.\nПовтор: ${repeatLabels[result.task.repeat]}.`);
    } else {
      await reply(`Задача #${result.task.id} «${result.task.title}» отмечена как выполненная. Она останется в /reminders со статусом «выполнена».`);
    }
    return;
  }
  const session = sessionFor(userId);
  if (session) {
    if (session.step === 'title') {
      if (text.length > 200) {
        await reply('Название слишком длинное. Максимум 200 символов. Введите другое название.');
        return;
      }
      setSession(userId, { ...session, step: 'date', title: text });
      await reply('Введите дату и время напоминания в формате ГГГГ-ММ-ДД ЧЧ:ММ, например 2026-10-20 18:30.');
      return;
    }
    if (session.step === 'date' || session.step === 'edit_date') {
      const date = parseLocalDateTime(text);
      if (!date || date <= new Date()) {
        await reply('Дата некорректна или уже прошла. Введите будущую дату в формате ГГГГ-ММ-ДД ЧЧ:ММ.');
        return;
      }
      if (session.step === 'edit_date') {
        const task = updateTask(userId, session.taskId, { reminderAt: date });
        clearSession(userId);
        await reply(task ? `Дата напоминания задачи #${task.id} изменена на ${formatDateTime(task.reminderAt)}.` : 'Задача не найдена.');
        return;
      }
      setSession(userId, { ...session, step: 'repeat', reminderAt: date });
      await reply('Выберите повтор: none — без повтора, daily — ежедневно, weekly — еженедельно.');
      return;
    }
    if (session.step === 'repeat') {
      const repeat = text.toLowerCase();
      if (!Object.hasOwn(repeatLabels, repeat)) {
        await reply('Введите только none, daily или weekly.');
        return;
      }
      const task = addTask(userId, { title: session.title, reminderAt: session.reminderAt, repeat });
      clearSession(userId);
      await reply(`Задача создана!\n${taskLine(task)}`);
      return;
    }
  }
  const buttonAction = /^(Изменить|Повтор|Отключить|Включить|Удалить)\s+#?(\d+)$/i.exec(text);
  if (buttonAction) {
    const [, action, id] = buttonAction;
    if (action.toLowerCase() === 'удалить') {
      await handleMessage(bot, { ...message, text: `/delete ${id}` });
    } else if (action.toLowerCase() === 'изменить') {
      await handleMessage(bot, { ...message, text: `/reminder_edit ${id}` });
    } else if (action.toLowerCase() === 'повтор') {
      await reply(`Чтобы изменить повтор задачи #${id}, отправьте: /reminder_repeat ${id} none, /reminder_repeat ${id} daily или /reminder_repeat ${id} weekly.`);
    } else {
      await handleMessage(bot, { ...message, text: `/reminder_toggle ${id}` });
    }
    return;
  }
  await reply('Не понял команду. Используйте /help.');
}
