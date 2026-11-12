import { beforeEach, describe, expect, jest, test } from '@jest/globals';

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
    vk.updates.on.mockImplementation((event, cb) => {
      messageHandlers.push(cb);
    });
    vkInstances.push(vk);
    return vk;
  }),
}));

const { default: runVkBot } = await import('../src/bots/vkBot.js');

describe('runVkBot', () => {
  beforeEach(() => {
    vkInstances = [];
    messageHandlers = [];
    process.env.VK_GROUP_TOKEN = 'test-token';
  });

  test('creates a VK instance and starts polling', async () => {
    const { VK } = await import('vk-io');
    runVkBot();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(VK).toHaveBeenCalled();
  });

  test('skips bot creation when token is missing', () => {
    process.env.VK_GROUP_TOKEN = '';
    const result = runVkBot();
    expect(result).toBeNull();
  });

  test('registers message_new handler', async () => {
    runVkBot();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const vk = vkInstances[vkInstances.length - 1];
    expect(vk.updates.on).toHaveBeenCalledWith('message_new', expect.any(Function));
    expect(vk.updates.startPolling).toHaveBeenCalled();
  });

  test('ignores outbox messages', async () => {
    runVkBot();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const handler = messageHandlers[messageHandlers.length - 1];
    const context = {
      isOutbox: true,
      text: 'test',
      senderId: 1,
      send: jest.fn(),
    };

    await handler(context);
    expect(context.send).not.toHaveBeenCalled();
  });

  test('dispatches non-outbox message to handler', async () => {
    runVkBot();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const handler = messageHandlers[messageHandlers.length - 1];
    const context = {
      isOutbox: false,
      text: '/start',
      senderId: 42,
      send: jest.fn().mockResolvedValue({}),
    };

    await handler(context);
    expect(context.send).toHaveBeenCalled();
  });

  test('handles startPolling error gracefully', async () => {
    const { VK } = await import('vk-io');
    VK.mockImplementationOnce(() => {
      const vk = {
        updates: {
          on: jest.fn(),
          startPolling: jest.fn().mockRejectedValue(new Error('network error')),
        },
      };
      vkInstances.push(vk);
      return vk;
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    runVkBot();
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Ошибка VK-бота:',
      'network error',
    );
    consoleErrorSpy.mockRestore();
  });
});