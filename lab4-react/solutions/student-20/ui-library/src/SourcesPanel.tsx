import type { ReactElement } from 'react'

export interface SourceFragment {
  id: string
  title: string
  excerpt: string
  /** Доля совпадений от 0 до 1. */
  relevance: number
  url: string
}

export interface SourcesPanelProps {
  sources: readonly SourceFragment[]
}

export function SourcesPanel({ sources }: SourcesPanelProps): ReactElement {
  return (
    <aside className="sources-panel" aria-label="Панель источников">
      <div className="sources-header">
        <h2 className="sources-heading">Источники</h2>
        <span className="sources-count" aria-label={`Найдено источников: ${sources.length}`}>{sources.length}</span>
      </div>
      <p className="sources-description">Фрагменты к последнему ответу.<br />Оценка — доля совпавших слов запроса.</p>
      {sources.length === 0 ? (
        <p className="sources-empty">Пока нет найденных фрагментов. Спросите о state, props или эффектах.</p>
      ) : (
        <ol className="sources-list">
          {sources.map((source: SourceFragment, index: number) => (
            <li className="source-card" key={source.id}>
              <div className="source-meta">
                <span>Заметка / {String(index + 1).padStart(2, '0')}</span>
                <span className="source-score" aria-label={`Релевантность: ${Math.round(source.relevance * 100)}%`}>
                  {Math.round(source.relevance * 100)}%
                </span>
              </div>
              <h3 className="source-title">{source.title}</h3>
              <p className="source-excerpt">{source.excerpt}</p>
              <a className="source-link" href={source.url} aria-label={`Открыть источник: ${source.title}`}>
                Открыть источник <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}
