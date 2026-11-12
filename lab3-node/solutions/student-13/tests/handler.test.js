import { describe, test, expect } from '@jest/globals';
import { createSession, MAX_TRACKS, parseSequence, durationBeats } from '../src/music.js';
import { handleMessage, getKeyboard } from '../src/handler.js';

function createTrack(session, name = 'Lead', type = 'мелодия') {
  handleMessage(session, '/newtrack');
  handleMessage(session, type);
  return handleMessage(session, type === 'ударные' ? '4' : name);
}

describe('Команды и конечный автомат', () => {
  test.each(['/start', '/help', '/START', '/help@DawBot'])(
    '%s показывает помощь', (command) => {
      expect(handleMessage(createSession(), command)).toContain('DawBot');
    }
  );

  test.each([undefined, null, 123, {}, '', '  '])('безопасно обрабатывает %j', (text) => {
    expect(handleMessage(createSession(), text)).toContain('текстовое');
  });

  test('проверяет размер сообщения', () => {
    expect(handleMessage(createSession(), 'a'.repeat(1001))).toContain('слишком длинное');
  });

  test('неизвестный текст и команды не вызывают падение', () => {
    const session = createSession();
    expect(handleMessage(session, 'hello')).toContain('Выберите команду');
    expect(handleMessage(session, '/unknown')).toContain('Неизвестная команда');
    session.state = 'toString';
    expect(handleMessage(session, 'test')).toContain('Выберите команду');
    expect(session.state).toBe('idle');
  });

  test('дорожка появляется только после корректного названия и типа', () => {
    const session = createSession();
    expect(handleMessage(session, '/tracks')).toContain('Дорожек пока нет');
    expect(session.state).toBe('idle');
    expect(handleMessage(session, '/newtrack')).toContain('Выберите тип');
    expect(session.state).toBe('track-type');
    expect(session.tracks).toHaveLength(0);
    expect(handleMessage(session, 'гитара')).toContain('Допустимые типы');
    expect(session.state).toBe('track-type');
    expect(handleMessage(session, 'МЕЛОДИЯ')).toContain('Введите название');
    expect(session.state).toBe('track-name');
    expect(handleMessage(session, 'a'.repeat(33))).toContain('Название');
    expect(session.state).toBe('track-name');
    expect(handleMessage(session, '  Lead  ')).toContain('создана');
    expect(session.state).toBe('idle');
    expect(session.tracks[0]).toMatchObject({ id: 1, name: 'Lead', type: 'мелодия' });
    expect(session.draft).toEqual({});
    createTrack(session, 'Bass', 'бас');
    expect(session.tracks[1].id).toBe(2);
  });

  test('повторное имя не продвигает диалог', () => {
    const session = createSession();
    createTrack(session);
    handleMessage(session, '/newtrack');
    handleMessage(session, 'мелодия');
    expect(handleMessage(session, 'lead')).toContain('уже есть');
    expect(session.state).toBe('track-name');
  });

  test('ограничение количества дорожек не мешает смотреть список', () => {
    const session = createSession();
    for (let index = 0; index < MAX_TRACKS; index++) {
      createTrack(session, `Track ${index}`, 'ударные');
    }
    expect(handleMessage(session, '/newtrack')).toContain('Достигнут лимит');
    expect(session.state).toBe('idle');
    expect(session.tracks).toHaveLength(MAX_TRACKS);
  });

  test('отмена и новая команда сбрасывают только незавершённый диалог', () => {
    const session = createSession();
    createTrack(session);
    handleMessage(session, '/newtrack');
    handleMessage(session, 'мелодия');
    expect(handleMessage(session, '/cancel')).toContain('отменён');
    expect(session.tracks).toHaveLength(1);
    expect(session.draft).toEqual({});
    handleMessage(session, '/newtrack');
    handleMessage(session, 'мелодия');
    handleMessage(session, '/sounds');
    expect(session.state).toBe('sound-track');
    expect(session.draft).toEqual({});
  });
});

