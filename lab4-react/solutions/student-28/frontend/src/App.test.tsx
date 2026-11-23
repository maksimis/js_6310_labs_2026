import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

describe('App', () => {
  test('renders NextTetromino and TetrisWell with initial preset and column labels', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: 'Лабораторная работа №4 — Тетрис (вариант 28)',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Фигура: T-образное (T)')).toBeInTheDocument()
    expect(screen.getByText('Цвет по умолчанию: #9b59b6')).toBeInTheDocument()
    expect(
      screen.getByText('Координаты: (1,0), (1,1), (1,2), (2,1)'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Стакан тетриса (10x20)' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Занято клеток: 33')).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: 'Столбец 10' }),
    ).toBeInTheDocument()
  })

  test('changes figure via select and Next button, and applies custom color', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.selectOptions(screen.getByLabelText('Выбрать фигуру'), '0')
    expect(
      screen.getByText('Фигура: I-образное (Прямое) (I)'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Следующая фигура' }))
    expect(
      screen.getByText('Фигура: O-образное (Квадрат) (O)'),
    ).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Цвет фигуры'), '#e91e63')
    const preview = screen.getByRole('grid', {
      name: 'Превью O-образное (Квадрат)',
    })

    expect(within(preview).getByRole('gridcell', { name: 'Ячейка 1,1' })).toHaveStyle({
      backgroundColor: '#e91e63',
    })
  })

  test('drops figure into selected column, changes well size, clears and resets', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.selectOptions(
      screen.getByLabelText('Размерность стакана'),
      '8x12',
    )
    expect(
      screen.getByRole('heading', { name: 'Стакан тетриса (8x12)' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Занято клеток: 27')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Очистить стакан' }))
    expect(screen.getByText('Занято клеток: 0')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Столбец для сброса'), '5')
    await user.click(
      screen.getByRole('button', { name: 'Сбросить в столбец' }),
    )
    expect(screen.getByText('Занято клеток: 4')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Сбросить пример' }))
    expect(screen.getByText('Занято клеток: 27')).toBeInTheDocument()

    await user.selectOptions(
      screen.getByLabelText('Размерность стакана'),
      '10x20',
    )
    expect(
      screen.getByRole('heading', { name: 'Стакан тетриса (10x20)' }),
    ).toBeInTheDocument()
  })

  test('shows message and keeps grid unchanged when there is no room for figure', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.selectOptions(
      screen.getByLabelText('Размерность стакана'),
      '8x12',
    )
    await user.selectOptions(screen.getByLabelText('Выбрать фигуру'), '1')
    await user.click(screen.getByRole('button', { name: 'Очистить стакан' }))

    const dropButton = screen.getByRole('button', { name: 'Сбросить в столбец' })

    for (let i = 0; i < 6; i += 1) {
      await user.click(dropButton)
    }

    expect(screen.getByText('Занято клеток: 24')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await user.click(dropButton)
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Нет места для фигуры в выбранном столбце',
    )
    expect(screen.getByText('Занято клеток: 24')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Сбросить пример' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  test('ignores unknown well size value', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('Размерность стакана'), {
      target: { value: '100x100' },
    })

    expect(
      screen.getByRole('heading', { name: 'Стакан тетриса (10x20)' }),
    ).toBeInTheDocument()
  })
})