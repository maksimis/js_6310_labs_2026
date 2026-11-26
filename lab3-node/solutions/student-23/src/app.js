import express from 'express';
import { generateTask, checkAnswer } from './tasks.js';
import { validateGenerate, validateCheck } from './validator.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.post('/api/tasks/generate', (req, res) => {
    const validation = validateGenerate(req.body);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }
    try {
      const task = generateTask(req.body.topic, req.body.type);
      res.json(task);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/tasks/check', (req, res) => {
    const validation = validateCheck(req.body);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }
    try {
      const result = checkAnswer(req.body.taskId, req.body.answer);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.use((err, _req, res, _next) => {
    if (err && err.type === 'entity.parse.failed') {
      res.status(400).json({ error: 'Некорректный JSON' });
      return;
    }
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  });

  return app;
}