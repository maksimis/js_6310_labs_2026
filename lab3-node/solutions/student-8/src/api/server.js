'use strict';

import express from 'express';
import dotenv from 'dotenv';
import { searchFragments, addFragment } from '../knowledge/knowledgeBase.js';

dotenv.config();

const app = express();

// Middleware для парсинга JSON в теле запроса
app.use(express.json());

// ===== GET /api/search?query=... =====
// Поиск фрагментов по запросу
app.get('/api/search', (req, res) => {
  try {
    const query = req.query.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        error: 'Параметр query обязателен и должен быть строкой'
      });
    }

    const results = searchFragments(query);

    // Возвращаем только { id, title, relevance } — как требует задание
    const response = results.map((item) => ({
      id: item.id,
      title: item.title,
      relevance: item.relevance
    }));

    return res.json(response);
  } catch (error) {
    console.error('Ошибка GET /api/search:', error.message);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// ===== POST /api/knowledge =====
// Добавление нового фрагмента
app.post('/api/knowledge', (req, res) => {
  try {
    const { title, content } = req.body || {};

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        error: 'Поле title обязательно и должно быть непустой строкой'
      });
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({
        error: 'Поле content обязательно и должно быть непустой строкой'
      });
    }

    const fragment = addFragment(title, content);

    return res.status(201).json({
      id: fragment.id,
      title: fragment.title
    });
  } catch (error) {
    console.error('Ошибка POST /api/knowledge:', error.message);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// ===== Обработка несуществующих путей =====
app.use((req, res) => {
  res.status(404).json({ error: 'Не найдено' });
});

// ===== Обработка общих ошибок =====
app.use((error, req, res, next) => {
  console.error('Ошибка API:', error.message);

  // Если ответ уже был отправлен — передаём управление дальше
  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// ===== Запуск сервера =====
const runApiServer = () => {
  const port = Number(process.env.PORT) || 3000;

  const server = app.listen(port, () => {
    console.log(`API-сервер запущен на http://localhost:${port}`);
  });

  return server;
};

export { app, runApiServer };
export default runApiServer;