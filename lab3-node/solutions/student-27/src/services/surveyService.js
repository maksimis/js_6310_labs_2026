const surveys = new Map();
const userStates = new Map();

let nextId = 1;

const generateCode = () => {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
};

export const createSurvey = (topic, questions) => {
  const id = nextId++;
  const code = generateCode();

  const survey = {
    id,
    code,
    topic,
    questions,
    votes: Object.create(null)
  };

  surveys.set(id, survey);

  return { id, code };
};

export const getSurveyByCode = (code) => {
  if (typeof code !== 'string') {
    return undefined;
  }

  const normalizedCode = code.trim().toUpperCase();

  return Array.from(surveys.values()).find(
    (survey) => survey.code === normalizedCode
  );
};

export const getSurveyById = (id) => {
  return surveys.get(Number(id));
};

export const saveVote = (surveyId, userId, answers) => {
  const survey = getSurveyById(surveyId);

  if (!survey) {
    return false;
  }

  const voterKey = String(userId);

  if (Object.hasOwn(survey.votes, voterKey)) {
    return false;
  }

  survey.votes[voterKey] = answers;

  return true;
};

export const getResults = (surveyId) => {
  const survey = getSurveyById(surveyId);

  if (!survey) {
    return null;
  }

  const total = Object.keys(survey.votes).length;
  const distribution = {};

  survey.questions.forEach((question, questionIndex) => {
    distribution[questionIndex] = {};

    question.options.forEach((option) => {
      distribution[questionIndex][option] = 0;
    });
  });

  Object.values(survey.votes).forEach((answers) => {
    answers.forEach((answer, questionIndex) => {
      if (
        Object.hasOwn(distribution, questionIndex) &&
          Object.hasOwn(distribution[questionIndex], answer)
      ) {
        distribution[questionIndex][answer]++;
      }
    });
  });

  const distributionPercent = {};

  Object.keys(distribution).forEach((questionIndex) => {
    distributionPercent[questionIndex] = {};

    Object.keys(distribution[questionIndex]).forEach((option) => {
      const count = distribution[questionIndex][option];

      distributionPercent[questionIndex][option] = total > 0
        ? Math.round((count / total) * 100)
        : 0;
    });
  });

  return {
    total,
    distribution: distributionPercent
  };
};

export const getUserState = (platform, userId) => {
  return userStates.get(`${platform}_${userId}`) || {
    state: 'IDLE',
    data: {}
  };
};

export const setUserState = (
  platform,
  userId,
  state,
  data = {}
) => {
  userStates.set(`${platform}_${userId}`, {
    state,
    data
  });
};

export const clearUserState = (platform, userId) => {
  userStates.delete(`${platform}_${userId}`);
};

export const _resetStore = () => {
  surveys.clear();
  userStates.clear();
  nextId = 1;
};