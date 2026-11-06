import { describe, test, expect, jest, beforeEach } from '@jest/globals';

let vkInstances = [];

jest.unstable_mockModule('vk-io', () => ({
  VK: jest.fn().mockImplementation(() => {
    const handlers = new Map();

    const vk = {
      handlers,
      updates: {
        on: jest.fn((event, callback) => {
          handlers.set(event, callback);
        }),
        startPolling: jest.fn().mockResolvedValue({})
      }
    };

    vkInstances.push(vk);
    return vk;
  })
}));

const { default: runVkBot } = await import(
  '../src/bots/vkBot.js'
);

const { VK } = await import('vk-io');

describe('runVkBot', () => {
  beforeEach(() => {
    vkInstances = [];
    jest.clearAllMocks();
    process.env.VK_GROUP_TOKEN = 'test-token';
  });

  test('creates VK bot and starts polling', () => {
    const vk = runVkBot();

    expect(VK).toHaveBeenCalled();
    expect(vk.updates.startPolling).toHaveBeenCalled();
  });

  test('replies to /start', async () => {
    const vk = runVkBot();

    const context = {
      text: '/start',
      isOutbox: false,
      senderId: 1,
      send: jest.fn().mockResolvedValue({})
    };

    await vk.handlers.get('message_new')(context);

    expect(context.send).toHaveBeenCalledWith(
      expect.stringContaining('SurveyBot')
    );
  });

  test('ignores outgoing messages', async () => {
    const vk = runVkBot();

    const context = {
      text: '/start',
      isOutbox: true,
      send: jest.fn()
    };

    await vk.handlers.get('message_new')(context);

    expect(context.send).not.toHaveBeenCalled();
  });

  test('catches errors while sending replies', async () => {
    const vk = runVkBot();

    const context = {
      text: '/start',
      isOutbox: false,
      senderId: 1,
      send: jest.fn().mockRejectedValue(
        new Error('VK API error')
      )
    };

    const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

    try {
      await expect(
        vk.handlers.get('message_new')(context)
      ).resolves.toBeUndefined();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Ошибка обработки сообщения VK:',
        expect.any(Error)
      );
    } finally {
      consoleSpy.mockRestore();
    }
  });

  test('skips VK bot without token', () => {
    process.env.VK_GROUP_TOKEN = '';

    expect(runVkBot()).toBeUndefined();
    expect(vkInstances).toHaveLength(0);
  });
});