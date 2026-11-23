import { describe, expect, jest, test } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TaskForm } from '../src/components/TaskForm'

describe('TaskForm', () => {
  test('показывает поля названия, времени и повтора', () => {
    render(<TaskForm onSubmit={jest.fn()} />)
    expect(screen.getByLabelText('Название задачи')).toBeInTheDocument()
    expect(screen.getByLabelText('Время')).toBeInTheDocument()
    expect(screen.getByLabelText('Повтор')).toBeInTheDocument()
  })

  test('показывает ошибку для пустого названия и не отправляет форму', () => {
    const onSubmit = jest.fn()

    render(<TaskForm onSubmit={onSubmit} />)
    fireEvent.change(screen.getByLabelText('Время'), { target: { value: '10:30' } })
    fireEvent.click(screen.getByRole('button', { name: /Добавить задачу/ }))
    expect(screen.getByText('Введите название задачи.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  test('показывает ошибку при отсутствии времени и не отправляет форму', () => {
    const onSubmit = jest.fn()

    render(<TaskForm onSubmit={onSubmit} />)
    fireEvent.change(screen.getByLabelText('Название задачи'), { target: { value: 'Почитать' } })
    fireEvent.click(screen.getByRole('button', { name: /Добавить задачу/ }))
    expect(screen.getByText('Укажите время выполнения.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  test('передаёт очищенные данные с выбранным повтором и очищает форму после отправки', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()

    render(<TaskForm onSubmit={onSubmit} />)
    await user.type(screen.getByLabelText('Название задачи'), '  Купить хлеб  ')
    await user.type(screen.getByLabelText('Время'), '08:45')
    await user.selectOptions(screen.getByLabelText('Повтор'), 'weekdays')
    await user.click(screen.getByRole('button', { name: /Добавить задачу/ }))
    expect(onSubmit).toHaveBeenCalledWith({ title: 'Купить хлеб', time: '08:45', repeat: 'weekdays' })
    expect(screen.getByLabelText('Название задачи')).toHaveValue('')
    expect(screen.getByLabelText('Время')).toHaveValue('')
    expect(screen.getByLabelText('Повтор')).toHaveValue('none')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  test('позволяет выбрать отсутствие повтора', async () => {
    const user = userEvent.setup()

    render(<TaskForm onSubmit={jest.fn()} />)
    await user.selectOptions(screen.getByLabelText('Повтор'), 'daily')
    expect(screen.getByLabelText('Повтор')).toHaveValue('daily')
  })
})
