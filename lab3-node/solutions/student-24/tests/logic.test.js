import { describe, it, expect, beforeEach } from 'vitest';
import { Board, Task } from '../src/core/models.js';

describe('API Logic', () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  it('должен создавать задачу', () => {
    const task = new Task('001', 'API Test Task');
    board.addTask(task);

    expect(board.findTaskById('001')).toBeDefined();
    expect(board.findTaskById('001').title).toBe('API Test Task');
  });

  it('должен перемещать задачу', () => {
    board.addTask(new Task('001', 'API Test Task'));

    const moved = board.moveTask('001', 'In Progress');

    expect(moved.status).toBe('In Progress');
    expect(moved.getSteps()).toBe(1);
  });

  it('должен возвращать все задачи', () => {
    board.addTask(new Task('001', 'A'));
    board.addTask(new Task('002', 'B'));

    expect(board.tasks.length).toBe(2);
  });
});