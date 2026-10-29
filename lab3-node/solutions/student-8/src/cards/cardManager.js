'use strict';

const cards = [];
let nextId = 1;

export const LEVELS = {
  NEW: 'new',
  HARD: 'hard',
  LEARNED: 'learned'
};

export function addCard(word, translation) {
  if (!word || typeof word !== 'string' || !translation || typeof translation !== 'string') {
    throw new Error('Слово и перевод должны быть непустыми строками');
  }
  
  const card = {
    id: nextId++,
    word: word.trim(),
    translation: translation.trim(),
    level: LEVELS.NEW,
    nextReview: Date.now()
  };
  
  cards.push(card);
  return card;
}

export function getAllCards() {
  return cards.slice();
}

export function getCardById(id) {
  return cards.find((c) => c.id === id);
}

export function updateCardLevel(id, level) {
  const card = getCardById(id);
  if (card) {
    card.level = level;
    const intervals = { new: 1, hard: 10, learned: 1440 };
    card.nextReview = Date.now() + (intervals[level] * 60000);
  }
  return card;
}

export function getCardsForReview() {
  const now = Date.now();
  return cards.filter((c) => c.nextReview <= now);
}

export function getProgress() {
  const total = cards.length;
  const learned = cards.filter((c) => c.level === LEVELS.LEARNED).length;
  return { total, learned };
}

export function clearCards() {
  cards.length = 0;
  nextId = 1;
}