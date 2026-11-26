import { saveTask, getTask } from './storage.js';

export const TOPICS = {
  js: {
    name: 'Основы JS',
    theory: [
      {
        question: 'Что такое замыкание в JavaScript?',
        keywordGroups: [
          ['функция', 'функцию', 'функции'],
          ['область видимости', 'scope', 'лексическое окружение'],
          ['переменная', 'переменную', 'переменные']
        ],
        explanation:
          'Замыкание — это функция, которая запоминает своё лексическое окружение.'
      }
    ],
    test: [
      {
        question: 'Какой оператор используется для строгого сравнения?',
        options: ['==', '===', '=', '!='],
        correctAnswer: 1,
        explanation: 'Оператор === сравнивает без приведения типов.'
      }
    ]
  },
  node: {
    name: 'Node.js',
    theory: [
      {
        question: 'Что такое event loop?',
        keywordGroups: [
          ['очередь', 'queue'],
          ['события', 'событие', 'callback', 'колбэк'],
          ['асинхронность', 'асинхронный', 'async']
        ],
        explanation:
          'Event loop обрабатывает асинхронные операции через очередь колбэков.'
      }
    ],
    test: [
      {
        question: 'Какой модуль используется для работы с файлами?',
        options: ['fs', 'http', 'path', 'os'],
        correctAnswer: 0,
        explanation: 'Модуль fs предоставляет API файловой системы.'
      }
    ]
  },
  db: {
    name: 'Базы данных',
    theory: [
      {
        question: 'Что такое нормализация?',
        keywordGroups: [
          ['таблицы', 'таблица'],
          ['избыточность', 'дублирование'],
          ['связи', 'связь', 'отношения']
        ],
        explanation:
          'Нормализация уменьшает избыточность и аномалии обновления.'
      }
    ],
    test: [
      {
        question: 'Какой язык используется для запросов в реляционных БД?',
        options: ['SQL', 'JavaScript', 'Python', 'HTML'],
        correctAnswer: 0,
        explanation: 'SQL — стандартный язык структурированных запросов.'
      }
    ]
  }
};

export function generateTask(topic, type) {
  if (!TOPICS[topic]) {
    throw new Error('Неизвестная тема. Доступно: js, node, db');
  }
  const pool = TOPICS[topic][type];
  if (!pool || pool.length === 0) {
    throw new Error('Неверный тип задания. Доступно: theory, test');
  }

  const base = pool[Math.floor(Math.random() * pool.length)];
  const task = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    topic,
    topicName: TOPICS[topic].name,
    type,
    ...base
  };
  saveTask(task);
  return task;
}

export function checkTheory(answer, task) {
  const text = answer.toLowerCase().trim();

  if (text.length < 15) {
    return {
      correct: false,
      comment: `Ответ слишком короткий. Раскройте тему подробнее. ${task.explanation}`
    };
  }

  const groups = task.keywordGroups || [];
  const matchedGroups = groups.filter((group) =>
    group.some((kw) => text.includes(kw.toLowerCase()))
  );

  const ratio = groups.length ? matchedGroups.length / groups.length : 0;

  if (ratio >= 0.99) {
    return { correct: true, comment: `Верно! ${task.explanation}` };
  }
  if (ratio >= 0.5) {
    return {
      correct: false,
      comment: `Частично верно. Раскрыто ${matchedGroups.length} из ${groups.length} ключевых аспектов. ${task.explanation}`
    };
  }
  return {
    correct: false,
    comment: `Ответ неполный. Нужно упомянуть: ${groups.map((g) => g[0]).join(', ')}. ${task.explanation}`
  };
}

export function checkAnswer(taskId, answer) {
  if (!taskId || typeof taskId !== 'string') {
    throw new Error('Некорректный taskId');
  }
  if (typeof answer !== 'string' || answer.trim() === '') {
    throw new Error('Пустой ответ');
  }

  const task = getTask(taskId);
  if (!task) {
    throw new Error('Задание не найдено');
  }

  if (task.type === 'test') {
    const normalized = answer.trim().toUpperCase();
    const correctLetter = String.fromCharCode(65 + task.correctAnswer);
    const correctIndex = String(task.correctAnswer + 1);
    const correct =
      normalized === correctLetter || normalized === correctIndex;
    return {
      correct,
      comment: correct
        ? `Верно! ${task.explanation}`
        : `Неверно. Правильный ответ: ${correctLetter}. ${task.explanation}`
    };
  }

  return checkTheory(answer, task);
}