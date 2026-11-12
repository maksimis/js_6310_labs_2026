import { generateTask, checkAnswer, TOPICS } from './tasks.js';
import { updateStats, getStats } from './storage.js';
import { calcPercent } from './math.js';
import {
  mainMenuKeyboard,
  topicKeyboard,
  typeKeyboard,
  answersKeyboard
} from './keyboards.js';

export const STATES = {
  IDLE: 'idle',
  AWAITING_TOPIC: 'awaiting_topic',
  AWAITING_TYPE: 'awaiting_type',
  AWAITING_ANSWER: 'awaiting_answer'
};

export class UserFSM {
  constructor() {
    this.states = new Map();
  }
  get(userId) {
    return (
      this.states.get(String(userId)) || { state: STATES.IDLE, context: {} }
    );
  }
  set(userId, state, context = {}) {
    this.states.set(String(userId), { state, context });
  }
  reset(userId) {
    this.states.delete(String(userId));
  }
  size() {
    return this.states.size;
  }
}

export function formatTask(task) {
  let msg = `📘 Задание #${task.id}\n`;
  msg += `Тема: ${task.topicName}\n`;
  msg += `Тип: ${task.type === 'test' ? 'Тест' : 'Теория'}\n\n`;
  msg += task.question;
  if (task.type === 'test') {
    msg += '\n\nВарианты:\n';
    msg += task.options
      .map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`)
      .join('\n');
    msg += '\n\nВыберите ответ кнопкой или напишите букву.';
  } else {
    msg += '\n\nНапишите развёрнутый ответ текстом (минимум 15 символов).';
  }
  return msg;
}

// Извлекаем тему из любого места текста
function extractTopic(text) {
  const lower = text.toLowerCase();
  if (/\bjs\b/.test(lower) || /javascript/.test(lower)) return 'js';
  if (/\bnode\b/.test(lower) || /nodejs/.test(lower)) return 'node';
  if (/\bdb\b/.test(lower) || /базы?\s*данн/.test(lower)) return 'db';
  return null;
}

// Извлекаем тип задания
function extractType(text) {
  const lower = text.toLowerCase();
  if (lower.includes('theory') || lower.includes('теор')) return 'theory';
  if (lower.includes('test') || lower.includes('тест')) return 'test';
  return null;
}

// Определяем команду: payload → /команда → ключевые слова
function detectCommand(text, payload) {
  if (payload && typeof payload.command === 'string') {
    return payload.command;
  }

  const commandMatch = text.match(/\/([a-z_]+)/i);
  if (commandMatch) {
    const cmd = commandMatch[1].toLowerCase();
    if (cmd === 'gen_task') return 'gen_task';
    if (cmd === 'stats') return 'stats';
    if (cmd === 'start') return 'start';
    if (cmd === 'check') {
      const idx = text.toLowerCase().indexOf('/check');
      const afterCheck = text.slice(idx + 6).trim().toLowerCase();

      // Справка: /check, /check help, /check справка, /check помощь
      if (
        afterCheck === '' ||
        afterCheck === 'help' ||
        afterCheck === 'справка' ||
        afterCheck === 'помощь'
      ) {
        return 'check_help';
      }
      return 'check_answer';
    }
  }

  const lower = text.toLowerCase();
  if (lower.includes('gen_task') || lower.includes('задание')) return 'gen_task';
  if (lower.includes('статистика') || lower.includes('stats')) return 'stats';
  if (lower.includes('меню') || lower.includes('menu')) return 'menu';
  if (
    lower.includes('начать') ||
    lower.includes('старт') ||
    lower.includes('start')
  ) {
    return 'start';
  }
  if (lower.includes('check') || lower.includes('проверк')) return 'check_help';

  return null;
}

const MENU_TEXT =
  'Привет! Я помогу подготовиться к собеседованию по JS, Node.js и БД.\n\n' +
  'Команды:\n' +
  '/gen_task — новое задание\n' +
  '/check <id> <ответ> — проверить ответ на задание\n' +
  '/stats — статистика\n\n' +
  '💡 После получения задания можно просто написать букву (A/B/C/D) или ответ текстом — бот сам поймёт, к какому заданию он относится.';

async function processAnswer(context, userId, fsm, taskId, answer) {
  try {
    const result = checkAnswer(taskId, answer);
    updateStats(userId, result.correct);
    fsm.reset(userId);
    await context.send({
      message: result.comment,
      keyboard: mainMenuKeyboard()
    });
  } catch (err) {
    fsm.reset(userId);
    await context.send({
      message: `Ошибка: ${err.message}`,
      keyboard: mainMenuKeyboard()
    });
  }
}

export function createMessageHandler(fsm = new UserFSM()) {
  return async function handle(context) {
    // ── 1. Переменные ──
    const userId = String(context.senderId);
    const rawText = String(context.text || '');
    const text = rawText
      .replace(/\u00A0/g, ' ')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/@(club|public)\d+/gi, '')
      .replace(/Бот образовательной платформы[^a-zа-я0-9]*/gi, '')
      .normalize('NFC')
      .trim();
    const payload = context.messagePayload || {};
    const command = detectCommand(text, payload);
    const current = fsm.get(userId);

    // ── 2. START / MENU ──
    if (command === 'start' || command === 'menu' || text === '') {
      fsm.reset(userId);
      await context.send({
        message: MENU_TEXT,
        keyboard: mainMenuKeyboard()
      });
      return;
    }

    // ── 3. STATS ──
    if (command === 'stats') {
      const s = getStats(userId);
      const percent = calcPercent(s.correct, s.total);
      await context.send({
        message: `📊 Статистика:\nВсего: ${s.total}\nВерных: ${s.correct}\nПроцент: ${percent}%`,
        keyboard: mainMenuKeyboard()
      });
      return;
    }

    // ── 4. GEN_TASK ──
    if (command === 'gen_task') {
      fsm.set(userId, STATES.AWAITING_TOPIC, {});
      await context.send({
        message: 'Выберите тему:',
        keyboard: topicKeyboard()
      });
      return;
    }

    // ── 5. CHECK HELP ──
    if (command === 'check_help') {
      await context.send({
        message:
          '📝 Команда /check проверяет ответ на задание.\n\n' +
          'Формат:\n' +
          '/check <taskId> <ответ>\n\n' +
          'Пример:\n' +
          '/check m1z2k3abc B\n\n' +
          '💡 Если вы только что получили задание, ID писать не нужно — просто отправьте букву ответа (A/B/C/D) или текст, и бот сам подставит нужный ID.',
        keyboard: mainMenuKeyboard()
      });
      return;
    }

    // ── 6. Payload темы (topic_js / topic_node / topic_db) ──
    if (command && command.startsWith('topic_')) {
      const topic = command.slice(6);
      if (!TOPICS[topic]) {
        await context.send({
          message: 'Неверная тема. Выберите кнопкой:',
          keyboard: topicKeyboard()
        });
        return;
      }
      fsm.set(userId, STATES.AWAITING_TYPE, { topic });
      await context.send({
        message: `Тема: ${TOPICS[topic].name}\nВыберите тип задания:`,
        keyboard: typeKeyboard()
      });
      return;
    }

    // ── 7. Payload типа (type_theory / type_test) ──
    if (command && command.startsWith('type_')) {
      const type = command.slice(5);
      if (type !== 'theory' && type !== 'test') {
        await context.send({
          message: 'Неверный тип. Выберите кнопкой:',
          keyboard: typeKeyboard()
        });
        return;
      }
      try {
        const topic = current.context.topic || 'js';
        const task = generateTask(topic, type);
        fsm.set(userId, STATES.AWAITING_ANSWER, { taskId: task.id });

        if (task.type === 'test') {
          await context.send({
            message: formatTask(task),
            keyboard: answersKeyboard(task.options)
          });
        } else {
          await context.send({
            message: formatTask(task),
            keyboard: mainMenuKeyboard()
          });
        }
      } catch (err) {
        fsm.reset(userId);
        await context.send({
          message: `Ошибка: ${err.message}`,
          keyboard: mainMenuKeyboard()
        });
      }
      return;
    }

    // ── 8. Payload ответа (answer_A / answer_B / ...) ──
    if (command && command.startsWith('answer_')) {
      const letter = command.slice(7);
      if (current.state !== STATES.AWAITING_ANSWER) {
        await context.send({
          message: 'Сначала получите задание через /gen_task.',
          keyboard: mainMenuKeyboard()
        });
        return;
      }
      await processAnswer(context, userId, fsm, current.context.taskId, letter);
      return;
    }

    // ── 9. /check <answer> или /check <id> <answer> ──
    if (command === 'check_answer') {
      const idx = text.toLowerCase().indexOf('/check');
      const afterCheck = text.slice(idx + 6).trim();

      if (current.state === STATES.AWAITING_ANSWER && afterCheck) {
        const parts = afterCheck.split(/\s+/);
        const currentId = current.context.taskId;
        if (parts[0] === currentId && parts.length > 1) {
          await processAnswer(
            context,
            userId,
            fsm,
            currentId,
            parts.slice(1).join(' ')
          );
          return;
        }
        await processAnswer(context, userId, fsm, currentId, afterCheck);
        return;
      }

      const parts = afterCheck.split(/\s+/);
      const taskId = parts[0];
      const answer = parts.slice(1).join(' ');
      if (!taskId || !answer) {
        await context.send({
          message:
            'Использование:\n/check <taskId> <ответ>\n\nПример: /check m1z2k3abc B',
          keyboard: mainMenuKeyboard()
        });
        return;
      }
      await processAnswer(context, userId, fsm, taskId, answer);
      return;
    }

    // ── 10. FSM: AWAITING_TOPIC ──
    if (current.state === STATES.AWAITING_TOPIC) {
      const topic = extractTopic(text);
      if (!topic) {
        await context.send({
          message: 'Неверная тема. Выберите кнопкой:',
          keyboard: topicKeyboard()
        });
        return;
      }
      fsm.set(userId, STATES.AWAITING_TYPE, { topic });
      await context.send({
        message: `Тема: ${TOPICS[topic].name}\nВыберите тип задания:`,
        keyboard: typeKeyboard()
      });
      return;
    }

    // ── 11. FSM: AWAITING_TYPE ──
    if (current.state === STATES.AWAITING_TYPE) {
      const type = extractType(text);
      if (!type) {
        await context.send({
          message: 'Неверный тип. Выберите кнопкой:',
          keyboard: typeKeyboard()
        });
        return;
      }
      try {
        const task = generateTask(current.context.topic, type);
        fsm.set(userId, STATES.AWAITING_ANSWER, { taskId: task.id });
        if (task.type === 'test') {
          await context.send({
            message: formatTask(task),
            keyboard: answersKeyboard(task.options)
          });
        } else {
          await context.send({
            message: formatTask(task),
            keyboard: mainMenuKeyboard()
          });
        }
      } catch (err) {
        fsm.reset(userId);
        await context.send({
          message: `Ошибка: ${err.message}`,
          keyboard: mainMenuKeyboard()
        });
      }
      return;
    }

    // ── 12. FSM: AWAITING_ANSWER ──
    if (current.state === STATES.AWAITING_ANSWER) {
      const letterMatch = text.match(/(?:^|\s)([abcd])(?:\s|$)/i);
      const answer = letterMatch ? letterMatch[1].toUpperCase() : text;
      await processAnswer(context, userId, fsm, current.context.taskId, answer);
      return;
    }

    // ── 13. Неизвестная команда ──
    await context.send({
      message: 'Неизвестная команда. Воспользуйтесь меню:',
      keyboard: mainMenuKeyboard()
    });
  };
}