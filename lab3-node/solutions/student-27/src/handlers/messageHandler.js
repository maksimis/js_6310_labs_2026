import {
  createSurvey,
  getSurveyByCode,
  getSurveyById,
  saveVote,
  getResults,
  getUserState,
  setUserState,
  clearUserState,
} from '../services/surveyService.js';

const handleMessage = async (text, reply, platform = 'unknown', userId = 'unknown') => {
  const trimmedText = text ? text.trim() : '';
  const { state, data } = getUserState(platform, userId);

  if (trimmedText === '/start') {
    clearUserState(platform, userId);
    await reply('Привет! Я SurveyBot. Команды: /create_survey, /vote, /results');
    return;
  }

  if (trimmedText === '/create_survey') {
    setUserState(platform, userId, 'CREATE_SURVEY_TOPIC', { questions: [] });
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

  if (state === 'CREATE_SURVEY_TOPIC') {
    setUserState(platform, userId, 'CREATE_SURVEY_QUESTION', { ...data, topic: trimmedText });
    await reply('Тема сохранена. Введите первый вопрос:');
    return;
  }

  if (state === 'CREATE_SURVEY_QUESTION') {
    setUserState(platform, userId, 'CREATE_SURVEY_OPTIONS', { ...data, currentQuestion: trimmedText });
    await reply('Введите варианты ответов через запятую:');
    return;
  }

  if (state === 'CREATE_SURVEY_OPTIONS') {
    const options = trimmedText.split(',').map((o) => o.trim()).filter((o) => o);
    if (options.length < 2) {
      await reply('Нужно минимум 2 варианта. Попробуйте снова:');
      return;
    }
    const newQuestions = [...data.questions, { question: data.currentQuestion, options }];
    const { id, code } = createSurvey(data.topic, newQuestions);
    clearUserState(platform, userId);
    await reply(`Опрос создан! ID: ${id}, Код: ${code}`);
    return;
  }

  if (state === 'VOTE_ENTER_CODE') {
    const survey = getSurveyByCode(trimmedText);
    if (!survey) {
      await reply('Опрос не найден. Попробуйте снова или /start');
      return;
    }
    setUserState(platform, userId, 'VOTE_ANSWERING', { surveyId: survey.id, currentQIndex: 0, answers: [] });
    await reply(`Вопрос 1: ${survey.questions[0].question}\nВарианты: ${survey.questions[0].options.join(', ')}`);
    return;
  }

  if (state === 'VOTE_ANSWERING') {
    const survey = getSurveyById(data.surveyId);
    if (!survey) {
      await reply('Ошибка: опрос не найден.');
      clearUserState(platform, userId);
      return;
    }

    const currentQuestion = survey.questions[data.currentQIndex];
    if (!currentQuestion.options.includes(trimmedText)) {
      await reply(`Пожалуйста, выберите один из вариантов: ${currentQuestion.options.join(', ')}`);
      return;
    }

    const newAnswers = [...data.answers, trimmedText];
    const nextQIndex = data.currentQIndex + 1;

    if (nextQIndex < survey.questions.length) {
      setUserState(platform, userId, 'VOTE_ANSWERING', { ...data, currentQIndex: nextQIndex, answers: newAnswers });
      const nextQ = survey.questions[nextQIndex];
      await reply(`Вопрос ${nextQIndex + 1}: ${nextQ.question}\nВарианты: ${nextQ.options.join(', ')}`);
    } else {
      const success = saveVote(survey.id, userId, newAnswers);
      clearUserState(platform, userId);
      if (success) {
        await reply('Спасибо! Ваш голос принят.');
      } else {
        await reply('Вы уже голосовали в этом опросе.');
      }
    }
    return;
  }

  if (state === 'RESULTS_ENTER_CODE') {
    const survey = getSurveyByCode(trimmedText);
    if (!survey) {
      await reply('Опрос с таким кодом не найден. Попробуйте снова или введите /start');
      return;
    }

    const results = getResults(survey.id);
    if (!results) {
      await reply('Не удалось получить результаты.');
      clearUserState(platform, userId);
      return;
    }

    let message = `Опрос: ${survey.topic}\n`;
    message += `Всего голосов: ${results.total}\n`;

    survey.questions.forEach((q, qIndex) => {
      message += `\nВопрос ${qIndex + 1}: ${q.question}\n`;
      const dist = results.distribution[qIndex] || {};
      Object.entries(dist).forEach(([option, percent]) => {
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