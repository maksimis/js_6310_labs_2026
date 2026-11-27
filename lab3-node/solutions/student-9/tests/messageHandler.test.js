import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

process.env.TEST_DB_FILE = path.join(process.cwd(), 'habits.handler.test.json');

const { addHabit, checkHabit, getUserState, getUserHabits } = await import('../src/utils/storage.js');
const { default: handleMessage } = await import('../src/handlers/messageHandler.js');

describe('Message Handler Integration', () => {
  const userId = '12345';
  const testDbPath = process.env.TEST_DB_FILE;
  let mockReply;

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    mockReply = jest.fn();
  });

  afterEach(() => {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  });

  it('should respond to /start', async () => {
    await handleMessage('/start', userId, mockReply);
    expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('Привет! Я HabitBot'));
    expect(getUserState(userId).step).toBe('IDLE');
  });

  it('should handle /add_habit flow', async () => {
    await handleMessage('/add_habit', userId, mockReply);
    expect(getUserState(userId).step).toBe('WAITING_FOR_NAME');
    
    await handleMessage('Running', userId, mockReply);
    expect(getUserState(userId).step).toBe('WAITING_FOR_FREQUENCY');
    
    await handleMessage('1', userId, mockReply);
    expect(mockReply).toHaveBeenCalledWith('✅ Привычка "Running" добавлена!');
    expect(getUserState(userId).step).toBe('IDLE');
    expect(getUserHabits(userId)).toContain('Running');
  });

  it('should handle invalid frequency input', async () => {
    await handleMessage('/add_habit', userId, mockReply);
    await handleMessage('Gym', userId, mockReply);
    await handleMessage('invalid', userId, mockReply);
    
    expect(mockReply).toHaveBeenCalledWith('Пожалуйста, отправьте 1 или 2.');
    expect(getUserState(userId).step).toBe('WAITING_FOR_FREQUENCY');
  });

  it('should handle /check flow', async () => {
    addHabit(userId, 'Reading', 'daily');
    await handleMessage('/check', userId, mockReply);
    expect(getUserState(userId).step).toBe('WAITING_FOR_CHECK_NAME');
    
    await handleMessage('Reading', userId, mockReply);
    expect(mockReply).toHaveBeenCalledWith('✅ Привычка "Reading" отмечена на сегодня!');
    expect(getUserState(userId).step).toBe('IDLE');
  });

  it('should handle /progress flow', async () => {
    addHabit(userId, 'Meditation', 'daily');
    checkHabit(userId, 'Meditation');
    
    await handleMessage('/progress', userId, mockReply);
    expect(getUserState(userId).step).toBe('WAITING_FOR_PROGRESS_NAME');
    
    await handleMessage('Meditation', userId, mockReply);
    expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('📊 Прогресс: "Meditation"'));
    expect(getUserState(userId).step).toBe('IDLE');
  });

  it('should handle command during WAITING_FOR_NAME state', async () => {
    // Используем нового пользователя, чтобы гарантированно не было старых привычек
    const newUserId = '99999'; 
    
    await handleMessage('/start', newUserId, mockReply);
    mockReply.mockClear();
    
    await handleMessage('/add_habit', newUserId, mockReply);
    expect(getUserState(newUserId).step).toBe('WAITING_FOR_NAME');
    mockReply.mockClear();
    
    // Пользователь случайно вводит команду вместо названия привычки
    await handleMessage('/check', newUserId, mockReply);
    
    // Ожидаем IDLE, так как бот сбросил состояние при отсутствии привычек
    expect(getUserState(newUserId).step).toBe('IDLE');
    expect(mockReply).toHaveBeenLastCalledWith('У вас пока нет привычек. Добавьте через /add_habit.');
  });
});