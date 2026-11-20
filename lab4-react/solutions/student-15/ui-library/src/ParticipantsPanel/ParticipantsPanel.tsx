import React, { useEffect, useState } from 'react'

import styles from './ParticipantsPanel.module.css'
import { formatRelativeTime } from '../utils/time'

export interface Participant {
  id: string;
  name: string;
  online: boolean;
}

export interface ParticipantsPanelProps {
  participants: Participant[];
  lastUpdatedAt?: number;
}

export const ParticipantsPanel: React.FC<ParticipantsPanelProps> = ({
  participants,
  lastUpdatedAt,
}) => {
  const [now, setNow] = useState<number>(() => Date.now())

  const onlineCount = participants.filter((participant) => participant.online).length
  const isSynced = typeof lastUpdatedAt === 'number'
  const updatedLabel = isSynced ? formatRelativeTime(lastUpdatedAt, now) : 'нет данных'

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h2 className={styles.title}>Участники и синхронизация</h2>
        <span className={isSynced ? styles.statusOnline : styles.statusOffline}>
          {isSynced ? 'Синхронизировано' : 'Ожидание'}
        </span>
      </header>

      <div className={styles.sync}>
        <span className={styles.syncLabel}>Последнее обновление:</span>
        <span className={styles.syncValue}>{updatedLabel}</span>
      </div>

      <ul className={styles.list}>
        {participants.map((participant) => (
          <li className={styles.item} key={participant.id}>
            <span className={styles.name}>{participant.name}</span>
            <span className={styles.state}>
              <span
                className={participant.online ? styles.dotOnline : styles.dotOffline}
                aria-hidden="true"
              />
              <span className={participant.online ? styles.online : styles.offline}>
                {participant.online ? 'онлайн' : 'офлайн'}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <footer className={styles.footer}>
        Онлайн: {onlineCount} из {participants.length}
      </footer>
    </section>
  )
}
