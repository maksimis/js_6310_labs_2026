// src/bot/index.js
import dotenv from 'dotenv';
dotenv.config();

import { Telegraf, Markup } from 'telegraf'; // <-- Добавили Markup
import { Board, Task } from '../core/models.js';
import { FSM, USER_STATES } from '../core/fsm.js';
import { loadState, saveState } from '../utils/storage.js';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const fsm = new FSM();
const userContext = new Map();

let board = new Board();

async function initBoard() {
  const savedData = await loadState('board.json');
  if (savedData) {
    board = new Board();
    board.wipLimits = savedData.wipLimits;
    board.tasks = savedData.tasks.map(t => {
      const newTask = new Task(t.id, t.title);
      newTask.status = t.status;
      newTask.history = t.history;
      newTask.createdAt = t.createdAt;
      return newTask;
    });
    console.log('✅ Состояние доски успешно загружено из JSON.');
  } else {
    console.log('ℹ️ Сохраненное состояние не найдено. Создана новая доска.');
  }
}

bot.start(async (ctx) => {
  fsm.clearState(ctx.chat.id);
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
  fsm.clearState(ctx.chat.id);
  const stateText = board.getBoardState();
  await ctx.reply(stateText);
});

bot.command('task', async (ctx) => {
  fsm.setState(ctx.chat.id, USER_STATES.WAITING_TASK_NAME);
  await ctx.reply('✍️ Введите название новой задачи (одним сообщением):');
});

bot.command('move', async (ctx) => {
  fsm.setState(ctx.chat.id, USER_STATES.WAITING_MOVE_ID);
  await ctx.reply('🔀 Введите ID задачи, которую нужно переместить:');
});



bot.on('text', async (ctx) => {
  const state = fsm.getState(ctx.chat.id);
  const text = ctx.message.text.trim();
  const chatId = ctx.chat.id;

  if (state === USER_STATES.IDLE) return; 

  try {
    if (state === USER_STATES.WAITING_TASK_NAME) {
      const id = Date.now().toString().slice(-4);
      const task = new Task(id, text);
      board.addTask(task);
      await saveState('board.json', board);
      
      fsm.clearState(chatId);
      await ctx.reply(`✅ Задача "${text}" (ID: ${id}) успешно добавлена в колонку "To Do".`);
    } 
    else if (state === USER_STATES.WAITING_MOVE_ID) {
      const task = board.findTaskById(text);
      if (!task) {
        await ctx.reply('❌ Задача с таким ID не найдена. Попробуйте ввести ID снова.');
        return;
      }
      
      userContext.set(chatId, { taskId: text });
      fsm.setState(chatId, USER_STATES.WAITING_MOVE_TARGET);
      
    
      const keyboard = Markup.inlineKeyboard([
        [
          Markup.button.callback('🚧 In Progress', 'move:in_progress'),
          Markup.button.callback('✅ Done', 'move:done')
        ]
      ]);
      
      await ctx.reply(
        `Задача "${task.title}" найдена.\nКуда переместить? Выберите колонку:`, 
        keyboard
      );
    }
  } catch (error) {
    await ctx.reply(`❌ Ошибка: ${error.message}`);
    fsm.clearState(chatId);
    userContext.delete(chatId);
  }
});


bot.action(/move:(.+)/, async (ctx) => {
  const chatId = ctx.chat.id;
  const state = fsm.getState(chatId);
  
  if (state !== USER_STATES.WAITING_MOVE_TARGET) {
    await ctx.answerCbQuery('⏳ Время ожидания истекло или действие неактуально.');
    return;
  }

  const targetKey = ctx.match[1];
  const targetStatusMap = {
    'in_progress': 'In Progress',
    'done': 'Done'
  };
  const targetStatus = targetStatusMap[targetKey];

  if (!targetStatus) {
    await ctx.answerCbQuery('❌ Неизвестная колонка.');
    return;
  }

  try {
    const context = userContext.get(chatId);
    const movedTask = board.moveTask(context.taskId, targetStatus);
    await saveState('board.json', board);
    
    fsm.clearState(chatId);
    userContext.delete(chatId);
    
    await ctx.answerCbQuery('✅ Успешно!'); 
    
    await ctx.reply(
      `✅ Задача "${movedTask.title}" перемещена в "${targetStatus}".\n` +
      `📊 Всего шагов от создания: ${movedTask.getSteps()}.`
    );
  } catch (error) {
    await ctx.answerCbQuery('❌ Ошибка!');
    await ctx.reply(`❌ Ошибка при перемещении: ${error.message}`);
    fsm.clearState(chatId);
    userContext.delete(chatId);
  }
});

export { bot, initBoard };