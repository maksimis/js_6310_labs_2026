import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

describe('App', () => {
  test('renders the panel, the request log and initial requests', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Провайдер и модель' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Журнал запросов' })).toBeInTheDocument()
    expect(screen.getByText('Правила ротации')).toBeInTheDocument()
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(5)
  })

  test('filters models by the selected provider', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'OpenRouter доступен' }))

    expect(screen.getByRole('button', { name: 'Llama 3.3 70B Instruct' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mixtral 8x7B' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Добавить тестовый запрос' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Llama 3.3 70B Instruct' }))

    expect(screen.getByRole('button', { name: 'Добавить тестовый запрос' })).toBeEnabled()
    expect(screen.getByText('Выбрано: OpenRouter / Llama 3.3 70B Instruct')).toBeInTheDocument()
  })

  test('does not allow selecting an unavailable provider', async () => {
    const user = userEvent.setup()

    render(<App />)

    const mistral = screen.getByRole('button', { name: 'Mistral AI недоступен' })

    expect(mistral).toBeDisabled()

    await user.click(mistral)

    expect(screen.getByText('Выберите доступного провайдера и модель')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mistral Small' })).not.toBeInTheDocument()
  })

  test('adds a test request for the selected pair', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'OpenRouter доступен' }))
    await user.click(screen.getByRole('button', { name: 'Llama 3.3 70B Instruct' }))
    await user.click(screen.getByRole('button', { name: 'Добавить тестовый запрос' }))

    const rows = within(screen.getByRole('table')).getAllByRole('row')

    expect(rows).toHaveLength(6)
    expect(within(rows[5]).getByText('OpenRouter')).toBeInTheDocument()
    expect(within(rows[5]).getByText('Llama 3.3 70B Instruct')).toBeInTheDocument()
    expect(within(rows[5]).getByText('Ошибка')).toBeInTheDocument()
    expect(within(rows[5]).getByText('268')).toBeInTheDocument()
  })

  test('resets the model when the provider changes', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'OpenRouter доступен' }))
    await user.click(screen.getByRole('button', { name: 'Llama 3.3 70B Instruct' }))

    expect(screen.getByRole('button', { name: 'Добавить тестовый запрос' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Groq доступен' }))

    expect(screen.getByRole('button', { name: 'Добавить тестовый запрос' })).toBeDisabled()
    expect(screen.getByText('Выберите доступного провайдера и модель')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Llama 3.3 70B Instruct' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mixtral 8x7B' })).toBeInTheDocument()
  })
})
