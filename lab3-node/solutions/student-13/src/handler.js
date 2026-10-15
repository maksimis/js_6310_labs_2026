import {
  MAX_TRACKS, MAX_STEPS, TRACK_TYPES, SOUNDS, validateName, findTrack,
  parseSequence, renderTracks, renderSounds, renderComposition, createDrumPattern, drumEvents,
  soundsForType, drumName
} from './music.js';

export const HELP = [
  'DawBot: как вводить ноты',
  'Формат события: нота:длительность. События разделяются пробелами.',
  'C — до, D — ре, E — ми, F — фа, G — соль, A — ля, B — си.',
  'Цифра после ноты — октава (0–8). C4 — до четвёртой октавы.',
  'R — пауза (rest), а не нота. R:0.5 — полдоли тишины.',
  'После двоеточия — длительность в долях: 0.25, 0.5, 1, 2 или 4.',
  'Пример без пауз: C4:1 D4:1 E4:2',
  'Пример с паузой: C4:1 R:0.5 D4:0.5',
  'Аккорд: C4+E4+G4:1 — три ноты одновременно на одну долю. Внутри аккорда пробелы не нужны.',
  'Темп: 120 BPM, 1 доля = 0.5 секунды. Максимум 8 долей на дорожке.',
  'Поддерживаются диезы и бемоли: C#4:1 Db4:1.',
  'Новый ввод полностью заменяет ноты выбранной дорожки после проверки.'
].join('\n');

const MAIN_MENU = [
  'DawBot · Главное меню',
  '1. Выберите тип дорожки. Для ударных — звук, для мелодии и баса — своё название.',
  '2. Добавьте ноты и назначьте звук.',
  '3. Откройте «Композиция», чтобы увидеть результат.',
  'Бот хранит текстовую композицию, без воспроизведения аудио.'
].join('\n');

const buttonCommands = {
  'Дорожки': '/tracks',
  'Создать дорожку': '/newtrack',
  'Ввести ноты': '/sequencer',
  'Композиция': '/composition',
  'Звуки': '/sounds'
};

export function getKeyboard(session) {
  if (session.state === 'drum-grid') {
    const row = session.draft.pattern.map((hit, index) =>
      `${String(index + 1).padStart(2, '0')} ${hit ? '■' : '□'}`
    );
    return [row, ['Сохранить', 'Очистить'], ['Ввести текстом', 'Отмена']];
  }
  if (session.state === 'track-type') {
    return [TRACK_TYPES, ['Отмена']];
  }
  if (session.state === 'sequence-track' || session.state === 'sound-track') {
    return [...session.tracks.map((track) => [`${track.id}. ${track.name}`]), ['Отмена']];
  }
  if (session.state === 'sound-choice') {
    const track = findTrack(session.tracks, String(session.draft.trackId));
    return [...soundsForType(track.type).map((sound) => [`${sound.id}. ${sound.name}`]), ['Отмена']];
  }
  if (session.state === 'drum-sound') {
    return [...soundsForType('ударные').map((sound) => [`${sound.id}. ${sound.name}`]), ['Отмена']];
  }
  if (session.state === 'sequence-notes') {
    return [['Как вводить ноты'], ['Отмена']];
  }
  if (session.state === 'track-name') {
    return [['Отмена']];
  }
  if (session.view === 'composition') {
    return [['Ввести ноты', 'Звуки'], ['Дорожки']];
  }
  if (session.view === 'tracks') {
    return [['Создать дорожку'], ['Ввести ноты', 'Звуки'], ['Композиция']];
  }
  return [['Дорожки', 'Композиция'], ['Создать дорожку', 'Звуки']];
}

function resetDialog(session, view = 'main') {
  session.state = 'idle';
  session.draft = {};
  session.view = view;
}

function finishTrack(session, name, sound = null) {
  const track = { id: session.nextId++, name, type: session.draft.type, events: [], sound };
  session.tracks.push(track);
  resetDialog(session, 'tracks');
  return `Дорожка «${track.name}» создана.\n${renderTracks(session.tracks)}\nДальше: «Ввести ноты» или «Звуки».`;
}

