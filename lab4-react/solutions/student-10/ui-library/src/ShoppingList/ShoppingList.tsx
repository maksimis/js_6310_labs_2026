import React, { useState } from 'react'

import { Meal, Ingredient, Unit } from '../Types/Types'

export interface ShoppingListProps {
  meals: Meal[]
  bought: string[]
  onToggle: (key: string) => void
  onAdd: (name: string, amount: number, unit: Unit) => void
}

const UNITS: Unit[] = ['л', 'шт', 'кг']
const keyOf = (ing: Ingredient) => `${ing.name}-${ing.unit}`

export const ShoppingList: React.FC<ShoppingListProps> = ({
  meals, bought, onToggle, onAdd,
}) => {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState(1)
  const [unit, setUnit] = useState<Unit>('шт')

  //все ингредиенты в один плоский список
  const all = meals.flatMap((m) => m.ingredients)
  //складываем одинаковые (имя + единица)
  const merged: Record<string, Ingredient> = {}

  all.forEach((ing) => {
    const key = keyOf(ing)

    if (!merged[key]) {
      merged[key] = { ...ing }
    } else {
      merged[key].amount += ing.amount
    }
  })
  const items = Object.values(merged)

  const handleAdd = () => {
    if (!name.trim() || amount <= 0) return
    onAdd(name.trim(), amount, unit)
    setName('')
    setAmount(1)
    setUnit('шт')
  }

  return (
    <div>
      <ul>
        {items.map((ing) => {
          const key = keyOf(ing)

          return (
            <li key={key}>
              <input
                type="checkbox"
                checked={bought.includes(key)}
                onChange={() => onToggle(key)}
              />
              {ing.name}, {ing.amount} {ing.unit}
            </li>
          )
        })}
      </ul>

      <div>
        <input
          type="text"
          placeholder="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
          {UNITS.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <button onClick={handleAdd}>Добавить</button>
      </div>
    </div>
  )
}