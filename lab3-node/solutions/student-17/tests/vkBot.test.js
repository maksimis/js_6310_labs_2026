import { createBot, runVkBot, Storage } from '../src/bots/vkBot.js';

describe('vkBot module', () => {
  it('exports createBot', () => {
    expect(typeof createBot).toBe('function');
  });

  it('exports runVkBot', () => {
    expect(typeof runVkBot).toBe('function');
  });

  it('exports Storage', () => {
    expect(typeof Storage).toBe('function');
  });
});