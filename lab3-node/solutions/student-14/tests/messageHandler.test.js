import { describe, test, expect } from '@jest/globals';
import { handleCommand } from '../src/handlers/messageHandler.js';

describe('handleCommand', () => {
  test('/start returns welcome', async () => {
    const res = await handleCommand('/start', 1);
    expect(res.success).toBe(true);
    expect(res.message).toContain('Привет');
  });

  test('/help returns help text', async () => {
    const res = await handleCommand('/help', 1);
    expect(res.message).toContain('/generate');
  });

  test('/generate easy creates a game', async () => {
    const res = await handleCommand('/generate easy', 100);
    expect(res.success).toBe(true);
    expect(res.state).toBe('playing');
  });

  test('/play without args returns hint', async () => {
    const res = await handleCommand('/play', 100);
    expect(res.success).toBe(false);
  });

  test('/play before generate returns error', async () => {
    const res = await handleCommand('/play a1 5', 200);
    expect(res.success).toBe(false);
  });

  test('/play with bad coord returns error', async () => {
    await handleCommand('/generate easy', 300);
    const res = await handleCommand('/play zz 5', 300);
    expect(res.success).toBe(false);
  });

  test('/check before generate returns error', async () => {
    const res = await handleCommand('/check', 400);
    expect(res.success).toBe(false);
  });

  test('unknown command returns help', async () => {
    const res = await handleCommand('/foo', 1);
    expect(res.message).toContain('/generate');
  });

  test('empty text returns empty message', async () => {
    const res = await handleCommand('', 1);
    expect(res.message).toBe('');
  });

  test('undefined text does not crash', async () => {
    const res = await handleCommand(undefined, 1);
    expect(res.success).toBe(false);
  });
});