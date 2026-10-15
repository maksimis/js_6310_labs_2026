// src/api/index.js
import express from 'express';
import { Board, Task } from '../core/models.js';
import { loadState, saveState } from '../utils/storage.js';

const router = express.Router();
let board = new Board();

// Функция инициализации доски 
export async function initApiBoard() {
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
    console.log('✅ API: Состояние доски загружено из JSON.');
  } else {
    console.log('️ API: Создана новая доска.');
  }
}

// GET /api/board - Получить состояние доски
router.get('/board', (req, res) => {
  try {
    const state = board.getBoardState();
    res.json({
      success: true,
      data: state
    });
  } catch{
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// POST /api/task - Создать задачу
router.post('/task', (req, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Поле "title" обязательно и должно быть строкой'
      });
    }

    const id = Date.now().toString().slice(-4);
    const task = new Task(id, title.trim());
    board.addTask(task);
    saveState('board.json', board);

    res.status(201).json({
      success: true,
      data: {
        id: task.id,
        title: task.title,
        status: task.status
      }
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// POST /api/move - Переместить задачу
router.post('/move', (req, res) => {
  try {
    const { taskId, targetStatus } = req.body;

    // Валидация
    if (!taskId || typeof taskId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Поле "taskId" обязательно и должно быть строкой'
      });
    }

    if (!targetStatus || !['In Progress', 'Done'].includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Поле "targetStatus" обязательно и должно быть "In Progress" или "Done"'
      });
    }

    const movedTask = board.moveTask(taskId, targetStatus);
    saveState('board.json', board);

    res.json({
      success: true,
      data: {
        id: movedTask.id,
        title: movedTask.title,
        status: movedTask.status,
        steps: movedTask.getSteps()
      }
    });
  } catch (error) {
    // Обработка ошибок из ядра (WIP лимит, задача не найдена и т.д.)
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/tasks - Получить все задачи (дополнительный эндпоинт для удобства)
router.get('/tasks', (req, res) => {
  try {
    const tasks = board.tasks.map(t => ({
      id: t.id,
      title: t.title,
      status: t.status,
      steps: t.getSteps(),
      createdAt: t.createdAt
    }));

    res.json({
      success: true,
      data: tasks
    });
  } catch  {
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

export { router, board };