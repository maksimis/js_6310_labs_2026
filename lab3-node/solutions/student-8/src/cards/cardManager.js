'use strict';

// У каждого пользователя (userId) будет свой массив с карточками
const userCards = new Map();
let nextId = 1;

export const LEVELS = {
  NEW: 'new',
  HARD: 'hard',
  LEARNED: 'learned'
};

// Вспомогательная функция: получает список карточек для конкретного пользователя
function getUserCards(userId) {
  if (!userCards.has(userId)) {
    userCards.set(userId, []);
  }
  return userCards.get(userId);
}

export function addCard(userId, word, translation) {
  if (!word || typeof word !== 'string' || !translation || typeof translation !== 'string') {
    throw new Error('Слово и перевод должны быть непустыми строками');
  }
  
  const cards = getUserCards(userId);
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

export function getAllCards(userId) {
  return getUserCards(userId).slice();
}

export function getCardById(userId, id) {
  return getUserCards(userId).find((c) => c.id === id);
}

export function updateCardLevel(userId, id, level) {
  const card = getCardById(userId, id);
  if (card) {
    card.level = level;
    const intervals = { new: 1, hard: 10, learned: 1440 };
    card.nextReview = Date.now() + (intervals[level] * 60000);
  }
  return card;
}

export function getCardsForReview(userId) {
  const now = Date.now();
  const cards = getUserCards(userId);
  const cardsToReview = cards.filter((c) => c.nextReview <= now);
  
  const levelWeight = { hard: 1, new: 2, learned: 3 };
  return cardsToReview.sort((a, b) => levelWeight[a.level] - levelWeight[b.level]);
}

export function getProgress(userId) {
  const cards = getUserCards(userId);
  const total = cards.length;
  const learned = cards.filter((c) => c.level === LEVELS.LEARNED).length;
  return { total, learned };
}

export function clearCards(userId) {
  userCards.set(userId, []);
}