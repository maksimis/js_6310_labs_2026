export const BPM = 120;
export const MAX_TRACKS = 8;
export const MAX_STEPS = 8;
export const TRACK_TYPES = ['мелодия', 'бас', 'ударные'];
export const SOUNDS = [
  { id: 1, name: 'Piano', description: 'звук фортепиано' },
  { id: 2, name: 'Synth', description: 'синтезатор' },
  { id: 3, name: 'Bass', description: 'басовый звук' },
  { id: 4, name: 'Kick', description: 'бочка' },
  { id: 5, name: 'Snare', description: 'малый барабан' },
  { id: 6, name: 'Hi-hat', description: 'хай-хэт' }
];

export function createSession() {
  return { state: 'idle', view: 'main', draft: {}, tracks: [], nextId: 1 };
}

export function soundsForType(type) {
  return type === 'ударные' ? SOUNDS.filter((sound) => sound.id >= 4) : SOUNDS;
}

export function drumName(sound, tracks, ignoredId = 0) {
  let name = sound.name;
  let number = 2;
  while (tracks.some((track) => track.id !== ignoredId && track.name.toLowerCase() === name.toLowerCase())) {
    name = `${sound.name} ${number++}`;
  }
  return name;
}

export function validateName(text, tracks) {
  if (!text || text.length > 32 || /[\p{Cc}\p{Cf}]/u.test(text)) {
    throw new Error('Название должно содержать от 1 до 32 символов без переносов строк.');
  }
  if (tracks.some((track) => track.name.toLowerCase() === text.toLowerCase())) {
    throw new Error('Дорожка с таким названием уже есть. Введите другое название.');
  }
  return text;
}

export function findTrack(tracks, text) {
  if (!/^[1-9]\d*$/.test(text)) {
    throw new Error('Введите целый положительный номер дорожки из списка.');
  }
  const track = tracks.find((item) => item.id === Number(text));
  if (!track) {
    throw new Error('Дорожка не найдена. Введите номер из списка.');
  }
  return track;
}

// Один шаг сетки — одна доля. При 120 BPM одна доля длится 0.5 секунды.
export function parseSequence(text) {
  const parts = text.trim().split(/\s+/);
  const events = [];
  let totalBeats = 0;

  for (const part of parts) {
    const [notesText, duration, extra] = part.split(':');
    const notes = notesText.split('+').map((note) => note.charAt(0).toUpperCase() + note.slice(1));
    const validNotes = notesText.toUpperCase() === 'R' || notes.every((note) => /^[A-G](?:#|b)?[0-8]$/.test(note));
    if (extra !== undefined || !validNotes || !['0.25', '0.5', '1', '2', '4'].includes(duration)) {
      throw new Error('Формат: C4:1 или C4+E4+G4:1. Ноты A–G, октавы 0–8; R — пауза. Длительности: 0.25, 0.5, 1, 2, 4 доли.');
    }
    const beats = Number(duration);
    totalBeats += beats;
    if (totalBeats > MAX_STEPS) {
      throw new Error('Последовательность слишком длинная: максимум 8 долей.');
    }
    events.push({ note: notes.join('+'), beats });
  }
  return events;
}

export function durationBeats(track) {
  return track.events.reduce((sum, event) => sum + event.beats, 0);
}

export function createDrumPattern(events) {
  const pattern = Array(MAX_STEPS).fill(false);
  let position = 0;
  for (const event of events) {
    if (event.note !== 'R' && position < MAX_STEPS) {
      pattern[Math.floor(position)] = true;
    }
    position += event.beats;
  }
  return pattern;
}

export function drumEvents(pattern) {
  return pattern.map((hit) => ({
    note: hit ? 'C2' : 'R', beats: 1
  }));
}

export function formatDuration(beats) {
  return `${beats} дол.; ${Number((beats * 60 / BPM).toFixed(3))} с`;
}

export function renderTracks(tracks) {
  if (tracks.length === 0) {
    return 'Дорожек пока нет.';
  }
  return tracks.map((track) => {
    if (track.type === 'ударные') {
      return `${track.id}. ${track.name} — ${formatDuration(durationBeats(track))}`;
    }
    const sound = track.sound ? track.sound.name : 'не выбран';
    return `${track.id}. ${track.name} (${track.type}) — ${formatDuration(durationBeats(track))}; звук: ${sound}`;
  }).join('\n');
}

export function renderSounds(sounds = SOUNDS) {
  return sounds.map((sound) => `${sound.id}. ${sound.name} — ${sound.description}`).join('\n');
}

export function renderComposition(tracks) {
  if (tracks.length === 0) {
    return 'Композиция пуста. Сначала создайте дорожку: /tracks.';
  }
  const beats = Math.max(...tracks.map(durationBeats));
  const header = Array.from({ length: MAX_STEPS }, (_, index) => index + 1);
  const rows = tracks.map((track) => {
    const cells = Array(MAX_STEPS).fill('.');
    const starts = Array(MAX_STEPS).fill(0);
    let position = 0;
    for (const event of track.events) {
      const end = position + event.beats;
      if (event.note !== 'R') {
        const first = Math.floor(position);
        starts[first]++;
        cells[first] = starts[first] > 1 ? '+' : 'X';
        for (let index = first + 1; index < Math.ceil(end); index++) {
          cells[index] = '-';
        }
      }
      position = end;
    }
    return `${track.id}: ${cells.join(' ')}`;
  });
  const notes = tracks.filter((track) => track.type !== 'ударные').map((track) => {
    const sequence = track.events.map((event) => `${event.note}:${event.beats}`).join(' ');
    return `${track.id}. Ноты: ${sequence || 'ноты не заданы'}`;
  });
  return [
    `Композиция: ${tracks.length} дор.; ${BPM} BPM; ${formatDuration(beats)}`,
    '8 шагов по 1 доле. X — начало, - — продолжение, . — пауза; + — несколько начал в доле.',
    `   ${header.join(' ')}`,
    ...rows,
    'Описание дорожек:',
    renderTracks(tracks),
    ...notes,
    'Все дорожки начинаются одновременно.'
  ].join('\n');
}
