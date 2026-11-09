import { describe, test, expect, jest, beforeEach } from '@jest/globals';

let vkInstances = [];
let handlers = [];

jest.unstable_mockModule('vk-io', () => ({
  VK: jest.fn().mockImplementation(() => {
    const vk = {
      updates: {
        on: jest.fn((event, cb) => { handlers.push({ event, cb }); }),
        startPolling: jest.fn().mockResolvedValue({}),
      },
    };
    vkInstances.push(vk);
    return vk;
  }),
}));

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  arrayBuffer: async () => new ArrayBuffer(8),
});

const { default: runVkBot } = await import('../src/bots/vkBot.js');
const { VK } = await import('vk-io');

const getMessageHandler = () => handlers.find((h) => h.event === 'message_new').cb;

const makeContext = (overrides = {}) => ({
  isOutbox: false,
  senderId: 1,
  text: '',
  attachments: [],
  send: jest.fn().mockResolvedValue({}),
  loadMessagePayload: jest.fn().mockResolvedValue({}),
  ...overrides,
});

describe('vkBot', () => {
  beforeEach(() => {
    vkInstances = [];
    handlers = [];
    process.env.VK_GROUP_TOKEN = 'test-token';
    jest.clearAllMocks();
  });

  test('создаёт VK-инстанс, если токен задан', () => {
    runVkBot();
    expect(VK).toHaveBeenCalledWith({ token: 'test-token' });
    expect(vkInstances.length).toBe(1);
  });

  test('не создаёт VK, если токен пустой', () => {
    process.env.VK_GROUP_TOKEN = '';
    runVkBot();
    expect(vkInstances.length).toBe(0);
  });

  test('подписывается на message_new', () => {
    runVkBot();
    const events = vkInstances[0].updates.on.mock.calls.map((c) => c[0]);
    expect(events).toContain('message_new');
  });

  test('запускает polling', async () => {
    runVkBot();
    await new Promise((r) => setTimeout(r, 0));
    expect(vkInstances[0].updates.startPolling).toHaveBeenCalled();
  });

  test('игнорирует outbox-сообщения', async () => {
    runVkBot();
    const handler = getMessageHandler();
    const context = makeContext({ isOutbox: true });
    await handler(context);
    expect(context.send).not.toHaveBeenCalled();
    expect(context.loadMessagePayload).not.toHaveBeenCalled();
  });

  test('отвечает на /start', async () => {
    runVkBot();
    const handler = getMessageHandler();
    const context = makeContext({ text: '/start' });
    await handler(context);
    expect(context.send).toHaveBeenCalled();
    const textArg = context.send.mock.calls[0][0];
    expect(textArg).toMatch(/GalleryBot/);
  });

  test('обрабатывает фото: loadMessagePayload + скачивание + handleMessage', async () => {
    runVkBot();
    const handler = getMessageHandler();
    const context = makeContext({
      text: '/upload',
      attachments: [
        {
          type: 'photo',
          sizes: [
            { url: 'http://example.com/small.jpg' },
            { url: 'http://example.com/big.jpg' },
          ],
        },
      ],
    });

    // loadMessagePayload не меняет attachments — они уже полные в тесте
    await handler(context);

    expect(context.loadMessagePayload).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('http://example.com/big.jpg');
    const textArg = context.send.mock.calls.at(-1)[0];
    expect(textArg).toMatch(/Загружено/);
  });

  test('обрабатывает документ-картинку', async () => {
    runVkBot();
    const handler = getMessageHandler();
    const context = makeContext({
      text: '/upload',
      attachments: [{ type: 'doc', ext: 'png', url: 'http://example.com/x.png' }],
    });
    await handler(context);
    expect(global.fetch).toHaveBeenCalledWith('http://example.com/x.png');
    const textArg = context.send.mock.calls.at(-1)[0];
    expect(textArg).toMatch(/Загружено/);
  });

  test('игнорирует документ не-картинку', async () => {
    runVkBot();
    const handler = getMessageHandler();
    const context = makeContext({
      text: '/upload',
      attachments: [{ type: 'doc', ext: 'pdf', url: 'http://example.com/x.pdf' }],
    });
    await handler(context);
    const textArg = context.send.mock.calls.at(-1)[0];
    expect(textArg).toMatch(/Отправьте картинку/);
  });

  test('ловит ошибки скачивания и отвечает', async () => {
    runVkBot();
    const handler = getMessageHandler();
    global.fetch.mockRejectedValueOnce(new Error('network'));
    const context = makeContext({
      text: '/upload',
      attachments: [
        { type: 'photo', sizes: [{ url: 'http://example.com/x.jpg' }] },
      ],
    });
    await handler(context);
    const textArg = context.send.mock.calls.at(-1)[0];
    expect(textArg).toMatch(/Ошибка/);
  });
});