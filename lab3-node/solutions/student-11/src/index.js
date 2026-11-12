import 'dotenv/config';
import { VK } from 'vk-io';
import { GameManager, GameState } from './gameManager.js';

const vk = new VK({ token: process.env.VK_TOKEN });

if (!process.env.VK_TOKEN) {
  console.error('❌ Ошибка: Токен не найден! Проверь файл .env');
  process.exit(1);
}

const gameManager = new GameManager();

function createGameKeyboard() {
  return JSON.stringify({
    one_time: false,
    inline: false,
    buttons: [
      [
        {
          action: { type: 'text', label: '⬆️ Вверх', payload: JSON.stringify({ command: 'up' }) },
          color: 'primary'
        }
      ],
      [
        {
          action: { type: 'text', label: '⬅️ Влево', payload: JSON.stringify({ command: 'left' }) },
          color: 'secondary'
        },
        {
          action: { type: 'text', label: '️ Вниз', payload: JSON.stringify({ command: 'down' }) },
          color: 'secondary'
        },
        {
          action: { type: 'text', label: '➡️ Вправо', payload: JSON.stringify({ command: 'right' }) },
          color: 'secondary'
        }
      ],
      [
        {
          action: { type: 'text', label: '↩️ Отмена', payload: JSON.stringify({ command: 'undo' }) },
          color: 'negative'
        },
        {
          action: { type: 'text', label: '🔄 Новая игра', payload: JSON.stringify({ command: 'new_game' }) },
          color: 'positive'
        }
      ]
    ]
  });
}

function createGameOverKeyboard() {
  return JSON.stringify({
    one_time: false,
    inline: false,
    buttons: [
      [
        {
          action: { type: 'text', label: '🔄 Новая игра', payload: JSON.stringify({ command: 'new_game' }) },
          color: 'positive'
        }
      ]
    ]
  });
}

function createWelcomeKeyboard() {
  return JSON.stringify({
    one_time: true,
    inline: false,
    buttons: [
      [
        {
          action: { type: 'text', label: '🎮 Начать игру', payload: JSON.stringify({ command: 'new_game' }) },
          color: 'positive'
        }
      ]
    ]
  });
}

async function sendMessageWithKeyboard(context, message, keyboardJson) {
  await context.send({
    message: message,
    keyboard: keyboardJson
  });
}

vk.updates.on('message_new', async (context) => {
  const userId = context.senderId;

  let command = null;

  if (context.messagePayload) {
    command = context.messagePayload.command;
  } else if (context.payload) {
    try {
      if (context.payload.message?.payload) {
        const parsed = JSON.parse(context.payload.message.payload);
        command = parsed.command;
      }
    } catch (e) {
      console.error('Ошибка парсинга payload:', e);
    }
  }

  if (command) {
    if (command === 'new_game') {
      const result = gameManager.startNewGame(userId);
      await sendMessageWithKeyboard(context, `🎮 Новая игра началась!\n\n${result.message}`, createGameKeyboard());
      return;
    }

    if (command === 'undo') {
      const result = gameManager.undo(userId);
      if (result.success) {
        await sendMessageWithKeyboard(context, result.message, createGameKeyboard());
      } else {
        await context.send(result.message);
      }
      return;
    }

    if (['up', 'down', 'left', 'right'].includes(command)) {
      const result = gameManager.move(userId, command);
      if (result.success) {
        const isGameOver = result.state === GameState.GAME_OVER;
        await sendMessageWithKeyboard(context, result.message, isGameOver ? createGameOverKeyboard() : createGameKeyboard());
      } else {
        await context.send(result.message);
      }
      return;
    }
  }

  if (context.text) {
    const text = context.text.trim().toLowerCase();
    const parts = text.split(' ');
    const cmd = parts[0];
    const direction = parts[1];

    if (text === 'начать' || text === 'start') {
      const welcomeMessage = `👋 Привет! Я бот для игры в 2048.

Правила просты:
• Двигай плитки в одном направлении
• Одинаковые числа сливаются и удваиваются
• Цель — собрать плитку 2048!

Нажми кнопку ниже, чтобы начать игру:`;
      await sendMessageWithKeyboard(context, welcomeMessage, createWelcomeKeyboard());
      return;
    }

    if (cmd === '/new_game') {
      const result = gameManager.startNewGame(userId);
      await sendMessageWithKeyboard(context, `🎮 Новая игра началась!\n\n${result.message}`, createGameKeyboard());
      return;
    }

    if (cmd === '/move') {
      if (!direction) {
        await context.send('❌ Укажи направление! Пример: `/move вверх`');
        return;
      }
      const result = gameManager.move(userId, direction);
      if (result.success) {
        const isGameOver = result.state === GameState.GAME_OVER;
        await sendMessageWithKeyboard(context, result.message, isGameOver ? createGameOverKeyboard() : createGameKeyboard());
      } else {
        await context.send(result.message);
      }
      return;
    }

    if (cmd === '/undo') {
      const result = gameManager.undo(userId);
      if (result.success) {
        await sendMessageWithKeyboard(context, result.message, createGameKeyboard());
      } else {
        await context.send(result.message);
      }
      return;
    }

    if (cmd === '/help' || text === 'помощь') {
      const helpMessage = `📖 Доступные команды:

/new_game — начать новую игру
/move <вверх|вниз|влево|вправо> — сделать ход
/undo — отменить последний ход
/help — показать эту справку

Или просто используй кнопки под сообщением!`;
      await context.send(helpMessage);
      return;
    }

    await context.send(' Не понимаю. Используй кнопки или команды:\n/new_game - начать игру\n/move <вверх|вниз|влево|вправо> - сделать ход\n/undo - отменить ход\n/help - справка');
  }
});

console.log('✅ Токен загружен успешно!');
console.log('🚀 Запускаем бота...');
vk.updates.start().catch(console.error);