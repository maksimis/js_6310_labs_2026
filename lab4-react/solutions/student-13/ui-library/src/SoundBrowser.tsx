import { useState } from 'react'
import type { ReactElement } from 'react'

import type { Sound } from './types'

export interface SoundBrowserProps {
  sounds: readonly Sound[]
  selectedSoundId: string | null
  onSelect: (soundId: string) => void
  onPreview: (soundId: string) => void
  disabled?: boolean
  targetName?: string
}

export function SoundBrowser({ sounds, selectedSoundId, onSelect, onPreview, disabled = false, targetName }: SoundBrowserProps): ReactElement {
  const [query, setQuery] = useState<string>('')
  const filtered = sounds.filter((sound) => sound.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))

  return (
    <section className="sound-browser" aria-label="Браузер звуков">
      <label className="sound-search">Поиск сэмплов
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Например, kick" />
      </label>
      <p className="sound-count">{sounds.length} звуков · {targetName ? `Назначить на дорожку «${targetName}»` : 'Сначала выберите дорожку справа'}</p>
      {sounds.length === 0 && <p className="ui-empty">Загрузите свои аудиофайлы, чтобы начать.</p>}
      {sounds.length > 0 && filtered.length === 0 && <p className="ui-empty">Ничего не найдено. Измените запрос.</p>}
      <ul className="sound-list">
        {filtered.map((sound) => (
          <li key={sound.id} className={selectedSoundId === sound.id ? 'sound-selected' : ''}>
            <button className="preview-button" aria-label={`Прослушать ${sound.name}`} disabled={disabled} onClick={() => onPreview(sound.id)}>▶</button>
            <button className="sound-name" aria-label={sound.name} title={`Назначить ${sound.name} выбранной дорожке`} aria-pressed={selectedSoundId === sound.id} disabled={disabled} onClick={() => onSelect(sound.id)}>{sound.name}<small>{selectedSoundId === sound.id ? '✓ На выбранной дорожке' : 'Назначить →'}</small></button>
          </li>
        ))}
      </ul>
    </section>
  )
}