describe('Ввести ноты', () => {
  test('ударная дорожка редактируется сеткой с явным сохранением', () => {
    const session = createSession();
    createTrack(session, 'Drums', 'ударные');
    handleMessage(session, '/sequencer');
    expect(handleMessage(session, '1')).toContain('8 шагов = 8 долей');
    expect(session.state).toBe('drum-grid');
    const keyboard = getKeyboard(session);
    expect(keyboard.slice(0, 1).flat()).toHaveLength(8);
    expect(keyboard[0][0]).toBe('01 □');
    expect(handleMessage(session, '01 □')).toContain('Ударов: 1');
    expect(getKeyboard(session)[0][0]).toBe('01 ■');
    expect(handleMessage(session, '01 ■')).toContain('Ударов: 0');
    handleMessage(session, '01 □');
    handleMessage(session, '08 □');
    expect(session.tracks[0].events).toEqual([]);
    for (const invalid of ['00 □', '09 □', 'abc']) {
      expect(handleMessage(session, invalid)).toContain('Выберите шаг кнопкой');
    }
    expect(handleMessage(session, 'Сохранить')).toContain('Ритм сохранён');
    expect(session.tracks[0].events).toHaveLength(8);
    expect(session.tracks[0].events[0].note).toBe('C2');
    expect(session.tracks[0].events[7].note).toBe('C2');
    expect(durationBeats(session.tracks[0])).toBe(8);
    expect(session.state).toBe('idle');
  });

  test('очистка и отмена не уничтожают сохранённые ноты', () => {
    const session = createSession();
    createTrack(session, 'Drums', 'ударные');
    const previous = parseSequence('C2:1 R:1');
    session.tracks[0].events = previous;
    handleMessage(session, '/sequencer');
    handleMessage(session, '1');
    expect(session.draft.pattern[0]).toBe(true);
    expect(handleMessage(session, 'Очистить')).toContain('Ударов: 0');
    expect(session.tracks[0].events).toBe(previous);
    handleMessage(session, 'Отмена');
    expect(session.tracks[0].events).toBe(previous);
  });

  test('для ударных остаётся доступен текстовый ввод', () => {
    const session = createSession();
    createTrack(session, 'Drums', 'ударные');
    handleMessage(session, '/sequencer');
    handleMessage(session, '1');
    expect(handleMessage(session, 'Ввести текстом')).toContain('Ноты для дорожки');
    expect(session.state).toBe('sequence-notes');
    expect(handleMessage(session, 'C2:1 R:1')).toContain('Ноты сохранены');
    expect(session.tracks[0].events).toHaveLength(2);
  });
  test('без дорожек предлагает /tracks', () => {
    const session = createSession();
    expect(handleMessage(session, '/sequencer')).toContain('Композиция пуста');
    expect(session.state).toBe('idle');
  });

  test('проверяет номер, вводит ноты и заменяет прежнюю последовательность', () => {
    const session = createSession();
    createTrack(session);
    expect(handleMessage(session, '/sequencer')).toContain('Выберите дорожку');
    expect(handleMessage(session, '99')).toContain('не найдена');
    expect(session.state).toBe('sequence-track');
    expect(handleMessage(session, '1')).toContain('C4:1');
    expect(session.state).toBe('sequence-notes');
    expect(handleMessage(session, 'H4:1')).toContain('Формат');
    expect(session.tracks[0].events).toEqual([]);
    expect(session.state).toBe('sequence-notes');
    expect(handleMessage(session, 'C4:1 R:1')).toContain('Ноты сохранены');
    expect(session.state).toBe('idle');
    expect(session.tracks[0].events).toHaveLength(2);
    handleMessage(session, '/sequencer');
    handleMessage(session, '1');
    expect(handleMessage(session, 'C4:4 C4:4 C4:1')).toContain('слишком длинная');
    // Некорректный новый ввод не уничтожает ранее сохранённые ноты.
    expect(session.tracks[0].events).toHaveLength(2);
    handleMessage(session, 'D4:0.5');
    expect(session.tracks[0].events).toEqual([{ note: 'D4', beats: 0.5 }]);
  });
});

