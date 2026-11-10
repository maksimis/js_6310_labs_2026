import { bubbleSortSteps, getSteps, insertionSortSteps, selectionSortSteps } from './sorting'

const input = [5, 3, 8, 1, 4]
const expected = [1, 3, 4, 5, 8]

describe.each([
  ['bubble', bubbleSortSteps],
  ['insertion', insertionSortSteps],
  ['selection', selectionSortSteps],
])('%s', (_name, sort) => {
  test('last step is sorted array, all elements marked sorted', () => {
    const steps = sort(input)
    const last = steps[steps.length - 1]

    expect(last.array).toEqual(expected)
    expect(last.sorted).toEqual([0, 1, 2, 3, 4])
    expect(last.comparing).toEqual([])
  })

  test('first step is the original array', () => {
    expect(sort(input)[0].array).toEqual(input)
  })

  test('does not change the input', () => {
    const copy = [...input]

    sort(copy)
    expect(copy).toEqual(input)
  })

  test('middle steps compare two elements', () => {
    const steps = sort(input)

    expect(steps[1].comparing).toHaveLength(2)
  })
})

describe('getSteps', () => {
  test('uses the selected algorithm', () => {
    expect(getSteps('insertion', input)).toEqual(insertionSortSteps(input))
  })

  test('falls back to bubble sort for unknown name', () => {
    expect(getSteps('unknown', input)).toEqual(bubbleSortSteps(input))
  })
})
