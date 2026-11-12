import React from 'react'

import styles from './ProviderModelPanel.module.css'

export interface LLMProvider {
  id: string;
  name: string;
  available: boolean;
}

export interface LLMModel {
  id: string;
  providerId: string;
  name: string;
}

export interface ProviderModelPanelProps {
  providers: LLMProvider[];
  models: LLMModel[];
  selectedProviderId: string | null;
  selectedModelId: string | null;
  onProviderSelect: (providerId: string) => void;
  onModelSelect: (modelId: string) => void;
}

export const ProviderModelPanel: React.FC<ProviderModelPanelProps> = ({
  providers,
  models,
  selectedProviderId,
  selectedModelId,
  onProviderSelect,
  onModelSelect,
}) => {
  const selectedProvider = providers.find(provider => provider.id === selectedProviderId)
  const providerModels = selectedProviderId === null
    ? []
    : models.filter(model => model.providerId === selectedProviderId)
  const modelsDisabled = selectedProvider === undefined || !selectedProvider.available

  return (
    <section className={styles.panel} aria-labelledby="provider-panel-title">
      <h2 className={styles.title} id="provider-panel-title">
        Провайдер и модель
      </h2>

      <div className={styles.group}>
        <h3 className={styles.subtitle}>Провайдеры</h3>
        {providers.length === 0 ? (
          <p className={styles.empty}>Провайдеры не найдены</p>
        ) : (
          <ul className={styles.list}>
            {providers.map(provider => {
              const className = [
                styles.option,
                provider.id === selectedProviderId ? styles.selected : '',
                provider.available ? '' : styles.unavailableOption,
              ].join(' ')

              return (
                <li key={provider.id}>
                  <button
                    type="button"
                    className={className}
                    aria-pressed={provider.id === selectedProviderId}
                    disabled={!provider.available}
                    onClick={() => onProviderSelect(provider.id)}
                  >
                    <span className={styles.optionName}>{provider.name}</span>
                    <span className={provider.available ? styles.available : styles.unavailable}>
                      {provider.available ? 'доступен' : 'недоступен'}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className={styles.group}>
        <h3 className={styles.subtitle}>Модели</h3>
        {selectedProviderId === null ? (
          <p className={styles.empty}>Сначала выберите провайдера</p>
        ) : providerModels.length === 0 ? (
          <p className={styles.empty}>У выбранного провайдера нет моделей</p>
        ) : (
          <ul className={styles.list}>
            {providerModels.map(model => {
              const className = [
                styles.option,
                model.id === selectedModelId ? styles.selected : '',
              ].join(' ')

              return (
                <li key={model.id}>
                  <button
                    type="button"
                    className={className}
                    aria-pressed={model.id === selectedModelId}
                    disabled={modelsDisabled}
                    onClick={() => onModelSelect(model.id)}
                  >
                    {model.name}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
