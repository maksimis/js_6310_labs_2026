import { render, screen } from '@testing-library/react'

import { ProgressIndicator } from './ProgressIndicator'

describe('ProgressIndicator', () => {
  it('отображает переданные значения level, sequenceLength и record', () => {
    render(
      <ProgressIndicator level={2} sequenceLength={4} record={5} />
    )

    // Проверяем, что цифры отрисовались
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()

    // Проверяем текстовые метки
    expect(screen.getByText(/Уровень:/i)).toBeInTheDocument()
    expect(screen.getByText(/Длина:/i)).toBeInTheDocument()
    expect(screen.getByText(/Рекорд:/i)).toBeInTheDocument()
  })
})