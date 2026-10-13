import { describe, test, expect, jest } from '@jest/globals';
import handleMessage from '../src/handlers/messageHandler.js';

describe('Message handler', () => {
  test('replies to /start', async () => {
    const reply = jest.fn();
    await handleMessage('/start', reply);
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('Breakout'));
  });

  test('replies to /levels and completes level', async () => {
    const reply = jest.fn();
    const msg = { chat: { id: 10 } };
    await handleMessage('/levels', msg, reply);
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('Уровни игры'));

    await handleMessage('/complete 1', msg, reply);
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('успешно отмечен'));
  });

  test('replies to /hint with markdown layout', async () => {
    const reply = jest.fn();
    await handleMessage('/hint', reply);
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('Расположение блоков'), { parse_mode: 'Markdown' });
  });

  test('handles /physics with markdown response', async () => {
    const reply = jest.fn();
    const msg = { chat: { id: 20 } };
    await handleMessage('/physics', msg, reply);
    await handleMessage('45 10', msg, reply);
    expect(reply).toHaveBeenCalledWith(expect.stringContaining('Механика'), { parse_mode: 'Markdown' });
  });

  test('handles echo without markdown options', async () => {
    const reply = jest.fn();
    await handleMessage('привет_мир', reply);
    expect(reply).toHaveBeenCalledWith('Вы сказали: "привет_мир"');
  });
});