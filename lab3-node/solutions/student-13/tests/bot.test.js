import { afterEach, describe, test, expect, jest } from '@jest/globals';
import { Telegram } from 'telegraf';
import { createBot, escapeHtml, splitReply, formatReply } from '../src/bot.js';

const botInfo = { id: 100, is_bot: true, first_name: 'DawBot', username: 'DawBot' };
let updateId = 1;

function update(text, userId = 13, chatId = 1) {
  const message = {
    message_id: updateId, date: 0,
    from: { id: userId, is_bot: false, first_name: 'Student' },
    chat: { id: chatId, type: 'private' }
  };
  if (text !== undefined) {
    message.text = text;
  } else {
    message.sticker = { file_id: 'sticker' };
  }
  return { update_id: updateId++, message };
}

function setup() {
  const bot = createBot('test-token-not-valid');
  bot.botInfo = botInfo;
  const calls = jest.spyOn(Telegram.prototype, 'callApi').mockResolvedValue({});
  return { bot, calls };
}

function callback(data, userId = 13) {
  const original = update('', userId);
  return {
    update_id: original.update_id,
    callback_query: {
      id: String(original.update_id), from: original.message.from,
      message: original.message, chat_instance: 'test-chat', data
    }
  };
}

afterEach(() => jest.restoreAllMocks());