describe('Звуки', () => {
  test('ударные получают имя выбранного звука без ручного названия', () => {
    const session = createSession();
    handleMessage(session, '/newtrack');
    expect(handleMessage(session, 'ударные')).toContain('автоматически');
    expect(session.state).toBe('drum-sound');
    expect(getKeyboard(session).flat()).toEqual(['4. Kick', '5. Snare', '6. Hi-hat', 'Отмена']);
    expect(handleMessage(session, '1')).toContain('Выберите Kick');
    expect(session.tracks).toEqual([]);
    const result = handleMessage(session, '5. Snare');
    expect(session.tracks[0]).toMatchObject({ name: 'Snare', type: 'ударные', sound: { name: 'Snare' } });
    expect(result).not.toContain('звук: Snare');
    handleMessage(session, '/newtrack');
    handleMessage(session, 'ударные');
    handleMessage(session, '5');
    expect(session.tracks[1].name).toBe('Snare 2');
  });

  test('смена звука ударных обновляет имя и не допускает мелодические инструменты', () => {
    const session = createSession();
    createTrack(session, 'Unused', 'ударные');
    handleMessage(session, '/sounds');
    handleMessage(session, '1');
    expect(getKeyboard(session).flat()).not.toContain('1. Piano');
    expect(handleMessage(session, '1')).toContain('Выберите Kick');
    expect(handleMessage(session, '5')).toContain('Звук Snare добавлен');
    expect(session.tracks[0].name).toBe('Snare');
    handleMessage(session, '/sounds');
    handleMessage(session, '1');
    handleMessage(session, '5');
    expect(session.tracks[0].name).toBe('Snare');
  });

  test('аккорды сохраняются целиком, неверный новый ввод не уничтожает их', () => {
    const session = createSession();
    createTrack(session, 'Pad');
    handleMessage(session, '/sequencer');
    handleMessage(session, '1');
    expect(handleMessage(session, 'C4+E4+G4:2')).toContain('Ноты сохранены');
    const previous = session.tracks[0].events;
    handleMessage(session, '/sequencer');
    handleMessage(session, '1');
    expect(handleMessage(session, 'C4+R:1')).toContain('Формат');
    expect(session.tracks[0].events).toBe(previous);
  });
  test('показывает каталог даже без дорожек', () => {
    const session = createSession();
    const result = handleMessage(session, '/sounds');
    expect(result).toContain('Piano');
    expect(result).toContain('Сначала создайте');
    expect(session.state).toBe('idle');
  });

  test('выбирает дорожку и звук, отклоняет некорректные номера', () => {
    const session = createSession();
    createTrack(session);
    expect(handleMessage(session, '/sounds')).toContain('Дорожки');
    expect(handleMessage(session, '2')).toContain('не найдена');
    expect(session.state).toBe('sound-track');
    expect(handleMessage(session, '1')).toContain('Выберите номер звука');
    expect(session.state).toBe('sound-choice');
    expect(handleMessage(session, '7')).toContain('от 1 до 6');
    expect(handleMessage(session, '1.0')).toContain('от 1 до 6');
    expect(session.tracks[0].sound).toBeNull();
    expect(handleMessage(session, '1')).toContain('Звук Piano добавлен');
    expect(session.tracks[0].sound.name).toBe('Piano');
    expect(session.state).toBe('idle');
    handleMessage(session, '/sounds');
    handleMessage(session, '1');
    handleMessage(session, '6');
    expect(session.tracks[0].sound.name).toBe('Hi-hat');
  });
});

