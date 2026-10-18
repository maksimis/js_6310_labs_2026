import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import handleMessage from '../src/handlers/messageHandler.js';
import { clearFragments, addFragment } from '../src/knowledge/knowledgeBase.js';
import { clearAllStates, STATES, getState } from '../src/state/stateMachine.js';

// Хелпер — создаёт мок-функцию reply
function createReplyMock() {
  return jest.fn(async () => {});
}

describe('messageHandler', () => {
  let reply;

  beforeEach(() => {
    clearFragments();
    clearAllStates();
    reply = createReplyMock();
  });

  // ===== Валидация входных данных =====
  describe('валидация входа', () => {
    test('игнорирует пустой текст', async () => {
      await handleMessage(1, '', reply);
      expect(reply).not.toHaveBeenCalled();
    });

    test('игнорирует null', async () => {
      await handleMessage(1, null, reply);
      expect(reply).not.toHaveBeenCalled();
    });

    test('игнорирует не строку', async () => {
      await handleMessage(1, 123, reply);
      expect(reply).not.toHaveBeenCalled();
    });

  });

  // ===== /help и /start =====
  describe('/help и /start', () => {
    test('/help отправляет справку', async () => {
      await handleMessage(1, '/help', reply);

      expect(reply).toHaveBeenCalledTimes(1);
      const message = reply.mock.calls[0][0];
      expect(message).toContain('/ask');
      expect(message).toContain('/add_knowledge');
      expect(message).toContain('/search');
    });

    test('/start отправляет справку', async () => {
      await handleMessage(1, '/start', reply);

      expect(reply).toHaveBeenCalledTimes(1);
      expect(reply.mock.calls[0][0]).toContain('Доступные команды');
    });
  });

  // ===== /add_knowledge — диалог =====
  describe('диалог /add_knowledge', () => {
    test('начинает диалог и меняет состояние', async () => {
      await handleMessage(1, '/add_knowledge', reply);

      expect(reply).toHaveBeenCalledWith(
        expect.stringContaining('Введите заголовок')
      );
      expect(getState(1).state).toBe(STATES.AWAITING_TITLE);
    });

    test('принимает заголовок и переходит к тексту', async () => {
      await handleMessage(1, '/add_knowledge', reply);
      await handleMessage(1, 'JavaScript', reply);

      expect(reply).toHaveBeenLastCalledWith(
        expect.stringContaining('Теперь введите текст')
      );
      expect(getState(1).state).toBe(STATES.AWAITING_CONTENT);
      expect(getState(1).title).toBe('JavaScript');
    });

    test('полный цикл: добавляет фрагмент', async () => {
      await handleMessage(1, '/add_knowledge', reply);
      await handleMessage(1, 'Python', reply);
      await handleMessage(1, 'Язык программирования', reply);

      expect(reply).toHaveBeenLastCalledWith(
        expect.stringContaining('Фрагмент добавлен')
      );
      expect(getState(1).state).toBe(STATES.IDLE);
    });

    test('пустой заголовок не принимается', async () => {
      await handleMessage(1, '/add_knowledge', reply);
      reply.mockClear();
      await handleMessage(1, '   ', reply);

      expect(reply).toHaveBeenCalledWith(
        expect.stringContaining('Заголовок не может быть пустым')
      );
      expect(getState(1).state).toBe(STATES.AWAITING_TITLE);
    });

    test('пустой текст не принимается', async () => {
      await handleMessage(1, '/add_knowledge', reply);
      await handleMessage(1, 'Заголовок', reply);
      reply.mockClear();
      await handleMessage(1, '   ', reply);

      expect(reply).toHaveBeenCalledWith(
        expect.stringContaining('Текст не может быть пустым')
      );
      expect(getState(1).state).toBe(STATES.AWAITING_CONTENT);
    });

    test('/cancel отменяет ввод заголовка', async () => {
      await handleMessage(1, '/add_knowledge', reply);
      reply.mockClear();
      await handleMessage(1, '/cancel', reply);

      expect(reply).toHaveBeenCalledWith('Действие отменено.');
      expect(getState(1).state).toBe(STATES.IDLE);
    });

    test('/cancel отменяет ввод текста', async () => {
      await handleMessage(1, '/add_knowledge', reply);
      await handleMessage(1, 'Заголовок', reply);
      reply.mockClear();
      await handleMessage(1, '/cancel', reply);

      expect(reply).toHaveBeenCalledWith('Действие отменено.');
      expect(getState(1).state).toBe(STATES.IDLE);
    });
  });

  // ===== /ask =====
  describe('/ask', () => {
    test('возвращает "не найдено", если база пуста', async () => {
      await handleMessage(1, '/ask javascript', reply);

      expect(reply).toHaveBeenCalledWith(
        expect.stringContaining('ничего не найдено')
      );
    });

    test('находит фрагмент', async () => {
      addFragment('JavaScript', 'Язык программирования');
      await handleMessage(1, '/ask javascript', reply);

      const message = reply.mock.calls[0][0];
      expect(message).toContain('JavaScript');
      expect(message).toContain('Язык программирования');
    });

    test('без аргумента просит вопрос', async () => {
      await handleMessage(1, '/ask', reply);

      expect(reply).toHaveBeenCalledWith(
        expect.stringContaining('Использование')
      );
    });

    test('ограничивает выдачу топ-3', async () => {
      addFragment('JS1', 'javascript');
      addFragment('JS2', 'javascript');
      addFragment('JS3', 'javascript');
      addFragment('JS4', 'javascript');
      await handleMessage(1, '/ask javascript', reply);

      const message = reply.mock.calls[0][0];
      expect(message).not.toContain('JS4');
    });
  });

  // ===== /search =====
  describe('/search', () => {
    test('возвращает "не найдено", если база пуста', async () => {
      await handleMessage(1, '/search javascript', reply);

      expect(reply).toHaveBeenCalledWith(
        expect.stringContaining('ничего не найдено')
      );
    });

    test('находит фрагмент', async () => {
      addFragment('JavaScript', 'Язык');
      await handleMessage(1, '/search javascript', reply);

      const message = reply.mock.calls[0][0];
      expect(message).toContain('JavaScript');
    });

    test('без аргумента просит слова', async () => {
      await handleMessage(1, '/search', reply);

      expect(reply).toHaveBeenCalledWith(
        expect.stringContaining('Использование')
      );
    });
  });

  // ===== /cancel в idle =====
  describe('/cancel в idle', () => {
    test('сообщает, что нечего отменять', async () => {
      await handleMessage(1, '/cancel', reply);

      expect(reply).toHaveBeenCalledWith('Нечего отменять.');
    });
  });

  // ===== Неизвестная команда =====
  describe('неизвестная команда', () => {
    test('подсказывает про /help', async () => {
      await handleMessage(1, 'привет', reply);

      expect(reply).toHaveBeenCalledWith(
        expect.stringContaining('Неизвестная команда')
      );
    });
  });

  // ===== Независимость пользователей =====
  describe('независимость состояний', () => {
    test('диалоги разных пользователей не пересекаются', async () => {
      await handleMessage(1, '/add_knowledge', reply);
      await handleMessage(2, '/add_knowledge', reply);

      expect(getState(1).state).toBe(STATES.AWAITING_TITLE);
      expect(getState(2).state).toBe(STATES.AWAITING_TITLE);

      await handleMessage(1, 'Заголовок 1', reply);

      expect(getState(1).state).toBe(STATES.AWAITING_CONTENT);
      expect(getState(2).state).toBe(STATES.AWAITING_TITLE);
    });
  });
});