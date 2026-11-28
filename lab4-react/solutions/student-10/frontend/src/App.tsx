import { useState } from 'react'

import './App.css'
import '@my-app/ui-library/style.css'
import { MealCalendar, ShoppingList } from '@my-app/ui-library'

import { DAYS, EATINGS, MEALS } from './data'

import type { Day, Eating, Meal, Ingredient, Unit } from '@my-app/ui-library'

function App() {
  const [selected, setSelected] = useState<Record<string, Meal>>({})
  const [bought, setBought] = useState<string[]>([])
  const [manual, setManual] = useState<Ingredient[]>([])

  const handleChoice = (d: Day, eat: Eating, m: Meal | null) => {
    const key = `${d}-${eat}`

    setSelected((prev) => {
      const next = { ...prev }

      if (m) next[key] = m
      else delete next[key]

      return next
    })
  }

  const handleToggle = (key: string) => {
    setBought((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )
  }

  const handleAdd = (name: string, amount: number, unit: Unit) => {
    setManual((prev) => [...prev, { name, amount, unit }])
  }

  const mealsForList: Meal[] = [
    ...Object.values(selected),
    { id: 'manual', name: 'Добавлено вручную', ingredients: manual },
  ]

  return (
    <div className="app">
      <h1>Планировщик питания</h1>

      <section>
        <h2>Календарь блюд</h2>
        <MealCalendar
          day={DAYS}
          eating={EATINGS}
          meal={MEALS}
          selected={selected}
          choice={handleChoice}
        />
      </section>

      <section>
        <h2>Список покупок</h2>
        <ShoppingList
          meals={mealsForList}
          bought={bought}
          onToggle={handleToggle}
          onAdd={handleAdd}
        />
      </section>
    </div>
  )
}

export default App