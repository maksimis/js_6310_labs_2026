import express from 'express';
import { createSurvey, getResults } from './surveyService.js';

const app = express();

app.use(express.json());

app.post('/api/surveys', (req, res) => {
  const { topic, questions } = req.body ?? {};

  if (typeof topic !== 'string' || topic.trim() === '') {
    return res.status(400).json({
      error: 'Тема обязательна и должна быть строкой'
    });
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({
      error: 'Вопросы обязательны и должны быть массивом'
    });
  }

  for (const q of questions) {
    if (
      !q ||
        typeof q !== 'object' ||
        Array.isArray(q) ||
        typeof q.question !== 'string' ||
        q.question.trim() === '' ||
        !Array.isArray(q.options) ||
        q.options.length < 2 ||
        q.options.some(
          (option) =>
            typeof option !== 'string' ||
                option.trim() === ''
        )
    ) {
      return res.status(400).json({
        error: 'Каждый вопрос должен иметь текст и минимум 2 непустых варианта'
      });
    }
  }

  const normalizedQuestions = questions.map((q) => ({
    question: q.question.trim(),
    options: q.options.map((option) => option.trim())
  }));

  const { id, code } = createSurvey(
    topic.trim(),
    normalizedQuestions
  );

  return res.status(201).json({ id, code });
});

app.get('/api/surveys/:id/results', (req, res) => {
  const results = getResults(req.params.id);

  if (!results) {
    return res.status(404).json({
      error: 'Опрос не найден'
    });
  }

  return res.json(results);
});

export default app;

export const startApi = (port = 3000) => {
  return app.listen(port, () => {
    console.log(`API сервер запущен на порту ${port}`);
  });
};