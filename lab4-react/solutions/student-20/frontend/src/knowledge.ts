import type { SourceFragment } from '@my-app/ui-library'

interface Note {
  id: string
  title: string
  keywords: readonly string[]
  excerpt: string
  text: string
}

export const notes: readonly Note[] = [
  {
    id: 'state',
    title: 'State: память компонента',
    keywords: ['state', 'usestate', 'состояние', 'состояния', 'состоянием', 'состоянии', 'состоянию'],
    excerpt: 'State — внутренняя память компонента. Например, это введённое сообщение или история чата.',
    text: 'State — внутренняя память компонента. Например, это введённое сообщение или история чата. Хук useState возвращает текущее значение и функцию обновления. В отличие от props, состоянием управляет сам компонент. Обновление состояния запрашивает новый рендер; значение внутри уже выполняющегося обработчика остаётся прежним. Массивы и объекты в состоянии заменяют новыми, а не изменяют напрямую.',
  },
  {
    id: 'props',
    title: 'Props: данные от родителя',
    keywords: ['props', 'пропсы', 'пропсов', 'свойства', 'свойств', 'родитель', 'родителя'],
    excerpt: 'Props — входные данные компонента. Родитель может передать текст, массив сообщений или функцию обработки отправки.',
    text: 'Props — входные данные компонента. Родитель может передать текст, массив сообщений или функцию обработки отправки. Дочерний компонент читает props, но не изменяет их. Чтобы запросить изменение, он вызывает переданный обработчик. Родитель обновляет своё состояние и передаёт новые props. Так один компонент отвечает за данные, а другой — за их отображение.',
  },
  {
    id: 'effects',
    title: 'Effects: связь с внешней средой',
    keywords: ['effect', 'effects', 'useeffect', 'эффект', 'эффекты', 'эффектов', 'таймер', 'таймера', 'очистка'],
    excerpt: 'Эффект нужен для синхронизации с внешней системой: например, подпиской, таймером или браузерным API.',
    text: 'Эффект нужен для синхронизации с внешней системой: например, подпиской, таймером или браузерным API. useEffect запускается после фиксации обновления интерфейса. Массив зависимостей определяет, когда синхронизацию повторять. Возвращённая функция очистки вызывается перед повторным запуском эффекта и при размонтировании. В режиме разработки StrictMode дополнительно проверяет корректность очистки. Обычную обработку нажатия кнопки следует оставлять в обработчике события.',
  },
]

interface LocalAnswer {
  text: string
  sources: SourceFragment[]
}

const stopWords: ReadonlySet<string> = new Set(['что', 'это', 'как', 'чем', 'для', 'или', 'такое', 'такой', 'отличается', 'расскажи', 'объясни', 'про'])

export function answerQuestion(question: string): LocalAnswer {
  const words = [...new Set(question.toLowerCase().split(/[^a-zа-яё0-9]+/u).filter((word: string): boolean => word.length > 2 && !stopWords.has(word)))]
  const ranked = notes.map((note: Note) => ({
    note,
    matches: words.filter((word: string): boolean => note.keywords.includes(word)).length,
  })).filter((entry): boolean => entry.matches > 0).sort((a, b): number => b.matches - a.matches)
  const sources: SourceFragment[] = ranked.map(({ note, matches }): SourceFragment => ({
    id: note.id,
    title: note.title,
    excerpt: note.excerpt,
    relevance: matches / words.length,
    url: `#document-${note.id}`,
  }))

  return {
    text: ranked.length > 0
      ? ranked.map(({ note }): string => note.text).join('\n\n')
      : 'В локальных заметках нет ответа на этот вопрос. Попробуйте спросить о state, props или useEffect. Источники не найдены.',
    sources,
  }
}
