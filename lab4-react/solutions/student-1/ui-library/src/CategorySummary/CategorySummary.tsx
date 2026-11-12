import './CategorySummary.css'

export interface CategoryTotal {
  category: string
  amount: number
}

export interface CategorySummaryProps {
  items: CategoryTotal[]
  month: string
  currency?: string
}

export const CategorySummary = ({ items, month, currency = '₽' }: CategorySummaryProps) => {
  const total = items.reduce((sum, item) => sum + item.amount, 0)
  const monthLabel = new Date(`${month}-01T00:00:00`).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })

  return (
    <section className="category-summary" aria-label={`Сводка расходов за ${monthLabel}`}>
      <div className="category-summary__heading"><div><p>РАСПРЕДЕЛЕНИЕ</p><h2>Расходы по категориям</h2></div><span>{monthLabel}</span></div>
      {items.length === 0 ? <p className="category-summary__empty">За этот месяц расходов пока нет</p> : (
        <ul className="category-summary__list">
          {items.map((item) => {
            const share = total > 0 ? item.amount / total * 100 : 0

            return (
              <li key={item.category}>
                <div className="category-summary__line"><strong>{item.category}</strong><span>{item.amount.toLocaleString('ru-RU')} {currency} <small>{share.toFixed(0)}%</small></span></div>
                <div className="category-summary__track" role="progressbar" aria-label={`Доля категории ${item.category}`} aria-valuenow={Math.round(share)} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${share}%` }} /></div>
              </li>
            )
          })}
        </ul>
      )}
      <div className="category-summary__total"><span>Всего за месяц</span><strong>{total.toLocaleString('ru-RU')} {currency}</strong></div>
    </section>
  )
}
