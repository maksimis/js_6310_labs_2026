export const STATES = {
  IDLE: 'IDLE',
  AWAITING_GOAL_TITLE: 'AWAITING_GOAL_TITLE',
  AWAITING_GOAL_DEADLINE: 'AWAITING_GOAL_DEADLINE',
  AWAITING_KR_GOAL_ID: 'AWAITING_KR_GOAL_ID',
  AWAITING_KR_TITLE: 'AWAITING_KR_TITLE',
  AWAITING_KR_TARGET: 'AWAITING_KR_TARGET',
  AWAITING_PROGRESS_GOAL_ID: 'AWAITING_PROGRESS_GOAL_ID',
  AWAITING_PROGRESS_KR_ID: 'AWAITING_PROGRESS_KR_ID',
  AWAITING_PROGRESS_VALUE: 'AWAITING_PROGRESS_VALUE',
};

const userStates = new Map();

export const getUserState = (userId) => {
  if (!userStates.has(userId)) {
    userStates.set(userId, { state: STATES.IDLE, data: {} });
  }
  return userStates.get(userId);
};

export const setUserState = (userId, state, data = {}) => {
  userStates.set(userId, { state, data });
};

export const resetUserState = (userId) => {
  userStates.set(userId, { state: STATES.IDLE, data: {} });
};

export const clearAllStates = () => {
  userStates.clear();
};