import { answerQuestion } from './knowledge'

test('поиск не зависит от регистра и не считает повторные слова дважды', () => {
  const answer = answerQuestion('STATE state props')

  expect(answer.sources.map((source): string => source.id)).toEqual(['state', 'props'])
  expect(answer.sources.map((source): number => source.relevance)).toEqual([0.5, 0.5])
})

test('источник с большим числом совпадений идёт первым', () => {
  const answer = answerQuestion('props useEffect таймер')

  expect(answer.sources.map((source): string => source.id)).toEqual(['effects', 'props'])
  expect(answer.sources[0].relevance).toBeCloseTo(2 / 3)
  expect(answer.sources[0].url).toBe('#document-effects')
})

test.each(['', '???', 'Что это такое?', 'Борщ'])('нет ложных совпадений для запроса %s', (question: string) => {
  const answer = answerQuestion(question)

  expect(answer.sources).toEqual([])
  expect(answer.text).toContain('Источники не найдены')
})
