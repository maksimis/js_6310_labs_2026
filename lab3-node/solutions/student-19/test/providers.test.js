import { describe, test, expect, beforeEach } from '@jest/globals';
import { ProviderRegistry } from '../src/providers/index.js';
import { MockProvider } from '../src/providers/mock.js';

describe('ProviderRegistry', () => {
  let registry;
  let mockProvider;

  beforeEach(() => {
    registry = new ProviderRegistry();
    mockProvider = new MockProvider();
  });

  test('register adds provider', () => {
    registry.register(mockProvider);
    expect(registry.list()).toHaveLength(1);
  });

  test('register throws on invalid provider', () => {
    expect(() => registry.register(null)).toThrow();
    expect(() => registry.register({})).toThrow();
  });

  test('list returns all providers', () => {
    registry.register(mockProvider);
    const list = registry.list();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('mock');
  });

  test('get returns existing provider', () => {
    registry.register(mockProvider);
    expect(registry.get('mock')).toBe(mockProvider);
  });

  test('get throws for unknown provider', () => {
    expect(() => registry.get('unknown')).toThrow(/not found/);
  });

  test('getModels returns models of provider', () => {
    registry.register(mockProvider);
    expect(registry.getModels('mock')).toEqual(['mock-small', 'mock-large']);
  });

  test('chat returns response from provider', async () => {
    registry.register(mockProvider);
    const reply = await registry.chat('mock', 'mock-small', 'hi');
    expect(reply).toContain('Echo: hi');
  });

  test('chat throws for unknown model', async () => {
    registry.register(mockProvider);
    await expect(registry.chat('mock', 'no-such-model', 'hi')).rejects.toThrow(/not found/);
  });
});

describe('MockProvider', () => {
  test('has name and models', () => {
    const p = new MockProvider();
    expect(p.name).toBe('mock');
    expect(p.getModels()).toEqual(['mock-small', 'mock-large']);
    expect(p.getStatus()).toBe('available');
  });

  test('chat echoes message', async () => {
    const p = new MockProvider();
    const reply = await p.chat('mock-small', 'hello');
    expect(reply).toBe('[mock/mock-small] Echo: hello');
  });

  test('chat rejects empty message', async () => {
    const p = new MockProvider();
    await expect(p.chat('mock-small', '')).rejects.toThrow();
  });
  test('chat changes status to unavailable on error and recovers on success', async () => {
    const p = new MockProvider();

    // 1. Изначально статус available
    expect(p.getStatus()).toBe('available');

    // 2. Намеренно вызываем ошибку (пустое сообщение)
    await expect(p.chat('mock-small', '')).rejects.toThrow('Message must be a non-empty string');

    // 3. Проверяем, что статус изменился на unavailable (покрывает catch и setStatus)
    expect(p.getStatus()).toBe('unavailable');

    // 4. Делаем успешный запрос
    const reply = await p.chat('mock-small', 'hello');
    expect(reply).toBe('[mock/mock-small] Echo: hello');

    // 5. Проверяем, что статус восстановился (покрывает успешный путь и setStatus)
    expect(p.getStatus()).toBe('available');
  });
});