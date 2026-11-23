import { STATES } from './states.js';

const userStates = new Map();

export const getState = (userId) =>
  userStates.get(userId) ?? { state: STATES.IDLE, context: {} };

export const setState = (userId, state, context = {}) =>
  userStates.set(userId, { state, context });

export const resetState = (userId) =>
  userStates.set(userId, { state: STATES.IDLE, context: {} });

export const clearAllStates = () => userStates.clear();