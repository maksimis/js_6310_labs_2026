import { fireEvent, render, screen } from '@testing-library/react'

import { KeyResultList } from '../index'

import type { KeyResult } from '../index'

describe('KeyResultList', () => {
  const sampleKrs: KeyResult[] = [
    { id: 1, title: 'Написать компоненты', target: 10, current: 5 },
    { id: 2, title: 'Написать тесты', target: 4, current: 4 },
  ]

  test('renders empty message when keyResults is empty', () => {
    render(<KeyResultList keyResults={[]} onProgressChange={jest.fn()} />)

    expect(screen.getByText('Нет ключевых результатов')).toBeInTheDocument()
  })

  test('renders key results with their contribution, progress and places completed ones lower', () => {
    const unorderedKrs: KeyResult[] = [
      { id: 1, title: 'Уже готовый результат', target: 4, current: 4 },
      { id: 2, title: 'В процессе выполнения', target: 10, current: 5 },
    ]

    render(<KeyResultList keyResults={unorderedKrs} onProgressChange={jest.fn()} />)

    const items = screen.getAllByText(/^\d+\./)

    expect(items[0]).toHaveTextContent('2. В процессе выполнения')
    expect(items[1]).toHaveTextContent('1. Уже готовый результат')
    expect(screen.getByText('выполнено 5 из 10 (50%)')).toBeInTheDocument()
    expect(screen.getByText('Вклад в цель: 25% из 50%')).toBeInTheDocument()
    expect(screen.getByText('выполнено 4 из 4 (100%)')).toBeInTheDocument()
    expect(screen.getByText('Вклад в цель: 50% из 50%')).toBeInTheDocument()
  })

  test('calls onProgressChange when slider or number input changes with valid value', () => {
    const handleProgressChange = jest.fn()

    render(<KeyResultList keyResults={sampleKrs} onProgressChange={handleProgressChange} />)

    const slider = screen.getByLabelText('Ползунок прогресса для Написать компоненты')

    fireEvent.change(slider, { target: { value: '8' } })
    expect(handleProgressChange).toHaveBeenCalledWith(1, 8)

    const numberInput = screen.getByLabelText('Текущее значение для Написать компоненты')

    fireEvent.change(numberInput, { target: { value: '9' } })
    expect(handleProgressChange).toHaveBeenCalledWith(1, 9)
  })

  test('ignores negative or invalid input values', () => {
    const handleProgressChange = jest.fn()

    render(<KeyResultList keyResults={sampleKrs} onProgressChange={handleProgressChange} />)

    const numberInput = screen.getByLabelText('Текущее значение для Написать компоненты')

    fireEvent.change(numberInput, { target: { value: '-5' } })
    expect(handleProgressChange).not.toHaveBeenCalled()
  })

  test('disables inputs when disabled prop is true', () => {
    render(<KeyResultList keyResults={sampleKrs} onProgressChange={jest.fn()} disabled />)

    const slider = screen.getByLabelText('Ползунок прогресса для Написать компоненты')
    const numberInput = screen.getByLabelText('Текущее значение для Написать компоненты')

    expect(slider).toBeDisabled()
    expect(numberInput).toBeDisabled()
  })
})
