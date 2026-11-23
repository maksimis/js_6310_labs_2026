import express from 'express';
import { ValidationError } from './knowledge.js';

export function createApp(knowledge) {
  const app = express();
  app.use(express.json({ limit: '32kb' }));

  app.post('/api/knowledge', (req, res) => {
    res.status(201).json(knowledge.add(req.body));
  });

  app.get('/api/search', (req, res) => {
    res.json(knowledge.search(req.query.query).map(({ id, title, relevance }) => ({
      id, title, relevance
    })));
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден.' });
  });

  // Четыре аргумента отличают обработчик ошибок Express от обычного middleware.
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Некорректный JSON.' });
    }
    if (error.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Слишком большой запрос.' });
    }
    return res.status(500).json({ error: 'Внутренняя ошибка сервера.' });
  });

  return app;
}
