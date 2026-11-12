import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  ProviderModelPanel,
  type LLMModel,
  type LLMProvider,
  type ProviderModelPanelProps,
} from './ProviderModelPanel'

const providers: LLMProvider[] = [
  { id: 'openrouter', name: 'OpenRouter', available: true },
  { id: 'groq', name: 'Groq', available: true },
  { id: 'mistral', name: 'Mistral AI', available: false },
  { id: 'empty', name: 'Empty Provider', available: true },
]

const models: LLMModel[] = [
  { id: 'llama', providerId: 'openrouter', name: 'Llama 3.3 70B' },
  { id: 'deepseek', providerId: 'openrouter', name: 'DeepSeek R1' },
  { id: 'mixtral', providerId: 'groq', name: 'Mixtral 8x7B' },
  { id: 'mistral-small', providerId: 'mistral', name: 'Mistral Small' },
]

const renderPanel = (overrides: Partial<ProviderModelPanelProps> = {}) => {
  const props: ProviderModelPanelProps = {
    providers,
    models,
    selectedProviderId: null,
    selectedModelId: null,
    onProviderSelect: jest.fn(),
    onModelSelect: jest.fn(),
    ...overrides,
  }

  return {
    props,
    ...render(<ProviderModelPanel {...props} />),
  }
}

describe('ProviderModelPanel', () => {
  test('renders providers with availability state', () => {
    renderPanel()

    expect(screen.getByRole('button', { name: 'OpenRouter доступен' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Mistral AI недоступен' })).toBeDisabled()
  })

  test('selects an available provider', async () => {
    const user = userEvent.setup()
    const { props } = renderPanel()

    await user.click(screen.getByRole('button', { name: 'OpenRouter доступен' }))

    expect(props.onProviderSelect).toHaveBeenCalledWith('openrouter')
  })

  test('does not select an unavailable provider', async () => {
    const user = userEvent.setup()
    const { props } = renderPanel()

    await user.click(screen.getByRole('button', { name: 'Mistral AI недоступен' }))

    expect(props.onProviderSelect).not.toHaveBeenCalled()
  })

  test('asks to choose a provider before showing models', () => {
    renderPanel()

    expect(screen.getByText('Сначала выберите провайдера')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Llama 3.3 70B' })).not.toBeInTheDocument()
  })

  test('shows only models of the selected provider', () => {
    renderPanel({ selectedProviderId: 'openrouter' })

    expect(screen.getByRole('button', { name: 'Llama 3.3 70B' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'DeepSeek R1' })).toBeEnabled()
    expect(screen.queryByRole('button', { name: 'Mixtral 8x7B' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mistral Small' })).not.toBeInTheDocument()
  })

  test('selects a model of the selected provider', async () => {
    const user = userEvent.setup()
    const { props } = renderPanel({ selectedProviderId: 'openrouter' })

    await user.click(screen.getByRole('button', { name: 'DeepSeek R1' }))

    expect(props.onModelSelect).toHaveBeenCalledWith('deepseek')
  })

  test('marks the selected provider and model', () => {
    renderPanel({ selectedProviderId: 'openrouter', selectedModelId: 'llama' })

    expect(screen.getByRole('button', { name: 'OpenRouter доступен' }))
      .toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Groq доступен' }))
      .toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Llama 3.3 70B' }))
      .toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'DeepSeek R1' }))
      .toHaveAttribute('aria-pressed', 'false')
  })

  test('disables models of an unavailable provider', async () => {
    const user = userEvent.setup()
    const { props } = renderPanel({ selectedProviderId: 'mistral' })
    const modelButton = screen.getByRole('button', { name: 'Mistral Small' })

    expect(modelButton).toBeDisabled()

    await user.click(modelButton)

    expect(props.onModelSelect).not.toHaveBeenCalled()
  })

  test('shows a message when there are no providers', () => {
    renderPanel({ providers: [], models: [] })

    expect(screen.getByText('Провайдеры не найдены')).toBeInTheDocument()
  })

  test('shows a message when the selected provider has no models', () => {
    renderPanel({ selectedProviderId: 'empty' })

    expect(screen.getByText('У выбранного провайдера нет моделей')).toBeInTheDocument()
  })
})
