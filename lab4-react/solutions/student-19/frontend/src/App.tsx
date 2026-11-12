import { useState } from 'react'

import { Button, Card, ProviderModelPanel, RequestLog } from '@my-app/ui-library'
import '@my-app/ui-library/style.css'

import { initialRequests, models, providers, rotationRules } from './data'
import './App.css'

import type { LLMRequest, LLMRequestStatus } from '@my-app/ui-library'

const STATUS_CYCLE: LLMRequestStatus[] = ['success', 'error', 'pending']

function App() {
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null)
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null)
  const [requests, setRequests] = useState<LLMRequest[]>(initialRequests)

  const selectedProvider = providers.find(provider => provider.id === selectedProviderId)
  const selectedModel = models.find(model => model.id === selectedModelId)
  const canAddRequest = selectedProvider !== undefined &&
    selectedProvider.available &&
    selectedModel !== undefined &&
    selectedModel.providerId === selectedProvider.id
  const selectionLabel = canAddRequest && selectedProvider && selectedModel
    ? `Выбрано: ${selectedProvider.name} / ${selectedModel.name}`
    : 'Выберите доступного провайдера и модель'

  const handleProviderSelect = (providerId: string): void => {
    setSelectedProviderId(providerId)
    setSelectedModelId(null)
  }

  const handleModelSelect = (modelId: string): void => {
    setSelectedModelId(modelId)
  }

  const handleAddRequest = (): void => {
    if (!canAddRequest || !selectedProvider || !selectedModel) {
      return
    }

    setRequests(previous => {
      const status = STATUS_CYCLE[previous.length % STATUS_CYCLE.length]
      const nextRequest: LLMRequest = {
        id: `request-${previous.length + 1}`,
        provider: selectedProvider.name,
        model: selectedModel.name,
        status,
        createdAt: new Date().toISOString(),
        tokens: 120 + (previous.length * 37) % 500,
      }

      return [...previous, nextRequest]
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>LLM Router</h1>
        <p>Выбор провайдера и модели, журнал запросов и правила ротации</p>
      </header>

      <main className="app-main">
        <div className="app-grid">
          <div className="app-column">
            <ProviderModelPanel
              providers={providers}
              models={models}
              selectedProviderId={selectedProviderId}
              selectedModelId={selectedModelId}
              onProviderSelect={handleProviderSelect}
              onModelSelect={handleModelSelect}
            />

            <Card title="Тестовый запрос">
              <div className="app-actions">
                <Button onClick={handleAddRequest} disabled={!canAddRequest}>
                  Добавить тестовый запрос
                </Button>
                <p className="app-hint">{selectionLabel}</p>
              </div>
            </Card>
          </div>

          <div className="app-column">
            <RequestLog requests={requests} rotationRules={rotationRules} />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Лабораторная работа 4 · React + TypeScript + Vite + Jest</p>
        <p>Данные демонстрационные, реальные запросы к LLM не выполняются</p>
      </footer>
    </div>
  )
}

export default App
