import { render, screen } from '@testing-library/react'

import { Chart } from '../Chart/Chart'

describe('Chart', () => {
  test('отображает заголовок графика', () => {
    render(
      <Chart
        title="Посетители"
        data={[{ label: 'Янв', value: 100 }]}
      />
    )

    expect(screen.getByText('Посетители')).toBeInTheDocument()
  })

  test('отображает месяцы и значения шкалы', () => {
    render(
      <Chart
        title="Посетители"
        step={200}
        data={[
          { label: 'Янв', value: 100 },
          { label: 'Фев', value: 350 },
          { label: 'Мар', value: 750 }
        ]}
      />
    )

    expect(screen.getByText('Янв')).toBeInTheDocument()
    expect(screen.getByText('Фев')).toBeInTheDocument()
    expect(screen.getByText('Мар')).toBeInTheDocument()
    expect(screen.getByText('800')).toBeInTheDocument()
    expect(screen.getByText('600')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  test('строит линию и точки по данным', () => {
    const { container } = render(
      <Chart
        title="Посетители"
        data={[
          { label: 'Янв', value: 100 },
          { label: 'Фев', value: 300 }
        ]}
      />
    )

    expect(container.querySelector('polyline')).toBeInTheDocument()
    expect(container.querySelectorAll('circle')).toHaveLength(2)
  })

  test('корректно отображает одну точку', () => {
    const { container } = render(
      <Chart
        title="Продажи"
        data={[{ label: 'Янв', value: 100 }]}
      />
    )

    expect(container.querySelectorAll('circle')).toHaveLength(1)
  })

  test('показывает сообщение при отсутствии данных', () => {
    render(<Chart title="Посетители" data={[]} />)

    expect(screen.getByText('Нет данных для отображения')).toBeInTheDocument()
  })

  test('использует стандартный шаг, если передан некорректный шаг', () => {
    render(
      <Chart
        title="Посетители"
        step={0}
        data={[{ label: 'Янв', value: 100 }]}
      />
    )

    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})