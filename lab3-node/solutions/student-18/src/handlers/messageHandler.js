import {
  getUserGoals,
  addGoal,
  getGoalById,
  addKeyResult,
  updateProgress,
  calculateKrProgress,
  calculateGoalProgress,
  calculateOverallProgress,
} from '../services/okrService.js';
import { STATES, getUserState, setUserState, resetUserState } from '../fsm/stateManager.js';
import {
  isValidTitle,
  isValidDate,
  isPositiveNumber,
  isNonNegativeNumber,
  isValidId,
} from '../utils/validator.js';

const handleMessage = async (userId, text, reply) => {
  if (!text || typeof text !== 'string') {
    return;
  }

  const trimmedText = text.trim();
  const userSession = getUserState(userId);

  if (trimmedText === '/cancel') {
    resetUserState(userId);
    await reply('Действие отменено.');
    return;
  }

  // FSM

  // Название
  if (userSession.state === STATES.AWAITING_GOAL_TITLE) {
    if (!isValidTitle(trimmedText)) {
      await reply('Название цели не должно быть пустым, длиннее 100 символов или начинаться со слэша (/).\nПопробуйте еще раз:');
      return;
    }

    setUserState(userId, STATES.AWAITING_GOAL_DEADLINE, { title: trimmedText });
    await reply('Введите срок выполнения цели (в формате ДД.ММ.ГГГГ, например 31.12.2026):');
    return;
  }

  // Дедлайн
  if (userSession.state === STATES.AWAITING_GOAL_DEADLINE) {
    if (!isValidDate(trimmedText)) {
      await reply('Неверный формат даты или указана прошедшая дата! Введите дату в формате ДД.ММ.ГГГГ (например, 31.12.2026):');
      return;
    }
    const goalTitle = userSession.data.title;
    const deadline = trimmedText;

    const newGoal = addGoal(userId, goalTitle, deadline);
    resetUserState(userId);

    await reply(`Цель №${newGoal.id} «${newGoal.title}» (срок: ${newGoal.deadline}) успешно создана!`);
    return;
  }

  // Выбор цели
  if (userSession.state === STATES.AWAITING_KR_GOAL_ID) {
    if (!isValidId(trimmedText) || !getGoalById(userId, trimmedText)) {
      await reply('Цель с таким номером не найдена. Пожалуйста, введите корректный номер цели (или /cancel):');
      return;
    }

    setUserState(userId, STATES.AWAITING_KR_TITLE, { goalId: Number(trimmedText) });
    await reply('Введите краткое описание ключевого результата:');
    return;
  }

  // Описание
  if (userSession.state === STATES.AWAITING_KR_TITLE) {
    if (!isValidTitle(trimmedText)) {
      await reply('Описание не должно быть пустым, длиннее 100 символов или начинаться со слэша (/).\nПопробуйте еще раз:');
      return;
    }

    setUserState(userId, STATES.AWAITING_KR_TARGET, {
      ...userSession.data,
      title: trimmedText,
    });
    await reply('Введите целевое значение (положительное число больше 0, например 5):');
    return;
  }

  // Целевое значение
  if (userSession.state === STATES.AWAITING_KR_TARGET) {
    if (!isPositiveNumber(trimmedText)) {
      await reply('Целевое значение должно быть числом больше 0. Попробуйте еще раз:');
      return;
    }

    const { goalId, title } = userSession.data;
    const newKr = addKeyResult(userId, goalId, title, trimmedText);
    resetUserState(userId);

    await reply(`Ключевой результат №${newKr.id} «${newKr.title}» (цель: ${newKr.target}) успешно привязан к цели №${goalId}!`);
    return;
  }

  // Выбор цели
  if (userSession.state === STATES.AWAITING_PROGRESS_GOAL_ID) {
    const goal = isValidId(trimmedText) ? getGoalById(userId, trimmedText) : null;
    if (!goal || goal.keyResults.length === 0) {
      await reply('Цель не найдена или у неё нет ключевых результатов. Введите корректный номер цели из списка:');
      return;
    }

    let krList = `Выберите номер ключевого результата для цели «${goal.title}»:\n\n`;
    goal.keyResults.forEach((kr) => {
      const krPercent = calculateKrProgress(kr);
      krList += `${kr.id}. ${kr.title} (текущее: ${kr.current}, цель: ${kr.target}, выполнено: ${krPercent}%)\n`;
    });
    krList += '\n(Или /cancel для отмены)';

    setUserState(userId, STATES.AWAITING_PROGRESS_KR_ID, { goalId: goal.id });
    await reply(krList);
    return;
  }

  if (userSession.state === STATES.AWAITING_PROGRESS_KR_ID) {
    const goal = getGoalById(userId, userSession.data.goalId);
    const kr = (goal && isValidId(trimmedText))
      ? goal.keyResults.find((k) => k.id === Number(trimmedText))
      : null;

    if (!kr) {
      await reply('Ключевой результат с таким номером не найден. Введите номер из списка:');
      return;
    }

    setUserState(userId, STATES.AWAITING_PROGRESS_VALUE, {
      goalId: goal.id,
      krId: kr.id,
    });
    await reply(`Введите текущее выполненное значение для «${kr.title}» (целевое значение: ${kr.target}):`);
    return;
  }

  // Ввод фактического значения
  if (userSession.state === STATES.AWAITING_PROGRESS_VALUE) {
    if (!isNonNegativeNumber(trimmedText)) {
      await reply('Значение должно быть числом (0 или больше). Попробуйте еще раз:');
      return;
    }

    const { goalId, krId } = userSession.data;
    const kr = updateProgress(userId, goalId, krId, trimmedText);
    const goal = getGoalById(userId, goalId);
    const goalProg = calculateGoalProgress(goal);
    const overallProg = calculateOverallProgress(userId);
    const krProg = calculateKrProgress(kr);

    resetUserState(userId);

    await reply(
      `✅ Прогресс обновлен!\n\n` +
      `Результат: «${kr.title}» — выполнено ${kr.current} из ${kr.target} (${krProg}%)\n` +
      `Прогресс цели «${goal.title}»: ${goalProg}%\n` +
      `Общий прогресс по всем целям: ${overallProg}%`
    );
    return;
  }

  // Состояние

  if (trimmedText === '/start') {
    await reply(
      '🎯 Привет! Я OkrBot — бот для отслеживания целей OKR.\n\n' +
      'Доступные команды:\n' +
      '/goals — список целей и их прогресс\n' +
      '/add_goal — добавить новую цель\n' +
      '/key_result — привязать ключевой результат к цели\n' +
      '/progress — обновить текущий прогресс\n' +
      '/cancel — отменить текущий пошаговый ввод'
    );
    return;
  }

  if (trimmedText === '/add_goal') {
    setUserState(userId, STATES.AWAITING_GOAL_TITLE);
    await reply('Введите название цели (или /cancel для отмены):');
    return;
  }

  if (trimmedText === '/goals') {
    const goals = getUserGoals(userId);

    if (goals.length === 0) {
      await reply('У вас пока нет добавленных целей.\nЧтобы создать цель, используйте команду /add_goal');
      return;
    }

    const overall = calculateOverallProgress(userId);
    let message = `🎯 Ваши цели (Общий прогресс: ${overall}%):\n\n`;

    goals.forEach((goal) => {
      const goalProg = calculateGoalProgress(goal);
      message += `${goal.id}. ${goal.title} (до ${goal.deadline}) — Прогресс: ${goalProg}%\n`;
      if (goal.keyResults.length === 0) {
        message += '   (нет ключевых результатов, добавьте через /key_result)\n';
      } else {
        goal.keyResults.forEach((kr) => {
          const krProg = calculateKrProgress(kr);
          message += `   ▫ ${kr.id}. ${kr.title}: выполнено ${kr.current} из ${kr.target} (${krProg}%)\n`;
        });
      }
    });

    message += '\nКоманды:\n/add_goal — новая цель\n/key_result — добавить KR\n/progress — обновить прогресс';
    await reply(message);
    return;
  }

  if (trimmedText === '/key_result') {
    const goals = getUserGoals(userId);
    if (goals.length === 0) {
      await reply('У вас пока нет целей. Сначала создайте цель через /add_goal');
      return;
    }

    let message = 'Выберите номер цели, к которой хотите добавить ключевой результат:\n\n';
    goals.forEach((g) => {
      message += `${g.id}. ${g.title}\n`;
    });
    message += '\n(Или /cancel для отмены)';

    setUserState(userId, STATES.AWAITING_KR_GOAL_ID);
    await reply(message);
    return;
  }

  if (trimmedText === '/progress') {
    const goals = getUserGoals(userId);
    if (goals.length === 0) {
      await reply('У вас пока нет целей. Сначала создайте цель через /add_goal');
      return;
    }

    const goalsWithKr = goals.filter((g) => g.keyResults.length > 0);
    if (goalsWithKr.length === 0) {
      await reply('У ваших целей еще нет ключевых результатов. Сначала добавьте их через /key_result');
      return;
    }

    let message = 'Выберите номер цели для обновления прогресса:\n\n';
    goalsWithKr.forEach((g) => {
      const prog = calculateGoalProgress(g);
      message += `${g.id}. ${g.title} (прогресс: ${prog}%)\n`;
    });
    message += '\n(Или /cancel для отмены)';

    setUserState(userId, STATES.AWAITING_PROGRESS_GOAL_ID);
    await reply(message);
    return;
  }

  await reply('Я не знаю такую команду. Используйте /goals или /start');
};

export default handleMessage;