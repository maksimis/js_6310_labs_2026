import { VK } from 'vk-io';
import { createMessageHandler, UserFSM } from './messageHandler.js';

export function makeHandler(fsm) {
  const handler = createMessageHandler(fsm);
  return async (context) => {
    await handler(context);
  };
}

export function initVkBot(token, fsm = new UserFSM()) {
  const vk = new VK({ token });
  vk.updates.on('message_new', makeHandler(fsm));
  return vk;
}