function notesPrompt(track) {
  return [
    `Ноты для дорожки «${track.name}»`,
    'Отправьте последовательность одним сообщением. Например:',
    'C4:1 D4:1 E4:2',
    'C4 — нота до, октава 4. :1 — длительность 1 доля.',
    'Аккорд: C4+E4+G4:1 — три ноты одновременно на одну долю.',
    'Ноты: C, D, E, F, G, A, B. R — пауза, например R:0.5.',
    'Длительности: 0.25, 0.5, 1, 2, 4 доли. Всего не больше 8 долей.',
    'Сохранение заменит прежние ноты. Подробнее — кнопка «Как вводить ноты».'
  ].join('\n');
}

function drumPrompt(session) {
  const track = findTrack(session.tracks, String(session.draft.trackId));
  return [
    `Ритм дорожки «${track.name}»`,
    '8 шагов = 8 долей. Одна кнопка — одна доля.',
    'Шаги идут слева направо: от 1 до 8.',
    '■ — удар, □ — пауза. Нажатие включает или выключает удар.',
    `Ударов: ${session.draft.pattern.filter(Boolean).length}.`,
    'Звук дорожки выбирается в разделе «Звуки».',
    'Изменения применятся только после «Сохранить».'
  ].join('\n');
}

function findSound(type, text) {
  const sound = soundsForType(type).find((item) => String(item.id) === text);
  if (!sound) {
    throw new Error(type === 'ударные'
      ? 'Выберите Kick, Snare или Hi-hat кнопкой ниже.'
      : 'Введите номер звука от 1 до 6.');
  }
  return sound;
}

function startCommand(session, command) {
  resetDialog(session);
  if (command === '/start' || command === '/menu') {
    return MAIN_MENU;
  }
  if (command === '/help') {
    return HELP;
  }
  if (command === '/cancel') {
    return 'Диалог отменён. Готовые дорожки сохранены.\n/tracks /sequencer /sounds';
  }
  if (command === '/tracks') {
    session.view = 'tracks';
    const list = renderTracks(session.tracks);
    return `${list}\nДля создания нажмите «Создать дорожку» или отправьте /newtrack.`;
  }
  if (command === '/composition') {
    session.view = 'composition';
    return renderComposition(session.tracks);
  }
  if (command === '/newtrack') {
    if (session.tracks.length >= MAX_TRACKS) {
      return `Достигнут лимит: ${MAX_TRACKS} дорожек. Редактирование: /sequencer и /sounds.`;
    }
    session.state = 'track-type';
    return 'Выберите тип дорожки кнопкой ниже.';
  }
  if (command === '/sequencer') {
    if (session.tracks.length === 0) {
      return renderComposition(session.tracks);
    }
    session.state = 'sequence-track';
    return `Выберите дорожку для ввода нот:\n${renderTracks(session.tracks)}`;
  }
  if (command === '/sounds') {
    const catalog = `Звуки:\n${renderSounds()}`;
    if (session.tracks.length === 0) {
      return `${catalog}\nСначала создайте дорожку: /tracks.`;
    }
    session.state = 'sound-track';
    return `${catalog}\nДорожки:\n${renderTracks(session.tracks)}\nВыберите дорожку кнопкой или введите её номер.`;
  }
  return 'Неизвестная команда. Используйте /help.';
}

