import { describe, expect, test } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'

import App from '../src/App'

describe('демонстрационное приложение', () => {
  test('показывает план, примеры задач и сводку', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'План на день' })).toBeInTheDocument()
    expect(screen.getByText('Утренняя зарядка')).toBeInTheDocument()
    const morningTask = screen.getByText('Утренняя зарядка').closest('article')

    expect(morningTask).toHaveTextContent('Каждый день')
    expect(screen.getByText('1 из 5 задач выполнено')).toBeInTheDocument()
  })

  test('добавляет задачу через публичный компонент формы', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Название задачи'), { target: { value: 'Сделать лабораторную' } })
    fireEvent.change(screen.getByLabelText('Время'), { target: { value: '11:20' } })
    fireEvent.click(screen.getByRole('button', { name: /Добавить задачу/ }))
    expect(screen.getByText('Сделать лабораторную')).toBeInTheDocument()
    expect(screen.getByText('11:20')).toBeInTheDocument()
    expect(screen.getByText('6', { selector: '.count-badge' })).toBeInTheDocument()
  })

  test('обновляет отметку выполнения и сводку', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('checkbox', { name: 'Отметить задачу «Подготовить план на день» как выполненную' }))
    expect(screen.getByText('2 из 5 задач выполнено')).toBeInTheDocument()
  })
})
