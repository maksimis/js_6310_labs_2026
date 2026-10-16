import express from 'express';
import { createSurvey, getResults } from './surveyService.js';

const app = express();
app.use(express.json());

app.post('/api/surveys', (req, res) => {
  const { topic, questions } = req.body;

  if (!topic || typeof topic !== 'string' || topic.trim() === '') {
    return res.status(400).json({ error: 'Тема обязательна и должна быть строкой' });
  }
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'Вопросы обязательны и должны быть массивом' });
  }
  for (const q of questions) {
    if (!q.question || !Array.isArray(q.options) || q.options.length < 2) {
      return res.status(400).json({ error: 'Каждый вопрос должен иметь текст и минимум 2 варианта' });
    }
  }

  const { id, code } = createSurvey(topic, questions);
  res.status(201).json({ id, code });
});

app.get('/api/surveys/:id/results', (req, res) => {
  const { id } = req.params;
  const results = getResults(id);

  if (!results) {
    return res.status(404).json({ error: 'Опрос не найден' });
  }

  res.json(results);
});

export default app;

export const startApi = (port = 3000) => {
  return app.listen(port, () => {
    console.log(`API сервер запущен на порту ${port}`);
  });
};