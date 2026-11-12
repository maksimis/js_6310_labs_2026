import { initVkBot, makeHandler } from '../src/vkBot.js';
import { UserFSM } from '../src/messageHandler.js';

describe('vkBot', () => {
  it('создаёт экземпляр VK с переданным токеном', () => {
    const fsm = new UserFSM();
    const vk = initVkBot('dummy_token_for_test', fsm);
    expect(vk).toBeTruthy();
    expect(vk.updates).toBeTruthy();
  });

  it('подписывается на событие message_new', () => {
    const fsm = new UserFSM();
    const vk = initVkBot('dummy_token_for_test', fsm);
    expect(typeof vk.updates.on).toBe('function');
  });

  it('использует переданный FSM', () => {
    const fsm = new UserFSM();
    const vk = initVkBot('dummy_token_for_test', fsm);
    expect(vk).toBeTruthy();
    expect(fsm.size()).toBe(0);
  });

  it('создаёт FSM по умолчанию, если не передан', () => {
    const vk = initVkBot('dummy_token_for_test');
    expect(vk).toBeTruthy();
  });
});

describe('makeHandler', () => {
  it('возвращает функцию-обработчик', () => {
    const fsm = new UserFSM();
    const handler = makeHandler(fsm);
    expect(typeof handler).toBe('function');
  });

  it('обрабатывает /start через makeHandler', async () => {
    const fsm = new UserFSM();
    const handler = makeHandler(fsm);
    const sent = [];
    const context = {
      senderId: 1,
      text: '/start',
      send: async (msg) => sent.push(msg)
    };
    await handler(context);
    expect(sent.length).toBeGreaterThan(0);
    expect(fsm.get(1).state).toBe('idle');
  });

  it('обрабатывает /stats через makeHandler', async () => {
    const fsm = new UserFSM();
    const handler = makeHandler(fsm);
    const sent = [];
    const context = {
      senderId: 2,
      text: '/stats',
      send: async (msg) => sent.push(msg)
    };
    await handler(context);
    expect(sent.length).toBeGreaterThan(0);
  });
});