import handleMessage from '../src/handlers/messageHandler';
import { describe, test, expect, jest } from '@jest/globals';

describe('Message handler', () => {
  test('replies to /start', async () => {
    const reply = jest.fn();
    await handleMessage('/start', reply);
    expect(reply).toHaveBeenCalledWith('Привет! Я твой первый бот!');
  });

  test('echoes a text message', async () => {
    const reply = jest.fn();
    await handleMessage('hello', reply);
    expect(reply).toHaveBeenCalledWith('Вы сказали: "hello"');
  });

  test('ignores empty text', async () => {
    const reply = jest.fn();
    await handleMessage(undefined, reply);
    expect(reply).not.toHaveBeenCalled();
  });
});