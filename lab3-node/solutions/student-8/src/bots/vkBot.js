'use strict';

import { VK } from 'vk-io';
import dotenv from 'dotenv';
import handleMessage from '../handlers/messageHandler.js';

dotenv.config();

const runVkBot = () => {
  const token = process.env.VK_GROUP_TOKEN;
  const groupId = Number(process.env.VK_GROUP_ID);

  if (!token) {
    console.log('VK_GROUP_TOKEN не задан — VK-бот пропущен');
    return null;
  }

  if (!groupId) {
    console.log('VK_GROUP_ID не задан — VK-бот пропущен');
    return null;
  }

  // Создаём экземпляр VK API
  const vk = new VK({ token });

  // Обрабатываем все входящие сообщения
  vk.updates.on('message_new', async (context) => {
    // Пропускаем сообщения, отправленные самим ботом
    if (context.isOutbox) {
      return;
    }

    // Не обрабатываем сообщения из бесед (только личка)
    if (context.isChat) {
      return;
    }

    try {
      const userId = context.senderId;
      const text = context.text || '';

      // Обёртка над reply — отправляем сообщение от лица бота
      const reply = (message) => context.send(message);

      await handleMessage(userId, text, reply);
    } catch (error) {
      console.error('Ошибка обработки сообщения:', error.message);
      try {
        await context.send('Произошла ошибка при обработке сообщения. Попробуйте позже.');
      } catch (sendError) {
        console.error('Не удалось отправить сообщение об ошибке:', sendError.message);
      }
    }
  });

  // Запускаем Long Poll
  vk.updates
      .startPolling()
      .then(() => {
        console.log('VK-бот запущен...');
      })
      .catch((error) => {
        console.error('Ошибка запуска VK-бота:', error.message);
      });

  return vk;
};

export default runVkBot;