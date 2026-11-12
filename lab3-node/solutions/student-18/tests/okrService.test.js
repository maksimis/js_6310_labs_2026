import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  getUserGoals,
  addGoal,
  getGoalById,
  addKeyResult,
  updateProgress,
  calculateKrProgress,
  calculateGoalProgress,
  calculateOverallProgress,
  clearAllGoals,
} from '../src/services/okrService.js';

describe('okrService', () => {
  beforeEach(() => {
    clearAllGoals();
  });

  test('returns empty goals array for new user', () => {
    const goals = getUserGoals(1);
    expect(goals).toEqual([]);
  });

  test('adds a goal for a user', () => {
    const goal = addGoal(1, 'Выучить Node.js', '31.12.2026');
    expect(goal).toEqual({
      id: 1,
      title: 'Выучить Node.js',
      deadline: '31.12.2026',
      keyResults: [],
    });
    expect(getUserGoals(1)).toHaveLength(1);
  });

  test('gets goal by id', () => {
    addGoal(1, 'Цель 1', '31.12.2026');
    const goal = getGoalById(1, 1);
    expect(goal).not.toBeNull();
    expect(goal.title).toBe('Цель 1');

    expect(getGoalById(1, 999)).toBeNull();
  });

  test('adds key result to a goal', () => {
    const goal = addGoal(1, 'Цель 1', '31.12.2026');
    const kr = addKeyResult(1, goal.id, 'Сдать 5 лаб', 5);
    expect(kr).toEqual({
      id: 1,
      title: 'Сдать 5 лаб',
      target: 5,
      current: 0,
    });
    expect(goal.keyResults).toHaveLength(1);

    expect(addKeyResult(1, 999, 'Несуществующая цель', 5)).toBeNull();
  });

  test('updates key result progress', () => {
    const goal = addGoal(1, 'Цель 1', '31.12.2026');
    const kr = addKeyResult(1, goal.id, 'Сдать 5 лаб', 5);

    const updated = updateProgress(1, goal.id, kr.id, 3);
    expect(updated.current).toBe(3);

    expect(updateProgress(1, 999, kr.id, 3)).toBeNull();
    expect(updateProgress(1, goal.id, 999, 3)).toBeNull();
  });

  test('calculates key result progress correctly', () => {
    expect(calculateKrProgress(null)).toBe(0);
    expect(calculateKrProgress({ target: 0, current: 0 })).toBe(0);
    expect(calculateKrProgress({ target: 10, current: 5 })).toBe(50);
    expect(calculateKrProgress({ target: 10, current: 15 })).toBe(100); // capped at 100%
  });

  test('calculates goal progress correctly', () => {
    expect(calculateGoalProgress(null)).toBe(0);

    const goal = addGoal(1, 'Цель 1', '31.12.2026');
    expect(calculateGoalProgress(goal)).toBe(0);

    addKeyResult(1, goal.id, 'KR 1', 10);
    addKeyResult(1, goal.id, 'KR 2', 10);
    updateProgress(1, goal.id, 1, 10); // 100%
    updateProgress(1, goal.id, 2, 5);  // 50%

    expect(calculateGoalProgress(goal)).toBe(75);
  });

  test('calculates overall progress across all goals', () => {
    expect(calculateOverallProgress(1)).toBe(0);

    const g1 = addGoal(1, 'Цель 1', '31.12.2026');
    const g2 = addGoal(1, 'Цель 2', '31.12.2026');

    addKeyResult(1, g1.id, 'KR 1', 10);
    updateProgress(1, g1.id, 1, 10); // g1 = 100%

    addKeyResult(1, g2.id, 'KR 2', 10);
    updateProgress(1, g2.id, 1, 0);  // g2 = 0%

    expect(calculateOverallProgress(1)).toBe(50);
  });
});
