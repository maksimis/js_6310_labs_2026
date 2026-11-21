import {
  calculateGoalProgress,
  calculateKrContribution,
  calculateKrProgress,
  calculateOverallProgress,
  getFilledSquaresCount,
  getStatusLabel,
  isNonNegativeNumber,
  isPositiveNumber,
  isValidDate,
  isValidId,
  isValidTitle,
  resolveGoalStatus,
} from './index'

describe('okrUtils', () => {
  test('isValidTitle validates titles like in lab3', () => {
    expect(isValidTitle('Разработать библиотеку')).toBe(true)
    expect(isValidTitle('')).toBe(false)
    expect(isValidTitle('   ')).toBe(false)
    expect(isValidTitle('/start')).toBe(false)
    expect(isValidTitle('a'.repeat(101))).toBe(false)
  })

  test('isValidDate validates future DD.MM.YYYY dates', () => {
    expect(isValidDate('31.12.2028')).toBe(true)
    expect(isValidDate('')).toBe(false)
    expect(isValidDate('2028-12-31')).toBe(false)
    expect(isValidDate('31.13.2028')).toBe(false)
    expect(isValidDate('00.10.2028')).toBe(false)
    expect(isValidDate('15.10.2105')).toBe(false)
    expect(isValidDate('31.02.2028')).toBe(false)
    expect(isValidDate('01.01.2024')).toBe(false)
  })

  test('number and id validators work properly', () => {
    expect(isPositiveNumber(5)).toBe(true)
    expect(isPositiveNumber(0)).toBe(false)
    expect(isPositiveNumber(-3)).toBe(false)
    expect(isPositiveNumber('abc')).toBe(false)

    expect(isNonNegativeNumber(0)).toBe(true)
    expect(isNonNegativeNumber(10)).toBe(true)
    expect(isNonNegativeNumber(-1)).toBe(false)

    expect(isValidId(1)).toBe(true)
    expect(isValidId(0)).toBe(false)
    expect(isValidId(1.5)).toBe(false)
  })

  test('progress calculations match lab3 formulas', () => {
    expect(calculateKrProgress({ id: 1, title: 'KR', target: 0, current: 5 })).toBe(0)
    expect(calculateKrProgress({ id: 1, title: 'KR', target: 10, current: 5 })).toBe(50)
    expect(calculateKrProgress({ id: 1, title: 'KR', target: 1000, current: 999 })).toBe(99)
    expect(calculateKrProgress({ id: 1, title: 'KR', target: 10, current: 15 })).toBe(100)

    expect(calculateKrContribution({ id: 1, title: 'KR', target: 10, current: 5 }, 0)).toBe(0)
    expect(calculateKrContribution({ id: 1, title: 'KR', target: 10, current: 5 }, 2)).toBe(25)

    expect(calculateGoalProgress({ keyResults: [] })).toBe(0)
    expect(
      calculateGoalProgress({
        keyResults: [
          { id: 1, title: 'KR1', target: 10, current: 5 },
          { id: 2, title: 'KR2', target: 10, current: 10 },
        ],
      })
    ).toBe(75)
    expect(
      calculateGoalProgress({
        keyResults: [
          { id: 1, title: 'KR1', target: 1000, current: 1000 },
          { id: 2, title: 'KR2', target: 1000, current: 1000 },
          { id: 3, title: 'KR3', target: 1000, current: 999 },
        ],
      })
    ).toBe(99)
    expect(
      calculateGoalProgress({
        keyResults: [
          { id: 1, title: 'KR1', target: 10, current: 10 },
          { id: 2, title: 'KR2', target: 5, current: 5 },
        ],
      })
    ).toBe(100)

    expect(calculateOverallProgress([])).toBe(0)
    expect(
      calculateOverallProgress([
        {
          id: 1,
          title: 'G1',
          deadline: '31.12.2028',
          keyResults: [{ id: 1, title: 'KR1', target: 10, current: 10 }],
        },
        {
          id: 2,
          title: 'G2',
          deadline: '31.12.2028',
          keyResults: [{ id: 1, title: 'KR2', target: 10, current: 0 }],
        },
      ])
    ).toBe(50)
    expect(
      calculateOverallProgress([
        {
          id: 1,
          title: 'G1',
          deadline: '31.12.2028',
          keyResults: [{ id: 1, title: 'KR1', target: 10, current: 10 }],
        },
      ])
    ).toBe(100)
  })

  test('resolveGoalStatus and helpers return expected values', () => {
    expect(resolveGoalStatus(0)).toBe('not_started')
    expect(resolveGoalStatus(40)).toBe('in_progress')
    expect(resolveGoalStatus(40, 'urgent')).toBe('urgent')
    expect(resolveGoalStatus(40, 'in_progress')).toBe('in_progress')
    expect(resolveGoalStatus(100, 'urgent')).toBe('completed')

    expect(getStatusLabel('not_started')).toBe('Не начато')
    expect(getStatusLabel('in_progress')).toBe('В работе')
    expect(getStatusLabel('urgent')).toBe('Срочное')
    expect(getStatusLabel('completed')).toBe('Выполнено')

    expect(getFilledSquaresCount(-10)).toBe(0)
    expect(getFilledSquaresCount(39)).toBe(3)
    expect(getFilledSquaresCount(150)).toBe(10)
  })
})
