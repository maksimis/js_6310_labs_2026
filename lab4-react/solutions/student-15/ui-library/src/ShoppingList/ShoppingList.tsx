import React, { useMemo, useState } from 'react'

import styles from './ShoppingList.module.css'
import { Button } from '../Button/Button'

export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

export interface ShoppingListProps {
  items?: ShoppingItem[];
  onChange?: (items: ShoppingItem[]) => void;
}

const buildGroups = (items: ShoppingItem[]): [string, ShoppingItem[]][] => {
  const groups = new Map<string, ShoppingItem[]>()

  items.forEach((item) => {
    const group = groups.get(item.category) ?? []

    group.push(item)
    groups.set(item.category, group)
  })

  return Array.from(groups.entries())
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
  items: initialItems = [],
  onChange,
}) => {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')

  const groups = useMemo(() => buildGroups(items), [items])
  const checkedCount = items.filter((item) => item.checked).length

  const update = (next: ShoppingItem[]): void => {
    setItems(next)
    onChange?.(next)
  }

  const handleToggle = (id: string): void => {
    const next = items.map((item) => (
      item.id === id ? { ...item, checked: !item.checked } : item
    ))

    update(next)
  }

  const handleRemove = (id: string): void => {
    update(items.filter((item) => item.id !== id))
  }

  const handleAdd = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedCategory = category.trim()

    if (!trimmedName) {
      return
    }

    const next: ShoppingItem[] = [
      ...items,
      {
        id: `item-${Date.now()}-${items.length}`,
        name: trimmedName,
        category: trimmedCategory || 'Без категории',
        checked: false,
      },
    ]

    update(next)
    setName('')
    setCategory('')
  }

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h2 className={styles.title}>Список покупок</h2>
        <span className={styles.counter}>
          Куплено: {checkedCount} из {items.length}
        </span>
      </header>

      <form className={styles.form} onSubmit={handleAdd}>
        <input
          className={styles.input}
          type="text"
          value={name}
          placeholder="Новая позиция"
          aria-label="Название позиции"
          onChange={(event) => setName(event.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          value={category}
          placeholder="Категория"
          aria-label="Категория"
          onChange={(event) => setCategory(event.target.value)}
        />
        <Button type="submit" size="small">
          Добавить
        </Button>
      </form>

      {items.length === 0
        ? (
          <p className={styles.empty}>Список пуст. Добавьте первую позицию.</p>
        )
        : (
          <div className={styles.groups}>
            {groups.map(([groupName, groupItems]) => (
              <div className={styles.group} key={groupName}>
                <h3 className={styles.groupTitle}>{groupName}</h3>
                <ul className={styles.list}>
                  {groupItems.map((item) => (
                    <li className={styles.item} key={item.id}>
                      <label className={styles.label}>
                        <input
                          className={styles.checkbox}
                          type="checkbox"
                          checked={item.checked}
                          aria-label={item.name}
                          onChange={() => handleToggle(item.id)}
                        />
                        <span className={item.checked ? styles.checked : styles.name}>
                          {item.name}
                        </span>
                      </label>
                      <button
                        className={styles.remove}
                        type="button"
                        aria-label={`Удалить ${item.name}`}
                        onClick={() => handleRemove(item.id)}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
    </section>
  )
}
