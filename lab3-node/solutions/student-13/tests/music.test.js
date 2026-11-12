import { describe, test, expect } from '@jest/globals';
import {
  createSession, validateName, findTrack, parseSequence, durationBeats,
  formatDuration, renderTracks, renderSounds, renderComposition, createDrumPattern, drumEvents
} from '../src/music.js';

function track(events = [], sound = null) {
  return { id: 1, name: 'Lead', type: 'мелодия', events, sound };
}

describe('Валидация дорожек', () => {
  test('сессии не делят массив дорожек и черновик', () => {
    const first = createSession();
    const second = createSession();
    first.tracks.push(track());
    first.draft.name = 'Lead';
    expect(second.tracks).toEqual([]);
    expect(second.draft).toEqual({});
    expect(first.state).toBe('idle');
  });

  test('принимает название на границе длины и обычный текст', () => {
    expect(validateName('а'.repeat(32), [])).toHaveLength(32);
    expect(validateName('Бас & ритм', [])).toBe('Бас & ритм');
  });

  test.each(['', 'a'.repeat(33), 'a\nb', 'a\tb', 'a\u0000b', 'a\u202eb'])(
    'отклоняет некорректное название %j', (name) => {
      expect(() => validateName(name, [])).toThrow('Название');
    }
  );

  test('не допускает одинаковые названия без учёта регистра', () => {
    expect(() => validateName('lead', [track()])).toThrow('уже есть');
  });

  test('находит дорожку по номеру', () => {
    const item = track();
    expect(findTrack([item], '1')).toBe(item);
  });

  test.each(['0', '-1', '1.5', '1abc', '01', 'NaN', ''])('отклоняет номер %j', (id) => {
    expect(() => findTrack([track()], id)).toThrow('целый положительный');
  });

  test('отклоняет отсутствующую дорожку', () => {
    expect(() => findTrack([track()], '2')).toThrow('не найдена');
  });
});

describe('Ноты и длительности', () => {
  test('аккорд — одно событие с общей длительностью, регистр нормализуется', () => {
    const events = parseSequence('c4+e4+g4:2 R:0.5 D4+F#4+A4:1');
    expect(events).toEqual([
      { note: 'C4+E4+G4', beats: 2 },
      { note: 'R', beats: 0.5 },
      { note: 'D4+F#4+A4', beats: 1 }
    ]);
    expect(durationBeats(track(events))).toBe(3.5);
    expect(renderComposition([track(events)])).toContain('C4+E4+G4:2');
  });

  test.each(['C4++E4:1', '+C4:1', 'C4+:1', 'C4+R:1', 'C4+H4:1',
    'C4+E9:1', 'C4 + E4:1', 'C4+E4:0', 'C4:1+E4:1'])(
    'отклоняет некорректный аккорд %s', (text) => {
      expect(() => parseSequence(text)).toThrow('Формат');
    }
  );
  test('переводит начала ударов в 8 шагов, включая границу паттерна', () => {
    const pattern = createDrumPattern(parseSequence('C2:1 R:1 C2:0.25'));
    expect(pattern).toHaveLength(8);
    expect(pattern.flatMap((hit, index) => hit ? [index] : [])).toEqual([0, 2]);
    expect(createDrumPattern([]).every((hit) => !hit)).toBe(true);
    const overflow = createDrumPattern([
      { note: 'R', beats: 8 }, { note: 'C2', beats: 1 }
    ]);
    expect(overflow).toHaveLength(8);
    expect(overflow.every((hit) => !hit)).toBe(true);
  });

  test('удары и паузы сетки превращаются в обычные события композиции', () => {
    const pattern = Array(8).fill(false);
    pattern[0] = true;
    const events = drumEvents(pattern);
    expect(events[0]).toEqual({ note: 'C2', beats: 1 });
    expect(events[1]).toEqual({ note: 'R', beats: 1 });
    expect(durationBeats(track(events))).toBe(8);
    const drums = { ...track(events), type: 'ударные' };
    expect(renderComposition([drums])).toContain('1: X . . . . . . .');
    expect(renderComposition([drums])).not.toContain('R:');
  });
  test('разбирает ноты, диез, бемоль и паузу; нормализует регистр', () => {
    expect(parseSequence(' c4:1  C#4:0.5\nDb4:0.25 r:2 ')).toEqual([
      { note: 'C4', beats: 1 },
      { note: 'C#4', beats: 0.5 },
      { note: 'Db4', beats: 0.25 },
      { note: 'R', beats: 2 }
    ]);
  });

  test.each(['', 'C4', 'H4:1', 'C9:1', 'C-1:1', 'C4:0', 'C4:-1',
    'C4:0.3', 'C4:NaN', 'C4:Infinity', 'C4:1xxx', 'C4:1 D4:bad'])(
    'отклоняет последовательность %j целиком', (text) => {
      expect(() => parseSequence(text)).toThrow('Формат');
    }
  );

  test('принимает ровно 8 долей и отвергает превышение', () => {
    expect(parseSequence('C4:4 R:4')).toHaveLength(2);
    expect(() => parseSequence('C4:4 R:4 C4:0.25')).toThrow('слишком длинная');
  });

  test('длительность учитывает и ноты, и паузы', () => {
    const item = track(parseSequence('C4:1 R:0.5'));
    expect(durationBeats(item)).toBe(1.5);
    expect(formatDuration(1.5)).toBe('1.5 дол.; 0.75 с');
    expect(formatDuration(0.25)).toBe('0.25 дол.; 0.125 с');
    expect(durationBeats(track())).toBe(0);
  });
});

describe('Отображение композиции', () => {
  test('список пустых дорожек, звуков и назначенный звук', () => {
    expect(renderTracks([])).toBe('Дорожек пока нет.');
    expect(renderTracks([track()])).toContain('звук: не выбран');
    expect(renderTracks([track([], { name: 'Piano' })])).toContain('звук: Piano');
    expect(renderSounds()).toContain('1. Piano');
    expect(renderSounds()).toContain('6. Hi-hat');
  });

  test('пустая композиция предлагает создать дорожку', () => {
    expect(renderComposition([])).toContain('/tracks');
    expect(renderComposition([track()])).toContain('ноты не заданы');
  });

  test('строит сетку с началом, продолжением, паузами и дополнением короткой дорожки', () => {
    const long = track(parseSequence('C4:2 R:1'));
    const short = { ...track(parseSequence('D4:0.25')), id: 2, name: 'Bass' };
    const result = renderComposition([long, short]);
    expect(result).toContain('1 2 3 4 5 6 7 8');
    expect(result).toContain('1: X - . . . . . .');
    expect(result).toContain('2: X . . . . . . .');
    expect(result).toContain('120 BPM; 3 дол.; 1.5 с');
    expect(result).toContain('C4:2 R:1');
    // Параллельные дорожки: длительность равна максимуму, а не сумме.
    expect(result).not.toContain('0.625 с');
  });

  test('показывает несколько коротких нот в одной доле без расширения сетки', () => {
    const result = renderComposition([track(parseSequence('C4:0.25 D4:0.25 E4:0.5'))]);
    expect(result).toContain('1: + . . . . . . .');
    expect(result).toContain('C4:0.25 D4:0.25 E4:0.5');
  });
});
