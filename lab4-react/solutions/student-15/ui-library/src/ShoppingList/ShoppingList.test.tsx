import { render, screen, fireEvent } from '@testing-library/react'

import { ShoppingList } from './ShoppingList'

import type { ShoppingItem } from './ShoppingList'

const initialItems: ShoppingItem[] = [
  { id: '1', name: 'Молоко', category: 'Молочные', checked: false },
  { id: '2', name: 'Сыр', category: 'Молочные', checked: true },
  { id: '3', name: 'Хлеб', category: 'Выпечка', checked: false },
]

describe('ShoppingList', () => {
  test('renders empty state when there are no items', () => {
    render(<ShoppingList />)

    expect(screen.getByText('Список пуст. Добавьте первую позицию.')).toBeInTheDocument()
  })

  test('renders items grouped by category', () => {
    render(<ShoppingList items={initialItems} />)

    expect(screen.getByText('Молочные')).toBeInTheDocument()
    expect(screen.getByText('Выпечка')).toBeInTheDocument()
    expect(screen.getByText('Молоко')).toBeInTheDocument()
    expect(screen.getByText('Сыр')).toBeInTheDocument()
    expect(screen.getByText('Хлеб')).toBeInTheDocument()
  })

  test('shows the amount of checked items', () => {
    render(<ShoppingList items={initialItems} />)

    expect(screen.getByText('Куплено: 1 из 3')).toBeInTheDocument()
  })

  test('toggles an item when the checkbox is clicked', () => {
    const handleChange = jest.fn()

    render(<ShoppingList items={initialItems} onChange={handleChange} />)

    fireEvent.click(screen.getByLabelText('Молоко'))

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith([
      { id: '1', name: 'Молоко', category: 'Молочные', checked: true },
      { id: '2', name: 'Сыр', category: 'Молочные', checked: true },
      { id: '3', name: 'Хлеб', category: 'Выпечка', checked: false },
    ])
    expect(screen.getByText('Куплено: 2 из 3')).toBeInTheDocument()
  })

  test('removes an item', () => {
    const handleChange = jest.fn()

    render(<ShoppingList items={initialItems} onChange={handleChange} />)

    fireEvent.click(screen.getByLabelText('Удалить Хлеб'))

    expect(screen.queryByText('Хлеб')).not.toBeInTheDocument()
    expect(handleChange).toHaveBeenCalledWith([
      { id: '1', name: 'Молоко', category: 'Молочные', checked: false },
      { id: '2', name: 'Сыр', category: 'Молочные', checked: true },
    ])
  })

  test('adds a new item with the chosen category', () => {
    const handleChange = jest.fn()

    render(<ShoppingList items={initialItems} onChange={handleChange} />)

    fireEvent.change(screen.getByLabelText('Название позиции'), { target: { value: 'Яблоки' } })
    fireEvent.change(screen.getByLabelText('Категория'), { target: { value: 'Фрукты' } })
    fireEvent.click(screen.getByText('Добавить'))

    expect(screen.getByText('Яблоки')).toBeInTheDocument()
    expect(screen.getByText('Фрукты')).toBeInTheDocument()
    expect(handleChange).toHaveBeenCalledTimes(1)

    const nextItems = handleChange.mock.calls[0][0] as ShoppingItem[]

    expect(nextItems).toHaveLength(4)
    expect(nextItems[3]).toMatchObject({ name: 'Яблоки', category: 'Фрукты', checked: false })
  })

  test('adds an item to the default category and clears the name field', () => {
    const handleChange = jest.fn()

    render(<ShoppingList onChange={handleChange} />)

    const nameInput = screen.getByLabelText('Название позиции')

    fireEvent.change(nameInput, { target: { value: 'Соль' } })
    fireEvent.click(screen.getByText('Добавить'))

    expect(screen.getByText('Без категории')).toBeInTheDocument()
    expect(screen.getByText('Соль')).toBeInTheDocument()
    expect(nameInput).toHaveValue('')
  })

  test('does not add an item with a blank name', () => {
    const handleChange = jest.fn()

    render(<ShoppingList onChange={handleChange} />)

    fireEvent.change(screen.getByLabelText('Название позиции'), { target: { value: '   ' } })
    fireEvent.click(screen.getByText('Добавить'))

    expect(handleChange).not.toHaveBeenCalled()
    expect(screen.getByText('Список пуст. Добавьте первую позицию.')).toBeInTheDocument()
  })
})
