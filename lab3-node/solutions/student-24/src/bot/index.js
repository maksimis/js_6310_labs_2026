// src/bot/index.js
import dotenv from 'dotenv';
dotenv.config();

import { Telegraf, Markup } from 'telegraf';
import { Task } from '../core/models.js';
import { FSM, USER_STATES } from '../core/fsm.js';
import { getBoard, saveBoard } from '../core/boardStore.js';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const fsm = new FSM();

const TARGET_STATUSES = {
  'in_progress': 'In Progress',
  'done': 'Done'
};

function getUserId(ctx) {
  return String(ctx.from?.id ?? ctx.chat?.id);
}

bot.start(async (ctx) => {
  const userId = getUserId(ctx);
  fsm.clearState(userId);
  await ctx.reply('Привет! Я KanbanBot 🤖\nИспользуй /help для списка команд.');
});

bot.help(async (ctx) => {
  const helpText = `
📋 *Команды бота:*
/board - Показать текущее состояние доски
/task - Добавить новую задачу
/move - Перемещать задачу между колонками
  `;
  await ctx.reply(helpText);
});

bot.command('board', async (ctx) => {
  const userId = getUserId(ctx);
  fsm.clearState(userId);

  try {
    const board = await getBoard(userId);
    await ctx.reply(board.getBoardState());
  } catch (error) {
    await ctx.reply(`❌ Ошибка: ${error.message}`);
  }
});

bot.command('task', async (ctx) => {
  const userId = getUserId(ctx);
  fsm.setState(userId, USER_STATES.WAITING_TASK_NAME);
  await ctx.reply('✍️ Введите название новой задачи (одним сообщением):');
});

bot.command('move', async (ctx) => {
  const userId = getUserId(ctx);
  fsm.setState(userId, USER_STATES.WAITING_MOVE_ID);
  await ctx.reply('🔀 Введите ID задачи, которую нужно переместить:');
});

bot.on('text', async (ctx) => {
  const userId = getUserId(ctx);
  const state = fsm.getState(userId);
  const text = ctx.message.text.trim();

  if (state === USER_STATES.IDLE) return;

  try {
    if (state === USER_STATES.WAITING_TASK_NAME) {
      if (!text) {
        await ctx.reply('❌ Название задачи не может быть пустым. Введите название ещё раз:');
        return;
      }

      const board = await getBoard(userId);
      const task = new Task(board.getNextId(), text);
      board.addTask(task);
      await saveBoard(userId, board);

      fsm.clearState(userId);
      await ctx.reply(`✅ Задача "${text}" (ID: ${task.id}) успешно добавлена в колонку "To Do".`);
    }
    else if (state === USER_STATES.WAITING_MOVE_ID) {
      const board = await getBoard(userId);
      const task = board.findTaskById(text);

      if (!task) {
        await ctx.reply('❌ Задача с таким ID не найдена. Попробуйте ввести ID снова.');
        return;
      }

      fsm.setState(userId, USER_STATES.WAITING_MOVE_TARGET);

      const keyboard = Markup.inlineKeyboard([
        [
          Markup.button.callback('🚧 In Progress', `move:${task.id}:in_progress`),
          Markup.button.callback('✅ Done', `move:${task.id}:done`)
        ]
      ]);

      await ctx.reply(
        `Задача "${task.title}" найдена.\nКуда переместить? Выберите колонку:`,
        keyboard
      );
    }
  } catch (error) {
    await ctx.reply(`❌ Ошибка: ${error.message}`);
    fsm.clearState(userId);
  }
});

bot.action(/^move:(\d+):(in_progress|done)$/, async (ctx) => {
  const userId = getUserId(ctx);
  const state = fsm.getState(userId);

  if (state !== USER_STATES.WAITING_MOVE_TARGET) {
    await ctx.answerCbQuery('⏳ Время ожидания истекло или действие неактуально.');
    return;
  }

  const [, taskId, targetKey] = ctx.match;
  const targetStatus = TARGET_STATUSES[targetKey];

  if (!targetStatus) {
    await ctx.answerCbQuery('❌ Неизвестная колонка.');
    return;
  }

  try {
    const board = await getBoard(userId);
    const movedTask = board.moveTask(taskId, targetStatus);
    await saveBoard(userId, board);

    fsm.clearState(userId);

    await ctx.answerCbQuery('✅ Успешно!');

    await ctx.reply(
      `✅ Задача "${movedTask.title}" перемещена в "${targetStatus}".\n` +
      `📊 Всего шагов от создания: ${movedTask.getSteps()}.`
    );
  } catch (error) {
    await ctx.answerCbQuery('❌ Ошибка!');
    await ctx.reply(`❌ Ошибка при перемещении: ${error.message}`);
    fsm.clearState(userId);
  }
});

export { bot };
