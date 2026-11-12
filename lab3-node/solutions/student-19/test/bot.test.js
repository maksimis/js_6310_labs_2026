import { describe, test, expect, beforeEach } from '@jest/globals';
import { createHandlers } from '../src/bot/handlers.js';
import { FSM, STATES } from '../src/state/index.js';
import { ProviderRegistry } from '../src/providers/index.js';
import { MockProvider } from '../src/providers/mock.js';

function makeCtx({ fromId = 1, text = '' } = {}) {
  const replies = [];
  return {
    from: { id: fromId },
    message: { text },
    reply: async (msg) => {
      replies.push(msg);
      return { message_id: replies.length };
    },
    _replies: replies
  };
}

describe('Bot handlers', () => {
  let fsm;
  let registry;
  let handlers;

  beforeEach(() => {
    fsm = new FSM();
    registry = new ProviderRegistry();
    registry.register(new MockProvider());
    handlers = createHandlers(fsm, registry);
  });

  test('/start greets user', async () => {
    const ctx = makeCtx();
    await handlers.start(ctx);
    expect(ctx._replies[0]).toMatch(/Welcome/);
  });

  test('/chat without provider asks to select', async () => {
    const ctx = makeCtx();
    await handlers.chat(ctx);
    expect(fsm.getState('1').state).toBe(STATES.WAITING_FOR_PROVIDER);
    expect(ctx._replies[0]).toMatch(/providers/);
  });

  test('/chat with provider enters WAITING_FOR_MESSAGE', async () => {
    fsm.setState('1', STATES.IDLE, {
      activeProvider: 'mock',
      activeModel: 'mock-small'
    });
    const ctx = makeCtx();
    await handlers.chat(ctx);
    expect(fsm.getState('1').state).toBe(STATES.WAITING_FOR_MESSAGE);
  });

  test('/providers lists providers', async () => {
    const ctx = makeCtx();
    await handlers.listProviders(ctx);
    expect(ctx._replies[0]).toMatch(/mock/);
    expect(fsm.getState('1').state).toBe(STATES.WAITING_FOR_PROVIDER);
  });

  test('selects provider with single model', async () => {
    registry = new ProviderRegistry();
    const singleModelProvider = {
      name: 'single',
      getModels: () => ['only-model'],
      getStatus: () => 'available',
      chat: async (_m, msg) => `ok:${msg}`
    };
    registry.register(singleModelProvider);
    handlers = createHandlers(fsm, registry);

    const ctx1 = makeCtx();
    await handlers.listProviders(ctx1);
    const ctx2 = makeCtx({ text: '1' });
    await handlers.handleText(ctx2);
    expect(fsm.getState('1').state).toBe(STATES.IDLE);
    expect(fsm.getState('1').data.activeProvider).toBe('single');
    expect(fsm.getState('1').data.activeModel).toBe('only-model');
  });

  test('selects provider then model', async () => {
    const ctx1 = makeCtx();
    await handlers.listProviders(ctx1);
    const ctx2 = makeCtx({ text: '1' });
    await handlers.handleText(ctx2);
    expect(fsm.getState('1').state).toBe(STATES.WAITING_FOR_MODEL);

    const ctx3 = makeCtx({ text: '2' });
    await handlers.handleText(ctx3);
    expect(fsm.getState('1').state).toBe(STATES.IDLE);
    expect(fsm.getState('1').data.activeModel).toBe('mock-large');
  });

  test('invalid provider selection resets state', async () => {
    const ctx1 = makeCtx();
    await handlers.listProviders(ctx1);
    const ctx2 = makeCtx({ text: '99' });
    await handlers.handleText(ctx2);
    expect(fsm.getState('1').state).toBe(STATES.IDLE);
    expect(ctx2._replies[0]).toMatch(/Invalid/);
  });

  test('invalid model selection resets state', async () => {
    fsm.setState('1', STATES.WAITING_FOR_MODEL, {
      activeProvider: 'mock',
      models: ['mock-small']
    });
    const ctx = makeCtx({ text: 'abc' });
    await handlers.handleText(ctx);
    expect(fsm.getState('1').state).toBe(STATES.IDLE);
  });

  test('chat message returns reply', async () => {
    fsm.setState('1', STATES.WAITING_FOR_MESSAGE, {
      activeProvider: 'mock',
      activeModel: 'mock-small'
    });
    const ctx = makeCtx({ text: 'hello' });
    await handlers.handleText(ctx);
    expect(ctx._replies[0]).toContain('Echo: hello');
    expect(fsm.getState('1').state).toBe(STATES.IDLE);
  });

  test('empty chat message is rejected', async () => {
    fsm.setState('1', STATES.WAITING_FOR_MESSAGE, {
      activeProvider: 'mock',
      activeModel: 'mock-small'
    });
    const ctx = makeCtx({ text: '   ' });
    await handlers.handleText(ctx);
    expect(ctx._replies[0]).toMatch(/empty/);
    expect(fsm.getState('1').state).toBe(STATES.WAITING_FOR_MESSAGE);
  });

  test('text in IDLE state prompts user', async () => {
    const ctx = makeCtx({ text: 'random' });
    await handlers.handleText(ctx);
    expect(ctx._replies[0]).toMatch(/Unknown action/);
  });

  test('users have independent states', async () => {
    const ctxA = makeCtx({ fromId: 10 });
    const ctxB = makeCtx({ fromId: 20 });
    await handlers.listProviders(ctxA);
    await handlers.listProviders(ctxB);
    fsm.setState('10', STATES.WAITING_FOR_MESSAGE, {
      activeProvider: 'mock',
      activeModel: 'mock-small'
    });
    expect(fsm.getState('10').state).toBe(STATES.WAITING_FOR_MESSAGE);
    expect(fsm.getState('20').state).toBe(STATES.WAITING_FOR_PROVIDER);
  });
});