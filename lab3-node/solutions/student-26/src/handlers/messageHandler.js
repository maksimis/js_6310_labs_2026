import { calcCpm, countErrors, calcAccuracy, average, loadUsers, saveUsers, } from '../utils/index.js';

const TEXTS = [
  'Быстрая коричневая лиса прыгает через ленивую собаку',
  'Программирование это искусство объяснять машине что ты хочешь',
  'Утро начинается с чашки ароматного кофе и хорошей музыки',
  'Ключ к успеху в постоянной практике и терпении',
  'Ветер шумит в кронах деревьев за окном старого дома',
];

const users = new Map();

const saved = loadUsers();
for (const key of Object.keys(saved)) {
  users.set(key, saved[key]);
}

// для тестов
export function clearUsers() {
  users.clear();
}

const handleMessage = async (userId, text, reply) => {
  if (typeof text !== 'string' || typeof reply !== 'function') {
    return;
  }

  const command = text.trim();
  if (command === '') {
    return;
  }

  const user = users.get(String(userId));

  if (command === '/start') {
    const randomText = TEXTS[Math.floor(Math.random() * TEXTS.length)];
    users.set(String(userId), {
      text: randomText,
      startedAt: Date.now(),
      history: user ? user.history : [],
    });
    saveUsers(users);
    await reply(
      'Тренировка началась! Наберите текст и отправьте его так: /type <ваш текст>\n\n' +
        randomText
    );
    return;
  }

  if (command === '/stats') {
    if (!user || user.history.length === 0) {
      await reply('Пока нет завершённых тренировок. Начните с /start.');
      return;
    }
    const speeds = user.history.map((r) => r.cpm);
    await reply(
      'Статистика:\n' +
        `Тренировок: ${user.history.length}\n` +
        `Лучший результат: ${Math.max(...speeds)} симв/мин\n` +
        `Средняя скорость: ${average(speeds)} симв/мин\n` +
        `Последние: ${speeds.slice(-5).join(', ')}`
    );
    return;
  }

  if (command.startsWith('/type')) {
    if (!user || !user.text) {
      await reply('Сначала начните тренировку командой /start.');
      return;
    }
    const typed = command.slice('/type'.length).trim();
    if (!typed) {
      await reply('Пришлите текст после команды: /type <ваш текст>');
      return;
    }

    const errors = countErrors(user.text, typed);
    const accuracy = calcAccuracy(user.text, typed);
    const cpm = calcCpm(typed.length, Date.now() - user.startedAt);

    user.history.push({ cpm, errors, accuracy });
    user.text = null;
    saveUsers(users);

    await reply(
      'Результат:\n' +
        `Скорость: ${cpm} симв/мин\n` +
        `Символов: ${typed.length}\n` +
        `Ошибок: ${errors}\n` +
        `Точность: ${accuracy}%`
    );
    return;
  }

  await reply('Неизвестная команда. Доступно: /start, /type, /stats.');
};

export default handleMessage;