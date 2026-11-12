export const TOPICS = {
  general: 'Общая',
  science: 'Наука',
  sport: 'Спорт',
  it: 'IT',
};

export const MODES = {
  choice: 'Выбор ответа',
  open: 'Свободный ответ',
};

export const QUESTIONS = {
  general: {
    choice: [
      { q: 'Столица Франции?', options: ['Париж', 'Лондон', 'Берлин', 'Мадрид'], answer: 0 },
      { q: 'Сколько континентов на Земле?', options: ['5', '6', '7', '8'], answer: 2 },
    ],
    open: [
      { q: 'Столица Японии?', answer: 'токио' },
      { q: 'Какого цвета небо?', answer: 'голубое' },
    ],
  },
  science: {
    choice: [
      { q: 'Химический символ воды?', options: ['CO2', 'H2O', 'O2', 'NaCl'], answer: 1 },
      { q: 'Сколько планет в Солнечной системе?', options: ['7', '8', '9', '10'], answer: 1 },
    ],
    open: [
      { q: 'Какой газ преобладает в атмосфере Земли?', answer: 'азот' },
      { q: 'Сколько хромосом у человека?', answer: '46' },
    ],
  },
  sport: {
    choice: [
      { q: 'Сколько игроков в футбольной команде на поле?', options: ['9', '10', '11', '12'], answer: 2 },
      { q: 'Где прошли Олимпийские игры 2016?', options: ['Пекин', 'Рио', 'Лондон', 'Токио'], answer: 1 },
    ],
    open: [
      { q: 'Как называется вид спорта с ракеткой и воланом?', answer: 'бадминтон' },
      { q: 'Сколько таймов в футбольном матче?', answer: '2' },
    ],
  },
  it: {
    choice: [
      {
        q: 'Что означает HTML?',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlinks Text Mark Language',
        ],
        answer: 0,
      },
      { q: 'Какой язык используется в React?', options: ['Python', 'Java', 'JavaScript', 'C#'], answer: 2 },
    ],
    open: [
      { q: 'Что означает аббревиатура CPU?', answer: 'процессор' },
      { q: 'Какой командой создаётся ветка в git?', answer: 'git checkout -b' },
    ],
  },
};

export function getQuestions(topic, mode) {
  if (!QUESTIONS[topic] || !QUESTIONS[topic][mode]) {
    return [];
  }
  return QUESTIONS[topic][mode];
}

export function checkAnswer(question, userAnswer, mode) {
  if (mode === 'choice') {
    const idx = Number.parseInt(userAnswer, 10);
    if (!Number.isInteger(idx)) {
      return false;
    }
    // пользователь передаёт 1-based номер варианта, а answer хранится 0-based
    return (idx - 1) === question.answer;
  }
  return String(userAnswer).trim().toLowerCase() === String(question.answer).toLowerCase();
}