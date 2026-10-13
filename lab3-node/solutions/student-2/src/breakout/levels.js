export const LEVELS_DATA = [
  {
    id: 1,
    name: 'Легкий старт',
    difficulty: 'Легкий',
    layout: [
      '+----------------------+',
      '| [■][■][■][■][■][■]  | (ряд 1: обычные)',
      '| [■][■][■][■][■][■]  | (ряд 2: обычные)',
      '|                      |',
      '|         ===          | (платформа)',
      '+----------------------+'
    ].join('\n'),
    hint: 'Направляйте мяч в крайние блоки под углом ~60°, чтобы пробить коридор и выбивать верхний ряд рикошетом.'
  },
  {
    id: 2,
    name: 'Каменный барьер',
    difficulty: 'Средний',
    layout: [
      '+----------------------+',
      '| [■][■]  --  [■][■]   | (ряд 1: проход)',
      '| [■][■][■][■][■][■]   | (ряд 2: усиленные)',
      '|                      |',
      '|         ===          | (платформа)',
      '+----------------------+'
    ].join('\n'),
    hint: 'В центре проход! Цельтесь в зазор между блоками, используя отскок от боковой стены под углом 35°.'
  },
  {
    id: 3,
    name: 'Лабиринт кирпичей',
    difficulty: 'Сложный',
    layout: [
      '+----------------------+',
      '| [■]  [■]  [■]  [■]   | (ряд 1: колонны)',
      '|   [■]  [■]  [■]      | (ряд 2: шахматы)',
      '|                      |',
      '|         ===          | (платформа)',
      '+----------------------+'
    ].join('\n'),
    hint: 'Сложный угол атаки: цельтесь под углом 75° в узкие карманы, чтобы мяч застрял внутри купола.'
  }
];

export const getLevelsList = (userProgress = {}) => {
  return LEVELS_DATA.map((lvl) => {
    const isCompleted = Boolean(userProgress[lvl.id]);
    const status = isCompleted ? '✅ Пройден' : '⏳ Не пройден';
    return `${lvl.id}. "${lvl.name}" [${lvl.difficulty}] — ${status}`;
  }).join('\n');
};

export const getLevelHint = (levelId) => {
  const level = LEVELS_DATA.find((item) => item.id === levelId);
  if (!level) {
    return 'Уровень не найден. Доступные уровни: 1, 2, 3.';
  }

  return (
    `Расположение блоков (Уровень ${level.id} — "${level.name}"):\n` +
    '```\n' +
    `${level.layout}\n` +
    '```\n' +
    `💡 Куда направлять мяч: ${level.hint}`
  );
};

export const getCurrentLevel = (userProgress = {}) => {
  const nextLevel = LEVELS_DATA.find((lvl) => !userProgress[lvl.id]);
  return nextLevel ? nextLevel.id : LEVELS_DATA[LEVELS_DATA.length - 1].id;
};

export const setLevelCompleted = (userProgress, levelId) => {
  const numericId = Number(levelId);
  if (!LEVELS_DATA.some((lvl) => lvl.id === numericId)) {
    return { success: false, message: 'Уровень с таким номером не существует (доступны: 1, 2, 3).' };
  }
  userProgress[numericId] = true;
  return { success: true, message: `Уровень ${numericId} успешно отмечен как пройденный! 🎉` };
};