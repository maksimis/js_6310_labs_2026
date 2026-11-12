export const COLORS = {
  red: '🔴',
  green: '🟢',
  blue: '🔵',
  yellow: '🟡',
};

export const COLOR_CODES = ['red', 'green', 'blue', 'yellow'];

export const DIFFICULTIES = {
  easy: { name: 'лёгкая', length: 3 },
  medium: { name: 'средняя', length: 5 },
  hard: { name: 'сложная', length: 8 },
};

export const COMMANDS = {
  START: '/start',
  NEW_GAME: '/new_game',
  SEQUENCE: '/sequence',
  GUESS: '/guess',
  HELP: '/help',
};

export const GAME_STATES = {
  IDLE: 'idle',
  CHOOSING_DIFFICULTY: 'choosing_difficulty',
  PLAYING: 'playing',
  GAME_OVER: 'game_over',
};