describe('Telegram-адаптер без реальных сетевых запросов', () => {
  test('обрабатывает сообщение через настоящий конвейер Telegraf', async () => {
    const { bot, calls } = setup();
    await bot.handleUpdate(update('/start'));
    expect(calls).toHaveBeenCalledWith('sendMessage', expect.objectContaining({
      chat_id: 1, parse_mode: 'HTML', text: expect.stringContaining('DawBot'),
      reply_markup: expect.objectContaining({
        inline_keyboard: expect.arrayContaining([[
          { text: 'Дорожки', callback_data: '13|idle|Дорожки' },
          { text: 'Композиция', callback_data: '13|idle|Композиция' }
        ]])
      })
    }));
    expect(calls).toHaveBeenCalledWith('sendMessage', expect.objectContaining({
      reply_markup: expect.objectContaining({ keyboard: [['Главное меню']] })
    }));
  });

  test('отправляет клавиатуры нужного шага и обрабатывает их текст', async () => {
    const { bot, calls } = setup();
    await bot.handleUpdate(update('Создать дорожку'));
    expect(calls.mock.lastCall[1].reply_markup.inline_keyboard[0]).toEqual([
      { text: 'мелодия', callback_data: '13|track-type|мелодия' },
      { text: 'бас', callback_data: '13|track-type|бас' },
      { text: 'ударные', callback_data: '13|track-type|ударные' }
    ]);
    await bot.handleUpdate(update('бас'));
    expect(calls.mock.lastCall[1].reply_markup.inline_keyboard).toEqual([
      [{ text: 'Отмена', callback_data: '13|track-name|/cancel' }]
    ]);
    await bot.handleUpdate(update('Lead'));
    await bot.handleUpdate(update('Звуки'));
    expect(calls.mock.lastCall[1].reply_markup.inline_keyboard[0]).toEqual([
      { text: '1. Lead', callback_data: '13|sound-track|1' }
    ]);
    await bot.handleUpdate(update('1. Lead'));
    expect(calls.mock.lastCall[1].reply_markup.inline_keyboard[0]).toEqual([
      { text: '1. Piano', callback_data: '13|sound-choice|1' }
    ]);
    await bot.handleUpdate(update('1. Piano'));
    expect(calls.mock.lastCall[1].text).toContain('Звук Piano добавлен');
  });

  test('выбирает тип, дорожку и звук через callback-кнопки', async () => {
    const { bot, calls } = setup();
    await bot.handleUpdate(callback('13|idle|Создать дорожку'));
    await bot.handleUpdate(callback('13|track-type|бас'));
    await bot.handleUpdate(update('Lead'));
    expect(calls.mock.lastCall[1].text).toContain('создана');
    expect(calls.mock.lastCall[1].text).not.toContain('<pre>');
    await bot.handleUpdate(callback('13|idle|Звуки'));
    await bot.handleUpdate(callback('13|sound-track|1'));
    await bot.handleUpdate(callback('13|sound-choice|1'));
    expect(calls.mock.lastCall[1].text).toContain('Звук Piano добавлен');
    await bot.handleUpdate(callback('13|idle|Создать дорожку'));
    await bot.handleUpdate(callback('13|track-type|/cancel'));
    expect(calls.mock.lastCall[1].text).toContain('отменён');
    expect(calls.mock.calls.some(([method]) => method === 'answerCallbackQuery')).toBe(true);
  });

  test('чужая, устаревшая и некорректная кнопка не меняют диалог', async () => {
    const { bot, calls } = setup();
    await bot.handleUpdate(update('/newtrack'));
    const before = calls.mock.calls.filter(([method]) => method === 'sendMessage').length;
    await bot.handleUpdate(callback('13|track-type|бас', 14));
    await bot.handleUpdate(callback('13|sound-choice|1'));
    await bot.handleUpdate(callback('13|track-type|'));
    await bot.handleUpdate(callback(undefined));
    expect(calls.mock.calls.filter(([method]) => method === 'sendMessage')).toHaveLength(before);
    await bot.handleUpdate(callback('13|track-type|бас'));
    await bot.handleUpdate(update('Lead'));
    expect(calls.mock.lastCall[1].text).toContain('создана');
  });

  test('подсказка о нотах доступна кнопкой и не сбрасывает ввод', async () => {
    const { bot, calls } = setup();
    await bot.handleUpdate(update('/newtrack'));
    await bot.handleUpdate(callback('13|track-type|мелодия'));
    await bot.handleUpdate(update('Lead'));
    await bot.handleUpdate(callback('13|idle|Ввести ноты'));
    await bot.handleUpdate(callback('13|sequence-track|1'));
    const help = calls.mock.lastCall[1].reply_markup.inline_keyboard[0][0];
    expect(help.text).toBe('Как вводить ноты');
    expect(Buffer.byteLength(help.callback_data, 'utf8')).toBeLessThanOrEqual(64);
    await bot.handleUpdate(callback(help.callback_data));
    expect(calls.mock.lastCall[1].text).toContain('R — пауза');
    await bot.handleUpdate(update('C4:1 R:1'));
    expect(calls.mock.lastCall[1].text).toContain('Ноты сохранены');
    await bot.handleUpdate(update('Главное меню'));
    expect(calls.mock.lastCall[1].text).toContain('DawBot · Главное меню');
    expect(calls.mock.lastCall[1].reply_markup.inline_keyboard.flat().map((button) => button.text))
        .not.toContain('Помощь');
  });

  test('сетка ударных обновляет сообщение, а сохранение отправляет композицию', async () => {
    const { bot, calls } = setup();
    await bot.handleUpdate(update('/newtrack'));
    await bot.handleUpdate(callback('13|track-type|ударные'));
    expect(calls.mock.lastCall[1].reply_markup.inline_keyboard[0][0].callback_data).toBe('13|drum-sound|4');
    await bot.handleUpdate(callback('13|drum-sound|4'));
    await bot.handleUpdate(callback('13|idle|Ввести ноты'));
    await bot.handleUpdate(callback('13|sequence-track|1'));
    expect(calls.mock.lastCall[0]).toBe('editMessageText');
    expect(calls.mock.lastCall[1].reply_markup.inline_keyboard.slice(0, 1).flat()).toHaveLength(8);
    await bot.handleUpdate(callback('13|drum-grid|01 □'));
    expect(calls.mock.lastCall[0]).toBe('editMessageText');
    expect(calls.mock.lastCall[1].text).toContain('Ударов: 1');
    await bot.handleUpdate(callback('13|drum-grid|Очистить'));
    const clearAgain = callback('13|drum-grid|Очистить');
    clearAgain.callback_query.message.text = calls.mock.lastCall[1].text;
    const edits = calls.mock.calls.filter(([method]) => method === 'editMessageText').length;
    await bot.handleUpdate(clearAgain);
    expect(calls.mock.calls.filter(([method]) => method === 'editMessageText')).toHaveLength(edits);
    await bot.handleUpdate(callback('13|drum-grid|05 □'));
    await bot.handleUpdate(callback('13|drum-grid|Сохранить'));
    expect(calls.mock.lastCall[0]).toBe('sendMessage');
    expect(calls.mock.lastCall[1].text).toContain('Ритм сохранён');
  });

  test('пользователи одного чата и один пользователь в разных чатах независимы', async () => {
    const { bot, calls } = setup();
    await bot.handleUpdate(update('/newtrack', 13, 1));
    await bot.handleUpdate(update('мелодия', 13, 1));
    await bot.handleUpdate(update('/sounds', 14, 1));
    expect(calls.mock.lastCall[1].text).toContain('Сначала создайте');
    await bot.handleUpdate(update('Lead', 13, 1));
    expect(calls.mock.lastCall[1].text).toContain('создана');
    await bot.handleUpdate(update('/sequencer', 13, 2));
    expect(calls.mock.lastCall[1].text).toContain('Композиция пуста');
    await bot.handleUpdate(update('/sequencer', 14, 1));
    expect(calls.mock.lastCall[1].text).toContain('Композиция пуста');
    await bot.handleUpdate(update('/sequencer', 13, 1));
    expect(calls.mock.lastCall[1].text).toContain('Lead');
  });

  test('стикер не сбрасывает текущий шаг', async () => {
    const { bot, calls } = setup();
    await bot.handleUpdate(update('/newtrack'));
    await bot.handleUpdate(update(undefined));
    expect(calls.mock.lastCall[1].text).toContain('текстовое сообщение');
    await bot.handleUpdate(update('мелодия'));
    expect(calls.mock.lastCall[1].text).toContain('Введите название');
  });

  test('принимает своё упоминание и игнорирует команду другому боту', async () => {
    const { bot, calls } = setup();
    await bot.handleUpdate(update('/newtrack@OtherBot'));
    expect(calls).not.toHaveBeenCalled();
    await bot.handleUpdate(update('/newtrack@dawbot'));
    expect(calls.mock.lastCall[1].text).toContain('Выберите тип');
  });

  test('игнорирует сообщения без пользователя и обновления без сообщений', async () => {
    const { bot, calls } = setup();
    const anonymous = update('/start');
    delete anonymous.message.from;
    await bot.handleUpdate(anonymous);
    await bot.handleUpdate({ update_id: updateId++ });
    expect(calls).not.toHaveBeenCalled();
  });

  test('экранирует название дорожки перед отправкой HTML', async () => {
    const { bot, calls } = setup();
    await bot.handleUpdate(update('/newtrack'));
    await bot.handleUpdate(update('бас'));
    await bot.handleUpdate(update('<Lead & Bass>'));
    expect(calls.mock.lastCall[1].text).toContain('&lt;Lead &amp; Bass&gt;');
    expect(calls.mock.lastCall[1].text).not.toContain('<Lead');
  });

  test('сбой отправки ответа не завершает обработку следующих сообщений', async () => {
    const { bot, calls } = setup();
    const log = jest.spyOn(console, 'error').mockImplementation(() => {});
    calls.mockRejectedValueOnce(new Error('Сеть недоступна'));
    await expect(bot.handleUpdate(update('/start'))).resolves.toBeUndefined();
    expect(log).toHaveBeenCalled();
    await bot.handleUpdate(update('/help'));
    expect(calls.mock.lastCall[1].text).toContain('DawBot');
  });
});

describe('Форматирование ответов', () => {
  test('оставляет ответы обычным текстом, блок кода только у сетки', () => {
    expect(formatReply('Выберите тип дорожки.')).toBe('Выберите тип дорожки.');
    const result = formatReply('Композиция\n   1 2\n1: X -\n2: . X\nОписание <Lead>');
    expect(result).toBe('Композиция\n<pre>   1 2\n1: X -\n2: . X</pre>\nОписание &lt;Lead&gt;');
  });

  test('экранирует HTML и сохраняет исходный текст', () => {
    expect(escapeHtml('<a>&')).toBe('&lt;a&gt;&amp;');
    expect(escapeHtml('C4:1')).toBe('C4:1');
  });

  test('разбивает большой ответ по строкам', () => {
    const lines = Array.from({ length: 80 }, (_, index) => `${index}: ${'X'.repeat(90)}`);
    const text = lines.join('\n');
    const parts = splitReply(text);
    expect(parts.length).toBeGreaterThan(1);
    expect(parts.every((part) => part.length <= 3500)).toBe(true);
    expect(parts.join('\n')).toBe(text);
    expect(splitReply('')).toEqual([]);
  });
});
