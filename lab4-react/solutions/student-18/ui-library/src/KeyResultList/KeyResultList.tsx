import React from 'react'

import {
  calculateKrContribution,
  calculateKrProgress,
  getFilledSquaresCount,
} from '../okrUtils'
import styles from './KeyResultList.module.css'

import type { KeyResult } from '../okrUtils'

export interface KeyResultListProps {
  keyResults: KeyResult[]
  onProgressChange: (krId: number, actualValue: number) => void
  disabled?: boolean
}

const SQUARES_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

export const KeyResultList: React.FC<KeyResultListProps> = ({
  keyResults,
  onProgressChange,
  disabled = false,
}) => {
  if (keyResults.length === 0) {
    return (
      <div className={styles.empty}>
        Нет ключевых результатов
      </div>
    )
  }

  const totalCount = keyResults.length
  const maxShare = Math.round(100 / totalCount)
  const sortedKeyResults = [...keyResults].sort((a, b) => {
    const aDone = calculateKrProgress(a) >= 100 ? 1 : 0
    const bDone = calculateKrProgress(b) >= 100 ? 1 : 0

    return aDone - bDone
  })

  const handleInputChange = (krId: number, rawValue: string) => {
    const parsed = Number(rawValue)

    if (Number.isNaN(parsed) || parsed < 0) {
      return
    }

    onProgressChange(krId, parsed)
  }

  return (
    <div className={styles.list}>
      {sortedKeyResults.map((kr) => {
        const krProg = calculateKrProgress(kr)
        const contribution = calculateKrContribution(kr, totalCount)
        const filledSquares = getFilledSquaresCount(krProg)

        return (
          <div key={kr.id} className={styles.item}>
            <div className={styles.itemHeader}>
              <span className={styles.itemTitle}>
                {kr.id}. {kr.title}
              </span>
              <span className={styles.contributionBadge}>
                Вклад в цель: {contribution}% из {maxShare}%
              </span>
            </div>

            <div className={styles.statsRow}>
              <span className={styles.statsText}>
                выполнено {kr.current} из {kr.target} ({krProg}%)
              </span>
              <div className={styles.miniSquares}>
                {SQUARES_INDICES.map((index) => {
                  const isFilled = index < filledSquares

                  return (
                    <span
                      key={index}
                      className={`${styles.miniSquare} ${isFilled ? styles.miniSquareFilled : ''}`}
                    />
                  )
                })}
              </div>
            </div>

            <div className={styles.controls}>
              <input
                type="range"
                className={styles.slider}
                min={0}
                max={kr.target}
                value={Math.min(kr.target, Math.max(0, kr.current))}
                disabled={disabled}
                aria-label={`Ползунок прогресса для ${kr.title}`}
                onChange={(e) => handleInputChange(kr.id, e.target.value)}
              />
              <input
                type="number"
                className={styles.numberInput}
                min={0}
                value={kr.current}
                disabled={disabled}
                aria-label={`Текущее значение для ${kr.title}`}
                onChange={(e) => handleInputChange(kr.id, e.target.value)}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
