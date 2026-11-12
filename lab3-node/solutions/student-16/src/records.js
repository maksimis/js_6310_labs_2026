import fs from 'fs/promises';
import { config } from './config.js';

export async function loadRecords(file = config.recordsFile) {
  try {
    const data = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveRecords(records, file = config.recordsFile) {
  const sorted = [...records]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  await fs.writeFile(file, JSON.stringify(sorted, null, 2), 'utf8');
  return sorted;
}

export async function addRecord({ name, score, topic, mode }, file = config.recordsFile) {
  if (!name || typeof score !== 'number' || score < 0) {
    throw new Error('Invalid record');
  }
  const records = await loadRecords(file);
  records.push({
    name: String(name).slice(0, 32),
    score,
    topic,
    mode,
    date: new Date().toISOString(),
  });
  return saveRecords(records, file);
}