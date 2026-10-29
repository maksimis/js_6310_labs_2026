'use strict';

import express from 'express';
import dotenv from 'dotenv';
import { getAllCards, addCard, getProgress } from '../cards/cardManager.js';

dotenv.config();
const app = express();
app.use(express.json());

app.get('/api/cards', (req, res) => {
  try {
    const cards = getAllCards();
    const progress = getProgress();
    res.json({ cards, progress });
  } catch (error) {
    console.error('Ошибка GET:', error.message);
    res.status(500).json({ error: 'Внутренняя ошибка' });
  }
});

app.post('/api/cards', (req, res) => {
  try {
    const { word, translation } = req.body || {};
    if (!word || !translation) {
      return res.status(400).json({ error: 'Нужны word и translation' });
    }
    const card = addCard(word, translation);
    res.status(201).json(card);
  } catch (error) {
    console.error('Ошибка POST:', error.message);
    res.status(500).json({ error: 'Внутренняя ошибка' });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Не найдено' }));

app.use((error, req, res, next) => {
  console.error('Ошибка API:', error.message);
  if (res.headersSent) {
    return next(error);
  }
  res.status(500).json({ error: 'Внутренняя ошибка' });
});

const runApiServer = () => {
  const port = Number(process.env.PORT) || 3000;
  return app.listen(port, () => console.log(`API на http://localhost:${port}`));
};

export { app, runApiServer };
export default runApiServer;