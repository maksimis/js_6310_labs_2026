import './App.css'
import '@my-app/ui-library/style.css'
import { MetricCard, Chart } from '@my-app/ui-library'

function App() {
  const chartData = [
    { label: 'Янв', value: 100 },
    { label: 'Фев', value: 350 },
    { label: 'Мар', value: 280 },
    { label: 'Апр', value: 600 },
    { label: 'Май', value: 750 },
    { label: 'Июн', value: 500 }
  ]

  return (
    <div className="app">
      <header className="app-header">
        <h1>Панель аналитики</h1>
        <p>Демонстрация библиотеки компонентов</p>
      </header>

      <main className="app-main">
        <div className="app-content">
          <section className="section">
            <h2>Метрики</h2>
            <div className="demo-grid">
              <MetricCard title="Цена" value={414} change={12.75} />
              <MetricCard title="Спрос" value={56} change={-16.5} />
              <MetricCard title="Посетители" value={1230} change={0} />
            </div>
          </section>

          <section className="section">
            <h2>График</h2>
            <div className="chart-grid">
              <Chart
                title="Посетители"
                step={200}
                data={chartData}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App