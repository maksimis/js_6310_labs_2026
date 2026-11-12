import { ValidationError, validateText } from './knowledge.js';

const HELP = 'Команды:\n/ask — задать вопрос\n/add_knowledge — добавить фрагмент\n/search — поиск по словам\n/cancel — отменить ввод';

export function createMessageHandler(knowledge) {
  const sessions = new Map();

  function searchReply(step, query) {
    const found = knowledge.search(query);
    if (!found.length) return 'Совпадений не найдено. Попробуйте другие ключевые слова.';
    if (step === 'ask') {
      return `${found[0].content}\n\nИсточник: ${found[0].title}`;
    }
    return `Найденные фрагменты:\n${found.slice(0, 5).map(fragment =>
      `${fragment.id}. ${fragment.title} — ${fragment.relevance}%`).join('\n')}`;
  }

  return ({ chatId, userId, text }) => {
    if (!Number.isSafeInteger(chatId) || !Number.isSafeInteger(userId)) {
      return 'Не удалось определить пользователя или чат.';
    }
    if (typeof text !== 'string') return 'Отправьте текстовое сообщение.';
    const key = `${chatId}:${userId}`;
    text = text.trim();
    try {
      if (text.startsWith('/')) {
        sessions.delete(key);
        const match = text.match(/^\/([a-z_]+)(?:@\w+)?(?:\s+([\s\S]*))?$/i);
        const command = match?.[1].toLowerCase();
        if (command === 'start' || command === 'help') return HELP;
        if (command === 'cancel') return 'Ввод отменён.';
        if (command === 'add_knowledge') {
          sessions.set(key, { step: 'title' });
          return 'Введите заголовок (тему) фрагмента, до 100 символов.';
        }
        if (command !== 'ask' && command !== 'search') return `Неизвестная команда.\n${HELP}`;
        sessions.set(key, { step: command });
        if (!match[2]) return command === 'ask' ? 'Введите вопрос.' : 'Введите ключевые слова.';
        text = match[2];
      }
      const session = sessions.get(key);
      if (session?.step === 'title') {
        const title = validateText(text, 'Заголовок', 100);
        sessions.set(key, { step: 'content', title });
        return 'Введите содержание фрагмента, до 3000 символов.';
      }
      if (session?.step === 'content') {
        const fragment = knowledge.add({ title: session.title, content: text });
        sessions.delete(key);
        return `Добавлен фрагмент №${fragment.id}: ${fragment.title}`;
      }
      if (session) {
        const result = searchReply(session.step, text);
        sessions.delete(key);
        return result;
      }
      return HELP;
    } catch (error) {
      if (error instanceof ValidationError) return error.message;
      throw error;
    }
  };
}
