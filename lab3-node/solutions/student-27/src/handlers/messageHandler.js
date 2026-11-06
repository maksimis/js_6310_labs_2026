import {
  createSurvey,
  getSurveyByCode,
  getSurveyById,
  saveVote,
  getResults,
  getUserState,
  setUserState,
  clearUserState
} from '../services/surveyService.js';

const handleMessage = async (
  text,
  reply,
  platform = 'unknown',
  userId = 'unknown'
) => {
  const trimmedText = typeof text === 'string'
    ? text.trim()
    : '';

  const { state, data } = getUserState(platform, userId);

  if (trimmedText === '/start') {
    clearUserState(platform, userId);

    await reply(
      'Привет! Я SurveyBot. Команды: /create_survey, /vote, /results'
    );

    return;
  }

  if (trimmedText === '/create_survey') {
    setUserState(
      platform,
      userId,
      'CREATE_SURVEY_TOPIC',
      { questions: [] }
    );

    await reply('Введите тему опроса:');
    return;
  }

  if (trimmedText === '/vote') {
    setUserState(platform, userId, 'VOTE_ENTER_CODE', {});

    await reply('Введите код опроса:');
    return;
  }

  if (trimmedText === '/results') {
    setUserState(platform, userId, 'RESULTS_ENTER_CODE', {});

    await reply('Введите код опроса:');
    return;
  }

  // Неизвестные команды не сохраняются как данные
  if (trimmedText.startsWith('/')) {
    await reply('Неизвестная команда. Введите /start.');
    return;
  }

  // Создание опроса: тема
  if (state === 'CREATE_SURVEY_TOPIC') {
    if (!trimmedText) {
      await reply('Тема не может быть пустой. Введите тему опроса:');
      return;
    }

    setUserState(platform, userId, 'CREATE_SURVEY_QUESTION', {
      ...data,
      topic: trimmedText
    });

    await reply('Тема сохранена. Введите первый вопрос:');
    return;
  }

  // Создание опроса: вопрос
  if (state === 'CREATE_SURVEY_QUESTION') {
    if (!trimmedText) {
      await reply('Вопрос не может быть пустым. Введите вопрос:');
      return;
    }

    setUserState(platform, userId, 'CREATE_SURVEY_OPTIONS', {
      ...data,
      currentQuestion: trimmedText
    });

    await reply('Введите варианты ответов через запятую:');
    return;
  }

  // Создание опроса: варианты ответов
  if (state === 'CREATE_SURVEY_OPTIONS') {
    const options = trimmedText
        .split(',')
        .map((option) => option.trim())
        .filter(Boolean);

    if (options.length < 2) {
      await reply('Нужно минимум 2 варианта. Попробуйте снова:');
      return;
    }

    const questions = [
      ...data.questions,
      {
        question: data.currentQuestion,
        options
      }
    ];

    const { id, code } = createSurvey(data.topic, questions);

    clearUserState(platform, userId);

    await reply(`Опрос создан! ID: ${id}, Код: ${code}`);
    return;
  }

  // Голосование: ввод кода
  if (state === 'VOTE_ENTER_CODE') {
    const survey = getSurveyByCode(trimmedText);

    if (!survey) {
      await reply('Опрос не найден. Попробуйте снова или /start');
      return;
    }

    setUserState(platform, userId, 'VOTE_ANSWERING', {
      surveyId: survey.id,
      currentQIndex: 0,
      answers: []
    });

    await reply(
      `Вопрос 1: ${survey.questions[0].question}\n` +
        `Варианты: ${survey.questions[0].options.join(', ')}`
    );

    return;
  }

  // Голосование: ответы на вопросы
  if (state === 'VOTE_ANSWERING') {
    const survey = getSurveyById(data.surveyId);

    if (!survey) {
      clearUserState(platform, userId);
      await reply('Ошибка: опрос не найден.');
      return;
    }

    const currentQuestion = survey.questions[data.currentQIndex];

    if (!currentQuestion.options.includes(trimmedText)) {
      await reply(
        `Пожалуйста, выберите один из вариантов: ${currentQuestion.options.join(', ')}`
      );
      return;
    }

    const answers = [...data.answers, trimmedText];
    const nextQIndex = data.currentQIndex + 1;

    if (nextQIndex < survey.questions.length) {
      setUserState(platform, userId, 'VOTE_ANSWERING', {
        ...data,
        currentQIndex: nextQIndex,
        answers
      });

      const nextQuestion = survey.questions[nextQIndex];

      await reply(
        `Вопрос ${nextQIndex + 1}: ${nextQuestion.question}\n` +
          `Варианты: ${nextQuestion.options.join(', ')}`
      );

      return;
    }

    const success = saveVote(
      survey.id,
      `${platform}_${userId}`,
      answers
    );

    clearUserState(platform, userId);

    if (success) {
      await reply('Спасибо! Ваш голос принят.');
    } else {
      await reply('Вы уже голосовали в этом опросе.');
    }

    return;
  }

  // Просмотр результатов
  if (state === 'RESULTS_ENTER_CODE') {
    const survey = getSurveyByCode(trimmedText);

    if (!survey) {
      await reply(
        'Опрос с таким кодом не найден. Попробуйте снова или введите /start'
      );
      return;
    }

    const results = getResults(survey.id);

    if (!results) {
      clearUserState(platform, userId);
      await reply('Не удалось получить результаты.');
      return;
    }

    let message = `Опрос: ${survey.topic}\n`;
    message += `Всего голосов: ${results.total}\n`;

    survey.questions.forEach((question, questionIndex) => {
      message += `\nВопрос ${questionIndex + 1}: ${question.question}\n`;

      const distribution = results.distribution[questionIndex] || {};

      Object.entries(distribution).forEach(([option, percent]) => {
        message += `  ${option}: ${percent}%\n`;
      });
    });

    clearUserState(platform, userId);

    await reply(message);
    return;
  }

  await reply('Неизвестная команда. Введите /start.');
};

export default handleMessage;