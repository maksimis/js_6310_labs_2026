import { useState } from 'react'

import './App.css'
import '@my-app/ui-library/style.css'
import { Button, Card } from '@my-app/ui-library'
import './App.css'

function App() {
  const [buttonClicks, setButtonClicks] = useState({
    primary: 0,
    secondary: 0,
    small: 0,
    medium: 0,
    large: 0,
    disabled: 0,
  })

  const handleButtonClick = (type: string) => {
    setButtonClicks(prev => ({
      ...prev,
      [type]: prev[type as keyof typeof prev] + 1
    }))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>UI Library Demo</h1>
        <p>Демонстрация всех возможностей библиотеки компонентов</p>
      </header>

      <main className="app-main">
        {/* Секция Button */}
        <section className="section">
          <h2>Button Компонент</h2>
          
          <Card title="Варианты кнопок (Variants)">
            <div className="demo-grid">
              <div className="demo-item">
                <Button variant="primary" onClick={() => handleButtonClick('primary')}>
                  Primary Button
                </Button>
                <span className="demo-counter">Кликов: {buttonClicks.primary}</span>
              </div>
              
              <div className="demo-item">
                <Button variant="secondary" onClick={() => handleButtonClick('secondary')}>
                  Secondary Button
                </Button>
                <span className="demo-counter">Кликов: {buttonClicks.secondary}</span>
              </div>
            </div>
          </Card>

          <Card title="Размеры кнопок (Sizes)">
            <div className="demo-grid">
              <div className="demo-item">
                <Button size="small" onClick={() => handleButtonClick('small')}>
                  Small Button
                </Button>
                <span className="demo-counter">Кликов: {buttonClicks.small}</span>
              </div>
              
              <div className="demo-item">
                <Button size="medium" onClick={() => handleButtonClick('medium')}>
                  Medium Button
                </Button>
                <span className="demo-counter">Кликов: {buttonClicks.medium}</span>
              </div>
              
              <div className="demo-item">
                <Button size="large" onClick={() => handleButtonClick('large')}>
                  Large Button
                </Button>
                <span className="demo-counter">Кликов: {buttonClicks.large}</span>
              </div>
            </div>
          </Card>

          <Card title="Состояния кнопок (States)">
            <div className="demo-grid">
              <div className="demo-item">
                <Button disabled onClick={() => handleButtonClick('disabled')}>
                  Disabled Button
                </Button>
                <span className="demo-counter">Кликов: {buttonClicks.disabled}</span>
              </div>
              
              <div className="demo-item">
                <Button variant="primary" disabled>
                  Disabled Primary
                </Button>
                <span className="demo-hint">(не кликабельно)</span>
              </div>
            </div>
          </Card>

          <Card title="Комбинации свойств">
            <div className="demo-grid">
              <div className="demo-item">
                <Button variant="primary" size="large">
                  Primary Large
                </Button>
              </div>
              
              <div className="demo-item">
                <Button variant="secondary" size="small">
                  Secondary Small
                </Button>
              </div>
              
              <div className="demo-item">
                <Button variant="primary" size="medium" disabled>
                  Primary Medium Disabled
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Секция Card */}
        <section className="section">
          <h2>Card Компонент</h2>

          <div className="cards-grid">
            <Card title="Карточка с заголовком">
              <p>Это обычная карточка с заголовком и содержимым.</p>
              <p>Может содержать любой контент: текст, кнопки, изображения.</p>
              <div className="card-actions">
                <Button variant="primary" size="small">Действие 1</Button>
                <Button variant="secondary" size="small">Действие 2</Button>
              </div>
            </Card>

            <Card>
              <h3 style={{ marginTop: 0 }}>Карточка без заголовка</h3>
              <p>Эта карточка не использует пропс title, заголовок добавлен внутри содержимого.</p>
              <ul>
                <li>Элемент списка 1</li>
                <li>Элемент списка 2</li>
                <li>Элемент списка 3</li>
              </ul>
            </Card>

            <Card title="Карточка с формой">
              <form onSubmit={(e) => e.preventDefault()} className="demo-form">
                <div className="form-group">
                  <label htmlFor="name">Имя:</label>
                  <input type="text" id="name" className="form-input" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" className="form-input" />
                </div>
                
                <Button variant="primary" type="submit">
                  Отправить
                </Button>
              </form>
            </Card>

            <Card title="Информационная карточка">
              <div className="info-content">
                <div className="info-item">
                  <strong>Статус:</strong> Активный
                </div>
                <div className="info-item">
                  <strong>Пользователей:</strong> 1,234
                </div>
                <div className="info-item">
                  <strong>Обновлено:</strong> Сегодня
                </div>
              </div>
              <Button variant="primary" size="small">
                Обновить данные
              </Button>
            </Card>
          </div>
        </section>

        {/* Секция взаимодействия компонентов */}
        <section className="section">
          <h2>Взаимодействие компонентов</h2>
          
          <Card title="Кнопки внутри карточек">
            <div className="interaction-demo">
              <div className="interaction-item">
                <Card title="Счетчик в карточке">
                  <div className="counter-demo">
                    <p>Текущее значение: {buttonClicks.primary}</p>
                    <Button 
                      variant="primary" 
                      onClick={() => handleButtonClick('primary')}
                    >
                      Увеличить счетчик
                    </Button>
                  </div>
                </Card>
              </div>
              
              <div className="interaction-item">
                <Card title="Управление состоянием">
                  <div className="state-demo">
                    <Button 
                      variant="secondary" 
                      disabled={buttonClicks.primary === 0}
                      onClick={() => setButtonClicks(prev => ({ ...prev, primary: 0 }))}
                    >
                      Сбросить счетчик ({buttonClicks.primary})
                    </Button>
                    <p className="demo-hint">
                      Кнопка disabled когда счетчик = 0
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <footer className="app-footer">
        <Card>
          <div className="footer-content">
            <p>UI Library v1.0.0 - Демонстрационное приложение</p>
            <p>React + TypeScript + Vite + Jest</p>
          </div>
        </Card>
      </footer>
    </div>
  )
}

export default App