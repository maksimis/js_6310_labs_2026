import { describe, test, expect, jest, beforeEach } from '@jest/globals';

let vkInstances = [];
let messageHandlers = [];

jest.unstable_mockModule('vk-io', () => ({
  VK: jest.fn().mockImplementation(() => {
    const vk = {
      updates: {
        on: jest.fn(),
        startPolling: jest.fn().mockResolvedValue({}),
      },
    };
    vk.updates.on.mockImplementation((event, cb) => { messageHandlers.push(cb); });
    vkInstances.push(vk);
    return vk;
  }),
}));

const { default: runVkBot } = await import('../src/bots/vkBot');

describe('runVkBot', () => {
  beforeEach(() => {
    process.env.VK_GROUP_TOKEN = 'test-token';
  });

  test('creates a VK instance and starts polling', async () => {
    const { VK } = await import('vk-io');
    runVkBot();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(VK).toHaveBeenCalled();
  });

  test('replies to /start through the registered handler', async () => {
    const vk = vkInstances[0];
    const context = { text: '/start', isOutbox: false, send: jest.fn().mockResolvedValue({}) };
    const cb = messageHandlers[0];
    await cb(context);
    expect(context.send).toHaveBeenCalledWith('Привет! Я твой первый бот!');
    expect(vk.updates.startPolling).toHaveBeenCalled();
  });

  test('ignores outbox messages to avoid an infinite loop', async () => {
    const context = { text: 'Привет! Я твой первый бот!', isOutbox: true, send: jest.fn().mockResolvedValue({}) };
    const cb = messageHandlers.find((h) => h.toString().includes('isOutbox'));
    await cb(context);
    expect(context.send).not.toHaveBeenCalled();
  });

  test('skips bot creation when token is missing', () => {
    process.env.VK_GROUP_TOKEN = '';
    const countBefore = vkInstances.length;
    runVkBot();
    expect(vkInstances.length).toBe(countBefore);
  });
});