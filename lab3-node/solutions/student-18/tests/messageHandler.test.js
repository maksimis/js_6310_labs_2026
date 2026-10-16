import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import handleMessage from '../src/handlers/messageHandler.js';
import { clearAllGoals } from '../src/services/okrService.js';
import { clearAllStates } from '../src/fsm/stateManager.js';

describe('Message Handler', () => {
  const userId = 100;
  let reply;

  beforeEach(() => {
    clearAllGoals();
    clearAllStates();
    reply = jest.fn();
  });

  test('ignores empty or non-string input', async () => {
    await handleMessage(userId, undefined, reply);
    await handleMessage(userId, null, reply);
    await handleMessage(userId, 123, reply);
    expect(reply).not.toHaveBeenCalled();
  });

  test('replies to /start with greeting and command list', async () => {
    await handleMessage(userId, '/start', reply);
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('🎯 Привет! Я OkrBot'));
  });

  test('responds to unknown command', async () => {
    await handleMessage(userId, '/unknown', reply);
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('Я не знаю такую команду'));
  });

  test('/cancel resets FSM state', async () => {
    await handleMessage(userId, '/add_goal', reply);
    reply.mockClear();

    await handleMessage(userId, '/cancel', reply);
    expect(reply).toHaveBeenCalledWith('Действие отменено.');
  });

  describe('Goal creation FSM flow', () => {
    test('full flow: /add_goal -> title -> deadline -> created', async () => {
      await handleMessage(userId, '/add_goal', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Введите название цели'));

      reply.mockClear();
      // Invalid title (starts with slash)
      await handleMessage(userId, '/goals', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Название цели не должно быть'));

      reply.mockClear();
      // Valid title
      await handleMessage(userId, 'Закрыть сессию', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Введите срок выполнения цели'));

      reply.mockClear();
      // Invalid date format
      await handleMessage(userId, '32.13.2', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Неверный формат даты'));

      reply.mockClear();
      // Past date
      await handleMessage(userId, '01.01.2024', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Неверный формат даты'));

      reply.mockClear();
      // Valid future date
      await handleMessage(userId, '31.12.2026', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('успешно создана!'));
    });
  });

  describe('/goals command', () => {
    test('shows empty notice when user has no goals', async () => {
      await handleMessage(userId, '/goals', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('У вас пока нет добавленных целей'));
    });

    test('shows goals list with KR and progress', async () => {
      // Add goal
      await handleMessage(userId, '/add_goal', reply);
      await handleMessage(userId, 'Goal 1', reply);
      await handleMessage(userId, '31.12.2026', reply);

      reply.mockClear();
      await handleMessage(userId, '/goals', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('🎯 Ваши цели'));
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Goal 1'));
    });
  });

  describe('Key Result creation FSM flow', () => {
    test('shows notice if user has no goals', async () => {
      await handleMessage(userId, '/key_result', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('У вас пока нет целей'));
    });

    test('full flow: /key_result -> goalId -> title -> target -> created', async () => {
      // Create a goal first
      await handleMessage(userId, '/add_goal', reply);
      await handleMessage(userId, 'Goal 1', reply);
      await handleMessage(userId, '31.12.2026', reply);

      reply.mockClear();
      await handleMessage(userId, '/key_result', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Выберите номер цели'));

      reply.mockClear();
      // Invalid goal id
      await handleMessage(userId, '999', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Цель с таким номером не найдена'));

      reply.mockClear();
      // Valid goal id
      await handleMessage(userId, '1', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Введите краткое описание ключевого результата'));

      reply.mockClear();
      // Invalid title
      await handleMessage(userId, '/cmd', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Описание не должно быть пустым'));

      reply.mockClear();
      // Valid title
      await handleMessage(userId, 'Сдать 5 лаб', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Введите целевое значение'));

      reply.mockClear();
      // Invalid target
      await handleMessage(userId, '-5', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Целевое значение должно быть числом больше 0'));

      reply.mockClear();
      // Valid target
      await handleMessage(userId, '5', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('успешно привязан к цели №1!'));
    });
  });

  describe('/progress command FSM flow', () => {
    test('shows notice if no goals or no KRs', async () => {
      await handleMessage(userId, '/progress', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('У вас пока нет целей'));

      reply.mockClear();
      // Add goal without KR
      await handleMessage(userId, '/add_goal', reply);
      await handleMessage(userId, 'Goal 1', reply);
      await handleMessage(userId, '31.12.2026', reply);

      reply.mockClear();
      await handleMessage(userId, '/progress', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('У ваших целей еще нет ключевых результатов'));
    });

    test('full flow: /progress -> goalId -> krId -> actual -> updated', async () => {
      // Setup goal and KR
      await handleMessage(userId, '/add_goal', reply);
      await handleMessage(userId, 'Goal 1', reply);
      await handleMessage(userId, '31.12.2026', reply);

      await handleMessage(userId, '/key_result', reply);
      await handleMessage(userId, '1', reply);
      await handleMessage(userId, 'Лабы', reply);
      await handleMessage(userId, '4', reply);

      reply.mockClear();
      await handleMessage(userId, '/progress', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Выберите номер цели для обновления прогресса'));

      reply.mockClear();
      // Invalid goal id
      await handleMessage(userId, '999', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Цель не найдена или у неё нет'));

      reply.mockClear();
      // Valid goal id
      await handleMessage(userId, '1', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Выберите номер ключевого результата'));

      reply.mockClear();
      // Invalid kr id
      await handleMessage(userId, '999', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Ключевой результат с таким номером не найден'));

      reply.mockClear();
      // Valid kr id
      await handleMessage(userId, '1', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Введите текущее выполненное значение для «Лабы»'));

      reply.mockClear();
      // Invalid value
      await handleMessage(userId, '-1', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('Значение должно быть числом (0 или больше)'));

      reply.mockClear();
      // Valid value
      await handleMessage(userId, '2', reply);
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('✅ Прогресс обновлен!'));
      expect(reply).toHaveBeenCalledWith(expect.stringContaining('50%'));
    });
  });
});