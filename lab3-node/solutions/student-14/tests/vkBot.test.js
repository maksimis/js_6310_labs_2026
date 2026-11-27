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

const { default: runVkBot } = await import('../src/bots/vkBot.js');

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

  test('handler replies to /start', async () => {
    runVkBot();
    const context = {
      text: '/start',
      isOutbox: false,
      senderId: 42,
      send: jest.fn().mockResolvedValue({}),
    };
    const cb = messageHandlers[messageHandlers.length - 1];
    await cb(context);
    expect(context.send).toHaveBeenCalled();
  });

  test('skips outbox messages', async () => {
    const context = {
      text: 'hi',
      isOutbox: true,
      senderId: 42,
      send: jest.fn(),
    };
    const cb = messageHandlers[messageHandlers.length - 1];
    await cb(context);
    expect(context.send).not.toHaveBeenCalled();
  });

  test('skips bot creation when token missing', () => {
    process.env.VK_GROUP_TOKEN = '';
    const countBefore = vkInstances.length;
    runVkBot();
    expect(vkInstances.length).toBe(countBefore);
  });
});