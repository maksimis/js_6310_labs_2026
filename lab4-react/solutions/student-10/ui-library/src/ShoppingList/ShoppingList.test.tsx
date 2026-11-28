import { render, screen, fireEvent } from '@testing-library/react'

import { ShoppingList } from './ShoppingList'

import type { Meal } from '../Types/Types'

const omelet: Meal = {
  id: '1',
  name: 'Омлет',
  ingredients: [
    { name: 'яйца', amount: 3, unit: 'шт' },
    { name: 'молоко', amount: 1, unit: 'л' },
  ],
}
const eggs: Meal = {
  id: '2',
  name: 'Яичница',
  ingredients: [
    { name: 'яйца', amount: 2, unit: 'шт' },
    { name: 'молоко', amount: 1, unit: 'кг' },
  ],
}

describe('ShoppingList', () => {
  it('пустой список', () => {
    render(<ShoppingList meals={[]} bought={[]} onToggle={jest.fn()} onAdd={jest.fn()} />)
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('суммирует одинаковые ингредиенты', () => {
    render(<ShoppingList meals={[omelet, eggs]} bought={[]} onToggle={jest.fn()} onAdd={jest.fn()} />)
    expect(screen.getByText(/яйца, 5 шт/)).toBeTruthy()
  })

  it('разные единицы остаются отдельными строками', () => {
    render(<ShoppingList meals={[omelet, eggs]} bought={[]} onToggle={jest.fn()} onAdd={jest.fn()} />)
    expect(screen.getByText(/молоко, 1 л/)).toBeTruthy()
    expect(screen.getByText(/молоко, 1 кг/)).toBeTruthy()
  })

  it('отмечает купленное и вызывает onToggle', () => {
    const onToggle = jest.fn()

    render(<ShoppingList meals={[omelet]} bought={['яйца-шт']} onToggle={onToggle} onAdd={jest.fn()} />)
    const boxes = screen.getAllByRole('checkbox') as HTMLInputElement[]

    expect(boxes[0].checked).toBe(true)
    expect(boxes[1].checked).toBe(false)
    fireEvent.click(boxes[1])
    expect(onToggle).toHaveBeenCalledWith('молоко-л')
  })

  it('добавление вызывает onAdd и очищает поля', () => {
    const onAdd = jest.fn()

    render(<ShoppingList meals={[]} bought={[]} onToggle={jest.fn()} onAdd={onAdd} />)
    const name = screen.getByPlaceholderText('Название') as HTMLInputElement

    fireEvent.change(name, { target: { value: '  хлеб ' } })
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '2' } })
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'кг' } })
    fireEvent.click(screen.getByText('Добавить'))
    expect(onAdd).toHaveBeenCalledWith('хлеб', 2, 'кг')
    expect(name.value).toBe('')
  })

  it('не добавляет пустое название или количество <= 0', () => {
    const onAdd = jest.fn()

    render(<ShoppingList meals={[]} bought={[]} onToggle={jest.fn()} onAdd={onAdd} />)
    fireEvent.click(screen.getByText('Добавить'))
    fireEvent.change(screen.getByPlaceholderText('Название'), { target: { value: 'хлеб' } })
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '0' } })
    fireEvent.click(screen.getByText('Добавить'))
    expect(onAdd).not.toHaveBeenCalled()
  })
})