import { useEffect, useState } from 'react'

import '@my-app/ui-library/style.css'
import { ArrayBars, ControlPanel } from '@my-app/ui-library'

import './App.css'
import { ALGORITHMS, getSteps } from './sorting'

const INITIAL_ARRAY: number[] = [5, 3, 8, 1, 9, 2, 7, 4, 6]

// Скорость 1..10 превращаем в задержку между шагами: 1 — 1000 мс, 10 — 100 мс
const getDelay = (speed: number): number => 1100 - speed * 100

function App() {
  const [algorithm, setAlgorithm] = useState<string>('bubble')
  const [stepIndex, setStepIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [speed, setSpeed] = useState<number>(5)

  const steps = getSteps(algorithm, INITIAL_ARRAY)
  const step = steps[stepIndex]
  const isFinished = stepIndex === steps.length - 1

  // Пока идёт автовоспроизведение, через задержку переходим к следующему шагу
  useEffect(() => {
    if (!isPlaying || isFinished) {
      return
    }

    const timer = setTimeout(() => setStepIndex((index) => index + 1), getDelay(speed))

    return () => clearTimeout(timer)
  }, [isPlaying, isFinished, stepIndex, speed])

  const handleAlgorithmChange = (value: string): void => {
    setAlgorithm(value)
    setStepIndex(0)
    setIsPlaying(false)
  }

  const handleStep = (): void => {
    setStepIndex((index) => Math.min(index + 1, steps.length - 1))
  }

  const handleReset = (): void => {
    setStepIndex(0)
    setIsPlaying(false)
  }

  return (
    <div className="app">
      <h1>Визуализация сортировки</h1>

      <ControlPanel
        algorithms={ALGORITHMS}
        algorithm={algorithm}
        onAlgorithmChange={handleAlgorithmChange}
        isPlaying={isPlaying && !isFinished}
        isFinished={isFinished}
        onStep={handleStep}
        onPlayPause={() => setIsPlaying((playing) => !playing)}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="bars">
        <ArrayBars values={step.array} comparing={step.comparing} sorted={step.sorted} />
      </div>

      <p className="info">
        Шаг {stepIndex} из {steps.length - 1}
        {isFinished && ' — массив отсортирован'}
      </p>

      <p className="legend">
        <span className="legend-item legend-default">обычный</span>
        <span className="legend-item legend-comparing">сравниваются</span>
        <span className="legend-item legend-sorted">отсортирован</span>
      </p>
    </div>
  )
}

export default App
