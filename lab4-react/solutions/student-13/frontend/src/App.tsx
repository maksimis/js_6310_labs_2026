import { useEffect, useState, type ChangeEvent, type ReactElement } from 'react'

import { SoundBrowser, StepSequencer } from '@student-13/music-ui'
import '@student-13/music-ui/style.css'

import { AudioEngine } from './audio'
import { createTrack, DEFAULT_SOUNDS, initialTracks, MAX_SOUNDS, MAX_TRACKS, STEP_COUNT } from './model'

import type { Sound, Track } from '@student-13/music-ui'

export function App(): ReactElement {
  const [engine] = useState<AudioEngine>(() => new AudioEngine())
  const [tracks, setTracks] = useState<Track[]>(initialTracks)
  const [sounds, setSounds] = useState<Sound[]>(DEFAULT_SOUNDS)
  const [selectedTrackId, setSelectedTrackId] = useState<string>('track-1')
  const [bpm, setBpm] = useState<number>(120)
  const [playing, setPlaying] = useState<boolean>(false)
  const [playingStep, setPlayingStep] = useState<number | null>(null)
  const [busy, setBusy] = useState<boolean>(false)
  const [starting, setStarting] = useState<boolean>(false)
  const [notice, setNotice] = useState<string>('Kick, Snare и Hi-hat уже назначены дорожкам. Включите шаги или замените звуки своими.')
  const selectedTrack = tracks.find((track) => track.id === selectedTrackId)
  const readyToPlay = tracks.some((track) => track.soundId !== null && track.steps.some(Boolean))

  useEffect(() => {
    engine.update(tracks, bpm)
  }, [engine, tracks, bpm])

  useEffect(() => {
    const onVisibility = (): void => {
      if (document.hidden) {
        engine.stop()
        setPlaying(false)
        setPlayingStep(null)
      }
    }

    document.addEventListener('visibilitychange', onVisibility)

    return (): void => {
      document.removeEventListener('visibilitychange', onVisibility)
      engine.dispose()
    }
  }, [engine])

  const changeTrack = (id: string, change: (track: Track) => Track): void => {
    setTracks((previous) => previous.map((track) => track.id === id ? change(track) : track))
  }

  const stop = (): void => {
    engine.stop()
    setPlaying(false)
    setPlayingStep(null)
    setNotice('Воспроизведение остановлено. Ритм и загруженные сэмплы сохранены в текущей сессии.')
  }

  const play = async (): Promise<void> => {
    setStarting(true)

    try {
      await engine.start(setPlayingStep)
      setPlaying(true)
      setNotice('Воспроизводится такт из 16 шагов. Изменяйте шаги прямо во время игры.')
    } catch {
      setNotice('Не удалось включить звук. Проверьте поддержку Web Audio и разрешения браузера.')
    } finally {
      setStarting(false)
    }
  }

  const upload = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = Array.from(event.target.files ?? [])

    event.target.value = ''

    if (files.length === 0) {
      return
    }

    setBusy(true)

    const added: Sound[] = []
    const errors: string[] = []

    for (const file of files) {
      if (sounds.length + added.length >= MAX_SOUNDS) {
        errors.push('Библиотека вмещает до 32 звуков')
        break
      }

      const id = crypto.randomUUID()

      try {
        await engine.load(file, id)
        added.push({ id, name: file.name })
      } catch {
        errors.push(`${file.name}: не удалось загрузить. Нужен аудиофайл до 20 МБ и 30 секунд, формат должен поддерживаться браузером.`)
      }
    }

    setSounds((previous) => [...previous, ...added])
    setNotice(`Загружено: ${added.length}.${errors.length > 0 ? ` ${errors.join(' ')}` : ' Нажмите название сэмпла, чтобы назначить его выбранному каналу.'}`)
    setBusy(false)
  }

  const selectSound = (id: string): void => {
    const sound = sounds.find((item) => item.id === id)

    if (sound) {
      changeTrack(selectedTrackId, (track) => ({ ...track, soundId: id, name: sound.name.replace(/\.[^.]+$/, '') }))
      setNotice(`Звук «${sound.name}» назначен выбранному каналу.`)
    }
  }

  const preview = async (id: string): Promise<void> => {
    try {
      await engine.preview(id)
    } catch {
      setNotice('Не удалось прослушать сэмпл. Попробуйте ещё раз после разрешения звука.')
    }
  }

  const addTrack = (): void => {
    const id = crypto.randomUUID()

    setTracks((previous) => [...previous, createTrack(id, `Канал ${previous.length + 1}`)])
    setSelectedTrackId(id)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="#"><span className="brand-icon">▥</span> BEAT LAB <small>REACT / 04</small></a>
        <span className="local-badge"><i /> Локальная сессия</span>
      </header>
      <main>
        <div className="page-title"><div><p className="eyebrow">ВАШИ СЭМПЛЫ. ВАШ РИТМ.</p><h1>Соберите свой бит<span>.</span></h1><p>Выберите канал, назначьте звук и включите шаги.</p></div><span className="project-number">001 / UNTITLED</span></div>
        <section className="transport" aria-label="Управление воспроизведением">
          <button className={`play-button ${playing ? 'is-playing' : ''}`} disabled={busy || starting || (!playing && !readyToPlay)} onClick={() => { if (playing) { stop() } else { void play() } }}>{playing ? '■ Стоп' : starting ? 'Запуск…' : '▶ Играть'}</button>
          <label className="tempo">ТЕМП <input aria-label="Темп BPM" type="number" min={40} max={240} value={bpm} onChange={(event) => setBpm(Math.min(240, Math.max(40, Number(event.target.value) || 40)))} /><span>BPM</span></label>
          <div className="position"><small>ПОЗИЦИЯ</small><strong>{playingStep === null ? '—' : String(playingStep + 1).padStart(2, '0')} <span>/ 16</span></strong></div>
          <span className="transport-note">16 шагов · 4 доли · сетка 1/16</span>
        </section>
        <div className="workspace">
          <aside className="panel library-panel"><div className="panel-heading"><h2>Звуки</h2><span>LIBRARY</span></div>
            <label className={`upload-button ${busy ? 'busy' : ''}`}>{busy ? 'Загрузка…' : '+ Добавить сэмплы'}<input aria-label="Добавить сэмплы" type="file" accept=".wav,.mp3,.ogg,.flac,.m4a,.aac" multiple disabled={busy || starting} onChange={(event) => { void upload(event) }} /></label>
            <p className="file-hint">WAV, MP3 и другие аудиоформаты<br />до 20 МБ и 30 секунд на звук</p>
            <SoundBrowser sounds={sounds} selectedSoundId={selectedTrack?.soundId ?? null} onSelect={selectSound} onPreview={(id) => { void preview(id) }} disabled={busy} targetName={selectedTrack?.name} />
          </aside>
          <section className="panel rack-panel"><div className="panel-heading"><h2>Секвенсор</h2><span>{String(tracks.length).padStart(2, '0')} КАНАЛА / 16 ШАГОВ</span></div>
            <StepSequencer tracks={tracks} selectedTrackId={selectedTrackId} playingStep={playingStep} stepCount={STEP_COUNT} onVolumeChange={(id, volume) => changeTrack(id, (track) => ({ ...track, volume }))} onSelectTrack={setSelectedTrackId} onToggleStep={(id, step) => changeTrack(id, (track) => ({ ...track, steps: track.steps.map((enabled, index) => index === step ? !enabled : enabled) }))} onToggleMute={(id) => changeTrack(id, (track) => ({ ...track, muted: !track.muted }))} onToggleSolo={(id) => changeTrack(id, (track) => ({ ...track, solo: !track.solo }))} />
            <div className="rack-footer"><button disabled={tracks.length >= MAX_TRACKS} onClick={addTrack}>+ Добавить канал</button><button onClick={() => { stop(); setTracks((previous) => previous.map((track) => ({ ...track, steps: Array<boolean>(STEP_COUNT).fill(false) }))) }}>Очистить ритм</button></div>
            <div className="rack-help"><span><b>M</b> отключить канал</span><span><b>S</b> слушать только solo-каналы</span><span><i /> активный шаг</span></div>
          </section>
        </div>
        <p className="notice" role="status" aria-label="Состояние приложения" aria-live="polite">{notice}</p>
        <footer className="app-footer"><span>Ваши файлы остаются в браузере. После обновления страницы загрузите их заново.</span><span>JAVASCRIPT → TYPESCRIPT → SOUND</span></footer>
      </main>
    </div>
  )
}
