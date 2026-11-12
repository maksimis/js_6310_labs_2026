import { loadRecords } from '../records.js';

export async function handleRecords() {
  const records = await loadRecords();
  if (records.length === 0) {
    return 'Рекордов пока нет.';
  }
  const lines = records.map((r, i) =>
    `${i + 1}. ${r.name} — ${r.score} (${r.topic}/${r.mode})`);
  return `🏆 Таблица рекордов:\n${lines.join('\n')}`;
}