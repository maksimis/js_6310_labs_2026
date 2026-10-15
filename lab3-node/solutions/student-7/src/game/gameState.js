import { GAME_STATES, DIFFICULTIES } from './constants.js';
import { generateSequence } from './gameLogic.js';

const games = new Map();

export const getGame = (userId) => {
  return games.get(userId) || null;
};

export const createGame = (userId, difficulty) => {
  const length = DIFFICULTIES[difficulty]?.length || 3;
  const game = {
    userId,
    difficulty,
    sequence: generateSequence(length),
    currentStep: 0,
    state: GAME_STATES.PLAYING,
    record: 0,
  };
  games.set(userId, game);
  return game;
};

export const updateGame = (userId, updates) => {
  const game = games.get(userId);
  if (game) {
    Object.assign(game, updates);
  }
  return game;
};

export const deleteGame = (userId) => {
  games.delete(userId);
};

export const setState = (userId, state) => {
  const game = games.get(userId);
  if (game) {
    game.state = state;
  } else {
    games.set(userId, {
      userId,
      state,
      difficulty: null,
      sequence: [],
      currentStep: 0,
      record: 0,
    });
  }
};

export const getAllGames = () => games;