describe('Управление кнопками', () => {
  test('главное меню и просмотр списка не начинают создание', () => {
    const session = createSession();
    expect(getKeyboard(session).flat()).toContain('Создать дорожку');
    expect(handleMessage(session, 'Дорожки')).toContain('Дорожек пока нет');
    expect(session.state).toBe('idle');
    expect(handleMessage(session, '/help')).toContain('DawBot');
  });

  test('полный сценарий с кнопками создания, дорожки, типа и звука', () => {
    const session = createSession();
    handleMessage(session, 'Создать дорожку');
    expect(getKeyboard(session).flat()).toContain('мелодия');
    handleMessage(session, 'мелодия');
    expect(getKeyboard(session)).toEqual([['Отмена']]);
    // Название, совпадающее с главным меню, не превращается в команду.
    handleMessage(session, 'Дорожки');
    handleMessage(session, 'Ввести ноты');
    expect(getKeyboard(session)).toEqual([['1. Дорожки'], ['Отмена']]);
    handleMessage(session, '1. Дорожки');
    expect(getKeyboard(session)).toEqual([['Как вводить ноты'], ['Отмена']]);
    expect(handleMessage(session, 'C4:1')).toContain('Ноты сохранены');
    handleMessage(session, 'Звуки');
    expect(getKeyboard(session).flat()).toContain('1. Дорожки');
    handleMessage(session, '1. Дорожки');
    expect(getKeyboard(session).flat()).toContain('1. Piano');
    expect(handleMessage(session, '1. Piano')).toContain('Звук Piano добавлен');
    expect(session.tracks[0].sound.name).toBe('Piano');
    expect(session.state).toBe('idle');
  });

  test('кнопка отмены очищает черновик и возвращает меню', () => {
    const session = createSession();
    handleMessage(session, 'Создать дорожку');
    handleMessage(session, 'Lead');
    expect(handleMessage(session, 'Отмена')).toContain('отменён');
    expect(session.draft).toEqual({});
    expect(session.tracks).toEqual([]);
    expect(getKeyboard(session).flat()).toContain('Дорожки');
  });
});

describe('Навигация и понятные подсказки', () => {
  test('главное меню и справка имеют разные назначения', () => {
    const session = createSession();
    const menu = handleMessage(session, '/start');
    expect(menu).toContain('Главное меню');
    expect(getKeyboard(session).flat()).not.toContain('Помощь');
    const help = handleMessage(session, '/help');
    expect(help).not.toBe(menu);
    expect(help).toContain('R — пауза');
    expect(help).toContain('C — до');
  });

  test('кнопка главного меню работает из незавершённого диалога', () => {
    const session = createSession();
    createTrack(session);
    handleMessage(session, '/newtrack');
    handleMessage(session, 'мелодия');
    expect(handleMessage(session, 'Главное меню')).toContain('DawBot · Главное меню');
    expect(session.state).toBe('idle');
    expect(session.draft).toEqual({});
    expect(session.tracks).toHaveLength(1);
    expect(session.view).toBe('main');
  });

  test('просмотр композиции не начинает редактирование', () => {
    const session = createSession();
    createTrack(session);
    expect(handleMessage(session, 'Композиция')).toContain('Композиция:');
    expect(session.state).toBe('idle');
    expect(session.view).toBe('composition');
    expect(getKeyboard(session).flat()).toContain('Ввести ноты');
    handleMessage(session, 'Ввести ноты');
    expect(session.state).toBe('sequence-track');
  });

  test('справка во время ввода нот сохраняет выбранную дорожку', () => {
    const session = createSession();
    createTrack(session);
    handleMessage(session, '/sequencer');
    handleMessage(session, '1');
    const draft = { ...session.draft };
    expect(handleMessage(session, 'Как вводить ноты')).toContain('R — пауза');
    expect(session.state).toBe('sequence-notes');
    expect(session.draft).toEqual(draft);
    expect(handleMessage(session, 'C4:1 R:1')).toContain('Ноты сохранены');
  });
});
