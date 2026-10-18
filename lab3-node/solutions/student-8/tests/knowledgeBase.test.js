import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  addFragment,
  getAllFragments,
  getFragmentById,
  searchFragments,
  clearFragments
} from '../src/knowledge/knowledgeBase.js';

describe('knowledgeBase', () => {
  beforeEach(() => {
    clearFragments();
  });

  describe('addFragment', () => {
    test('добавляет фрагмент и возвращает его с id', () => {
      const fragment = addFragment('JavaScript', 'Язык программирования');

      expect(fragment.id).toBe(1);
      expect(fragment.title).toBe('JavaScript');
      expect(fragment.content).toBe('Язык программирования');
    });

    test('присваивает уникальные id', () => {
      addFragment('Первый', 'Текст 1');
      const second = addFragment('Второй', 'Текст 2');

      expect(second.id).toBe(2);
    });

    test('обрезает пробелы в title и content', () => {
      const fragment = addFragment('  Python  ', '  Язык  ');

      expect(fragment.title).toBe('Python');
      expect(fragment.content).toBe('Язык');
    });

    test('бросает ошибку при пустом title', () => {
      expect(() => addFragment('', 'контент')).toThrow();
      expect(() => addFragment(null, 'контент')).toThrow();
    });

    test('бросает ошибку при пустом content', () => {
      expect(() => addFragment('заголовок', '')).toThrow();
      expect(() => addFragment('заголовок', null)).toThrow();
    });
  });

  describe('getAllFragments', () => {
    test('возвращает пустой массив в начале', () => {
      expect(getAllFragments()).toEqual([]);
    });

    test('возвращает все добавленные фрагменты', () => {
      addFragment('A', 'aaa');
      addFragment('B', 'bbb');

      expect(getAllFragments()).toHaveLength(2);
    });

    test('возвращает копию массива, а не оригинал', () => {
      addFragment('A', 'aaa');
      const list = getAllFragments();
      list.push({ id: 99, title: 'fake', content: 'fake' });

      expect(getAllFragments()).toHaveLength(1);
    });
  });

  describe('getFragmentById', () => {
    test('находит фрагмент по id', () => {
      addFragment('JavaScript', 'Язык');

      const found = getFragmentById(1);
      expect(found.title).toBe('JavaScript');
    });

    test('возвращает undefined для несуществующего id', () => {
      expect(getFragmentById(999)).toBeUndefined();
    });
  });

  describe('searchFragments', () => {
    beforeEach(() => {
      addFragment('JavaScript', 'Язык программирования для веба');
      addFragment('Python', 'Язык для анализа данных');
      addFragment('HTML', 'Язык разметки');
    });

    test('находит фрагмент по ключевому слову', () => {
      const results = searchFragments('javascript');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('JavaScript');
    });

    test('возвращает relevance больше 0', () => {
      const results = searchFragments('javascript');

      expect(results[0].relevance).toBeGreaterThan(0);
    });

    test('сортирует по релевантности по убыванию', () => {
      const results = searchFragments('язык программирования');

      expect(results.length).toBeGreaterThan(0);
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].relevance).toBeGreaterThanOrEqual(results[i].relevance);
      }
    });

    test('возвращает пустой массив для пустого запроса', () => {
      expect(searchFragments('')).toEqual([]);
      expect(searchFragments(null)).toEqual([]);
    });

    test('возвращает пустой массив, если ничего не найдено', () => {
      const results = searchFragments('квантоваяфизикаxyz');

      expect(results).toEqual([]);
    });

    test('не чувствителен к регистру', () => {
      const lower = searchFragments('python');
      const upper = searchFragments('PYTHON');

      expect(lower).toHaveLength(1);
      expect(upper).toHaveLength(1);
    });
  });

  describe('clearFragments', () => {
    test('очищает базу', () => {
      addFragment('A', 'aaa');
      addFragment('B', 'bbb');

      clearFragments();

      expect(getAllFragments()).toEqual([]);
    });

    test('сбрасывает счётчик id', () => {
      addFragment('A', 'aaa');
      clearFragments();

      const fragment = addFragment('B', 'bbb');
      expect(fragment.id).toBe(1);
    });
  });
});