import express from 'express';
import {
  addTransaction,
  getReport,
} from '../services/transactionService.js';

const app = express();

app.use(express.json());

app.post('/api/transactions', (req, res) => {
  try {
    const saved = addTransaction(req.body);

    res.status(201).json({
      ok: true,
      saved,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
});

app.get('/api/report', (req, res) => {
  try {
    const { from, to } = req.query;
    const report = getReport(from, to);

    res.json(report);
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
});

export default app;
