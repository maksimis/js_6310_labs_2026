import styles from './StatisticsPanel.module.css'

export interface StatisticsPanelProps {
    speed: number
    errors: number
    accuracy: number
    time: number
}

export const StatisticsPanel = ({
  speed,
  errors,
  accuracy,
  time,
}: StatisticsPanelProps) => {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  const statistics = [
    { label: 'Скорость', value: `${speed} зн./мин` },
    { label: 'Ошибки', value: String(errors) },
    { label: 'Точность', value: `${accuracy.toFixed(1)}%` },
    {
      label: 'Время',
      value: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
    },
  ]

  return (
    <section className={styles.panel} aria-label="Статистика печати">
      {statistics.map(statistic => (
        <div className={styles.item} key={statistic.label}>
          <span className={styles.label}>{statistic.label}</span>
          <strong className={styles.value}>{statistic.value}</strong>
        </div>
      ))}
    </section>
  )
}