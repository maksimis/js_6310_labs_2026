import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

// Уникальное имя файла для этого теста
process.env.TEST_DB_FILE = path.join(process.cwd(), 'habits.storage.test.json');

const { addHabit, checkHabit, getProgress, getUserHabits, getUserState, setUserState } = await import('../src/utils/storage.js');

describe('Storage Module', () => {
  const mockUserId = '12345';
  const testDbPath = process.env.TEST_DB_FILE;

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  });

  afterEach(() => {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  });

  it('should manage state correctly', () => {
    setUserState(mockUserId, 'WAITING', { temp: 'test' });
    expect(getUserState(mockUserId)).toEqual({ step: 'WAITING', data: { temp: 'test' } });
  });

  it('should add a habit and retrieve it', () => {
    expect(addHabit(mockUserId, 'Running', 'daily')).toBe(true);
    expect(getUserHabits(mockUserId)).toContain('Running');
  });

  it('should mark habit as done and calculate streak', () => {
    addHabit(mockUserId, 'Running', 'daily');
    expect(checkHabit(mockUserId, 'Running')).toBe(true);
    
    const progress = getProgress(mockUserId, 'Running');
    expect(progress.isDoneToday).toBe(true);
    expect(progress.streak).toBe(1);
  });

  it('should return false if habit does not exist', () => {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    expect(checkHabit('99999', 'Running')).toBe(false);
  });
});