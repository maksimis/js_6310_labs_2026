// tests/models.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { Task, Board } from '../src/core/models.js';

describe('Task', () => {
  let task;

  beforeEach(() => {
    task = new Task('001', 'Тестовая задача');
  });

  it('должна корректно создаваться', () => {
    expect(task.id).toBe('001');
    expect(task.title).toBe('Тестовая задача');
    expect(task.status).toBe('To Do');
    expect(task.history).toEqual(['To Do']);
    expect(task.createdAt).toBeDefined();
  });

  it('должна перемещаться в новый статус', () => {
    task.moveTo('In Progress');
    expect(task.status).toBe('In Progress');
    expect(task.history).toEqual(['To Do', 'In Progress']);
  });

  it('должна считать шаги', () => {
    expect(task.getSteps()).toBe(0);
    task.moveTo('In Progress');
    expect(task.getSteps()).toBe(1);
    task.moveTo('Done');
    expect(task.getSteps()).toBe(2);
  });
});

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  it('должна создаваться с пустыми колонками', () => {
    expect(board.tasks).toEqual([]);
    expect(board.wipLimits['In Progress']).toBe(3);
  });

  it('должна добавлять задачи', () => {
    const task = new Task('001', 'Задача 1');
    board.addTask(task);
    expect(board.tasks.length).toBe(1);
  });

  it('должна фильтровать задачи по статусу', () => {
    const task1 = new Task('001', 'Задача 1');
    const task2 = new Task('002', 'Задача 2');
    task2.moveTo('In Progress');
    board.addTask(task1);
    board.addTask(task2);

    expect(board.getTasksByStatus('To Do').length).toBe(1);
    expect(board.getTasksByStatus('In Progress').length).toBe(1);
    expect(board.getTasksByStatus('Done').length).toBe(0);
  });

  it('должна находить задачу по ID', () => {
    const task = new Task('001', 'Задача 1');
    board.addTask(task);
    expect(board.findTaskById('001')).toBe(task);
    expect(board.findTaskById('999')).toBeUndefined();
  });

  it('должна проверять WIP лимит', () => {
    expect(board.canMoveTo('In Progress')).toBe(true);

    for (let i = 0; i < 3; i++) {
      const t = new Task(`00${i}`, `Задача ${i}`);
      t.moveTo('In Progress');
      board.addTask(t);
    }

    expect(board.canMoveTo('In Progress')).toBe(false);
  });

  it('должна перемещать задачу', () => {
    const task = new Task('001', 'Задача 1');
    board.addTask(task);
    const moved = board.moveTask('001', 'In Progress');
    expect(moved.status).toBe('In Progress');
  });

  it('должна выбрасывать ошибку при перемещении несуществующей задачи', () => {
    expect(() => board.moveTask('999', 'Done')).toThrow('Задача не найдена');
  });

  it('должна выбрасывать ошибку при перемещении в ту же колонку', () => {
    const task = new Task('001', 'Задача 1');
    board.addTask(task);
    expect(() => board.moveTask('001', 'To Do')).toThrow('Задача уже в этой колонке');
  });

  it('должна выбрасывать ошибку при превышении WIP', () => {
    for (let i = 0; i < 3; i++) {
      const t = new Task(`00${i}`, `Задача ${i}`);
      t.moveTo('In Progress');
      board.addTask(t);
    }
    const newTask = new Task('004', 'Новая задача');
    board.addTask(newTask);
    expect(() => board.moveTask('004', 'In Progress')).toThrow('Превышен лимит WIP');
  });

  it('должна возвращать текстовое состояние доски', () => {
    const task = new Task('001', 'Задача 1');
    board.addTask(task);
    const state = board.getBoardState();
    expect(state).toContain('To Do');
    expect(state).toContain('In Progress');
    expect(state).toContain('Done');
    expect(state).toContain('Задача 1');
  });

  it('должна показывать пусто для пустых колонок', () => {
    const state = board.getBoardState();
    expect(state).toContain('пусто');
  });
});