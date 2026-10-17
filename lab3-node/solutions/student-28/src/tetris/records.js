// Таблица рекордов и лидерборд для мультиплеерного Тетриса.

const DEFAULT_RECORDS = [
  { name: 'TetrisMaster', score: 1200 },
  { name: 'Alex', score: 850 },
  { name: 'BlockBuilder', score: 500 },
  { name: 'Gamer_99', score: 300 },
  { name: 'Rookie', score: 100 },
];

let leaderboard = [...DEFAULT_RECORDS];

// Получение списка лидеров (по умолчанию топ-10)
export function getLeaderboard(limit = 10) {
  return [...leaderboard]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
}

// Валидация имени игрока
export function validatePlayerName(name) {
  if (typeof name !== 'string') {
    return { valid: false, error: 'Имя игрока должно быть текстом.' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { valid: false, error: 'Имя слишком короткое (минимум 2 символа).' };
  }
  if (trimmed.length > 20) {
    return { valid: false, error: 'Имя слишком длинное (максимум 20 символов).' };
  }
  return { valid: true, name: trimmed };
}

// Добавление рекорда в таблицу
export function addRecord(name, score) {
  const nameValidation = validatePlayerName(name);
  if (!nameValidation.valid) {
    return { success: false, error: nameValidation.error };
  }

  const numericScore = Number(score);
  if (!Number.isFinite(numericScore) || numericScore < 0 || !Number.isInteger(numericScore)) {
    return { success: false, error: 'Счёт должен быть неотрицательным целым числом.' };
  }

  const newEntry = {
    name: nameValidation.name,
    score: numericScore,
  };

  leaderboard.push(newEntry);
  leaderboard.sort((a, b) => b.score - a.score);

  const rank = leaderboard.findIndex((item) => item === newEntry) + 1;

  // Ограничиваем общий размер таблицы
  if (leaderboard.length > 50) {
    leaderboard = leaderboard.slice(0, 50);
  }

  return { success: true, rank, record: newEntry };
}

// Очистка или сброс таблицы рекордов (для тестов)
export function resetLeaderboard(initial = DEFAULT_RECORDS) {
  leaderboard = initial.map((item) => ({ ...item }));
}

// Текстовое представление таблицы лидеров
export function formatLeaderboard(records = null) {
  const list = records || getLeaderboard();
  if (list.length === 0) {
    return '🏆 Таблица лидеров пока пуста. Станьте первым!';
  }

  const lines = ['🏆 Таблица лидеров TetrisBattle:'];
  list.forEach((item, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    lines.push(`${medal} ${item.name} — ${item.score} очков`);
  });

  return lines.join('\n');
}
