export const formatRelativeTime = (timestamp: number, now: number): string => {
  const diffSeconds = Math.max(0, Math.round((now - timestamp) / 1000))

  if (diffSeconds < 5) {
    return 'только что'
  }

  if (diffSeconds < 60) {
    return `${diffSeconds} сек. назад`
  }

  const minutes = Math.floor(diffSeconds / 60)

  if (minutes < 60) {
    return `${minutes} мин. назад`
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours} ч. назад`
  }

  const days = Math.floor(hours / 24)

  return `${days} д. назад`
}
