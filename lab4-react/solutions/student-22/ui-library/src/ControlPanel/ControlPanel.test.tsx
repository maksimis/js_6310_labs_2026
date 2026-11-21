import { fireEvent, render, screen } from '@testing-library/react'

import { ControlPanel } from './ControlPanel'

import type { ControlPanelProps } from './ControlPanel'

const renderPanel = (props: Partial<ControlPanelProps> = {}) => {
  const handlers = {
    onAlgorithmChange: jest.fn(),
    onStep: jest.fn(),
    onPlayPause: jest.fn(),
    onReset: jest.fn(),
    onSpeedChange: jest.fn(),
  }

  render(
    <ControlPanel
      algorithms={[
        { value: 'bubble', label: 'Пузырёк' },
        { value: 'insertion', label: 'Вставки' },
      ]}
      algorithm="bubble"
      isPlaying={false}
      speed={5}
      {...handlers}
      {...props}
    />,
  )

  return handlers
}

describe('ControlPanel', () => {
  test('shows algorithms and calls onAlgorithmChange', () => {
    const handlers = renderPanel()

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'insertion' } })
    expect(handlers.onAlgorithmChange).toHaveBeenCalledWith('insertion')
    expect(screen.getByText('Вставки')).toBeInTheDocument()
  })

  test('buttons call handlers', () => {
    const handlers = renderPanel()

    fireEvent.click(screen.getByText('Шаг'))
    fireEvent.click(screen.getByText('Продолжить'))
    fireEvent.click(screen.getByText('Сброс'))
    expect(handlers.onStep).toHaveBeenCalledTimes(1)
    expect(handlers.onPlayPause).toHaveBeenCalledTimes(1)
    expect(handlers.onReset).toHaveBeenCalledTimes(1)
  })

  test('shows "Пауза" while playing and disables step', () => {
    renderPanel({ isPlaying: true })

    expect(screen.getByText('Пауза')).toBeInTheDocument()
    expect(screen.getByText('Шаг')).toBeDisabled()
  })

  test('disables step and play when finished', () => {
    renderPanel({ isFinished: true })

    expect(screen.getByText('Шаг')).toBeDisabled()
    expect(screen.getByText('Продолжить')).toBeDisabled()
    expect(screen.getByText('Сброс')).not.toBeDisabled()
  })

  test('changes speed', () => {
    const handlers = renderPanel()

    fireEvent.change(screen.getByRole('slider'), { target: { value: '8' } })
    expect(handlers.onSpeedChange).toHaveBeenCalledWith(8)
    expect(screen.getByText('Скорость: 5')).toBeInTheDocument()
  })
})
