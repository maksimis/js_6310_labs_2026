// src/api/index.js
import express from 'express';
import { Task } from '../core/models.js';
import { getBoard, saveBoard, isValidUserId } from '../core/boardStore.js';

const router = express.Router();

// Пользователь определяется заголовком X-User-Id: у каждого своя доска
router.use((req, res, next) => {
  const userId = req.get('x-user-id');

  if (!isValidUserId(userId)) {
    return res.status(400).json({
      success: false,
      error: 'Заголовок "X-User-Id" обязателен и должен содержать числовой ID пользователя'
    });
  }

  req.userId = String(userId);
  next();
});

// GET /api/board - Получить состояние доски пользователя
router.get('/board', async (req, res) => {
  try {
    const board = await getBoard(req.userId);
    res.json({
      success: true,
      data: board.getBoardState()
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// POST /api/task - Создать задачу
router.post('/task', async (req, res) => {
  const { title } = req.body || {};

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Поле "title" обязательно и должно быть строкой'
    });
  }

  let board;

  try {
    board = await getBoard(req.userId);
  } catch {
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }

  const task = new Task(board.getNextId(), title.trim());
  board.addTask(task);

  try {
    await saveBoard(req.userId, board);
  } catch {
    return res.status(500).json({
      success: false,
      error: 'Не удалось сохранить задачу'
    });
  }

  res.status(201).json({
    success: true,
    data: {
      id: task.id,
      title: task.title,
      status: task.status
    }
  });
});

// POST /api/move - Переместить задачу
router.post('/move', async (req, res) => {
  const { taskId, targetStatus } = req.body || {};

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

  let board;

  try {
    board = await getBoard(req.userId);
  } catch {
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }

  let movedTask;

  try {
    movedTask = board.moveTask(taskId, targetStatus);
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  try {
    await saveBoard(req.userId, board);
  } catch {
    return res.status(500).json({
      success: false,
      error: 'Не удалось сохранить перемещение'
    });
  }

  res.json({
    success: true,
    data: {
      id: movedTask.id,
      title: movedTask.title,
      status: movedTask.status,
      steps: movedTask.getSteps()
    }
  });
});

// GET /api/tasks - Получить все задачи пользователя
router.get('/tasks', async (req, res) => {
  let board;

  try {
    board = await getBoard(req.userId);
  } catch {
    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }

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
  } catch {
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

export { router };
