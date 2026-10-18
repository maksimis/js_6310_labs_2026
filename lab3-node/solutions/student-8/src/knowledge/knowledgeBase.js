'use strict';

// Хранилище фрагментов базы знаний
const fragments = [];

// Счётчик для уникальных id
let nextId = 1;

// Добавить фрагмент в базу
export function addFragment(title, content) {
  if (!title || typeof title !== 'string') {
    throw new Error('title обязателен и должен быть строкой');
  }
  if (!content || typeof content !== 'string') {
    throw new Error('content обязателен и должен быть строкой');
  }

  const fragment = {
    id: nextId++,
    title: title.trim(),
    content: content.trim()
  };

  fragments.push(fragment);
  return fragment;
}

// Получить все фрагменты
export function getAllFragments() {
  return fragments.slice();
}

// Получить один фрагмент по id
export function getFragmentById(id) {
  return fragments.find((f) => f.id === id);
}

// Разбить текст на слова (приводим к нижнему регистру, убираем знаки препинания)
function tokenize(text) {
  return text
      .toLowerCase()
      .replace(/[^\wа-яё\s]/gi, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 1);
}

// Поиск фрагментов по запросу с расчётом релевантности
export function searchFragments(query) {
  if (!query || typeof query !== 'string') {
    return [];
  }

  const queryWords = tokenize(query);
  if (queryWords.length === 0) {
    return [];
  }

  const results = fragments.map((fragment) => {
    const fragmentWords = tokenize(fragment.title + ' ' + fragment.content);
    const matchedWords = queryWords.filter((qw) => fragmentWords.includes(qw));
    const relevance = matchedWords.length / queryWords.length;

    return {
      id: fragment.id,
      title: fragment.title,
      content: fragment.content,
      relevance: Math.round(relevance * 100) / 100
    };
  });

  // Оставляем только те, где есть хоть какое-то совпадение
  // Сортируем по убыванию релевантности
  return results
      .filter((r) => r.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);
}

// Очистить базу (нужно для тестов)
export function clearFragments() {
  fragments.length = 0;
  nextId = 1;
}