// Конечный автомат: каждый обработчик соответствует одному состоянию диалога.
const steps = {
  'track-name': (session, text) => {
    const name = validateName(text, session.tracks);
    return finishTrack(session, name);
  },
  'track-type': (session, text) => {
    const type = text.toLowerCase();
    if (!TRACK_TYPES.includes(type)) {
      throw new Error('Допустимые типы: мелодия, бас, ударные. Повторите ввод.');
    }
    session.draft.type = type;
    if (type === 'ударные') {
      session.state = 'drum-sound';
      return 'Выберите звук ударных. Название дорожки будет задано автоматически.';
    }
    session.state = 'track-name';
    return 'Введите название дорожки (1–32 символа), например Pad или Bass.';
  },
  'drum-sound': (session, text) => {
    const sound = findSound('ударные', text);
    return finishTrack(session, drumName(sound, session.tracks), sound);
  },
  'sequence-track': (session, text) => {
    const track = findTrack(session.tracks, text);
    session.draft.trackId = track.id;
    if (track.type === 'ударные') {
      session.state = 'drum-grid';
      session.draft.pattern = createDrumPattern(track.events);
      return drumPrompt(session);
    }
    session.state = 'sequence-notes';
    return notesPrompt(track);
  },
  'drum-grid': (session, text) => {
    const track = findTrack(session.tracks, String(session.draft.trackId));
    if (text === 'Сохранить') {
      track.events = drumEvents(session.draft.pattern);
      resetDialog(session, 'composition');
      return `Ритм сохранён.\n${renderComposition(session.tracks)}`;
    }
    if (text === 'Ввести текстом') {
      session.state = 'sequence-notes';
      return notesPrompt(track);
    }
    if (text === 'Очистить') {
      session.draft.pattern.fill(false);
      return drumPrompt(session);
    }
    const match = /^(\d{2}) [■□]$/.exec(text);
    const index = match ? Number(match[1]) - 1 : -1;
    if (index < 0 || index >= MAX_STEPS) {
      throw new Error('Выберите шаг кнопкой, сохраните ритм или нажмите «Ввести текстом».');
    }
    session.draft.pattern[index] = !session.draft.pattern[index];
    return drumPrompt(session);
  },
  'sequence-notes': (session, text) => {
    const events = parseSequence(text);
    const track = findTrack(session.tracks, String(session.draft.trackId));
    track.events = events;
    resetDialog(session, 'composition');
    return `Ноты сохранены.\n${renderComposition(session.tracks)}`;
  },
  'sound-track': (session, text) => {
    const track = findTrack(session.tracks, text);
    session.draft.trackId = track.id;
    session.state = 'sound-choice';
    return `Выберите номер звука для «${track.name}» кнопкой ниже:\n${renderSounds(soundsForType(track.type))}`;
  },
  'sound-choice': (session, text) => {
    const track = findTrack(session.tracks, String(session.draft.trackId));
    const sound = findSound(track.type, text);
    track.sound = sound;
    if (track.type === 'ударные') {
      track.name = drumName(sound, session.tracks, track.id);
    }
    resetDialog(session, 'tracks');
    return `Звук ${sound.name} добавлен в дорожку «${track.name}».\n${renderTracks(session.tracks)}`;
  }
};

export function handleMessage(session, input) {
  if (typeof input !== 'string' || !input.trim()) {
    return 'Отправьте текстовое сообщение или команду /help.';
  }
  if (input.length > 1000) {
    return 'Сообщение слишком длинное. Максимум 1000 символов.';
  }
  let text = input.trim();
  if (text === 'Главное меню') {
    return startCommand(session, '/menu');
  }
  // Подсказка не сбрасывает выбранную дорожку и шаг ввода.
  if (text === 'Как вводить ноты' && session.state === 'sequence-notes') {
    return HELP;
  }
  if (text === 'Отмена') {
    return startCommand(session, '/cancel');
  }
  if (session.state === 'idle' && Object.hasOwn(buttonCommands, text)) {
    return startCommand(session, buttonCommands[text]);
  }
  if (['sequence-track', 'sound-track', 'sound-choice', 'drum-sound'].includes(session.state)) {
    const options = session.state.endsWith('-track') ? session.tracks : SOUNDS;
    const selected = options.find((item) => `${item.id}. ${item.name}` === text);
    if (selected) {
      text = String(selected.id);
    }
  }
  // Поддерживаем команды вида /tracks@BotName в групповых чатах.
  if (text.startsWith('/')) {
    const command = text.split(/\s+/)[0].split('@')[0].toLowerCase();
    return startCommand(session, command);
  }
  const step = steps[session.state];
  if (!Object.hasOwn(steps, session.state)) {
    resetDialog(session);
    return 'Выберите команду: /tracks, /sequencer или /sounds. Помощь: /help.';
  }
  try {
    return step(session, text);
  } catch (error) {
    return error.message;
  }
}
