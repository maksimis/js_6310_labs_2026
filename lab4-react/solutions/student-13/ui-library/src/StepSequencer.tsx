import type { ReactElement } from 'react'

import type { Track } from './types'

export interface StepSequencerProps {
  tracks: readonly Track[]
  selectedTrackId: string | null
  onSelectTrack: (trackId: string) => void
  onToggleStep: (trackId: string, step: number) => void
  onToggleMute: (trackId: string) => void
  onToggleSolo: (trackId: string) => void
  onVolumeChange: (trackId: string, volume: number) => void
  playingStep?: number | null
  stepCount?: number
}

export function StepSequencer({ tracks, selectedTrackId, onSelectTrack, onToggleStep, onToggleMute, onToggleSolo, onVolumeChange, playingStep = null, stepCount = 16 }: StepSequencerProps): ReactElement {
  const hasSolo = tracks.some((track) => track.solo)

  return (
    <div className="sequencer" role="group" aria-label="Шаговый секвенсор">
      <div className="sequencer-scroll">
        <div className="sequence-header">
          <span>Канал / звук</span>
          <div className="step-row">
            {Array.from({ length: stepCount }, (_, step) => <span key={step}>{String(step + 1).padStart(2, '0')}</span>)}
          </div>
          <span>Mute / Solo · Громкость</span>
        </div>
        {tracks.length === 0 && <p className="ui-empty">Дорожек пока нет. Добавьте канал.</p>}
        {tracks.map((track) => (
          <div key={track.id} className={`sequence-track ${selectedTrackId === track.id ? 'selected' : ''} ${track.muted || (hasSolo && !track.solo) ? 'silenced' : ''}`}>
            <button className="channel-name" title="Выбрать дорожку и заменить её звук в библиотеке" aria-pressed={selectedTrackId === track.id} onClick={() => onSelectTrack(track.id)}>
              <strong>{track.name}</strong>
              <small>{track.soundId === null ? 'Выберите сэмпл в библиотеке' : 'Нажмите, чтобы заменить звук ←'}</small>
            </button>
            <div className="step-row">
              {Array.from({ length: stepCount }, (_, step) => (
                <button key={step} className={`step ${track.steps[step] ? 'active' : ''} ${playingStep === step ? 'playing' : ''}`} aria-label={`${track.name}: шаг ${step + 1}`} aria-pressed={Boolean(track.steps[step])} onClick={() => onToggleStep(track.id, step)} />
              ))}
            </div>
            <div className="channel-controls"><div className="channel-switches">
              <button aria-label={`${track.name}: mute`} aria-pressed={track.muted} onClick={() => onToggleMute(track.id)}>M</button>
              <button aria-label={`${track.name}: solo`} aria-pressed={track.solo} onClick={() => onToggleSolo(track.id)}>S</button>
            </div><label className="channel-volume"><input aria-label={`${track.name}: громкость`} type="range" min={0} max={100} value={track.volume} onChange={(event) => onVolumeChange(track.id, Number(event.target.value))} /><output>{track.volume}%</output></label></div>
          </div>
        ))}
      </div>
    </div>
  )
}
