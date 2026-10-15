import { COLORS, COLOR_CODES, DIFFICULTIES } from './constants.js';

export const generateSequence = (length) => {
  const sequence = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * COLOR_CODES.length);
    sequence.push(COLOR_CODES[randomIndex]);
  }
  return sequence;
};

export const getSequenceText = (sequence) => {
  return sequence.map((color) => COLORS[color]).join(' ');
};

export const checkGuess = (sequence, guess) => {
  const normalizedGuess = String(guess).toLowerCase().trim();
  return COLOR_CODES.includes(normalizedGuess);
};

export const getDifficultyLength = (difficulty) => {
  return DIFFICULTIES[difficulty]?.length || 0;
};