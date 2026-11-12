const pad = (value: number): string => value.toString().padStart(2, '0')

export const formatRequestTime = (isoDate: string): string => {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  const day = pad(date.getUTCDate())
  const month = pad(date.getUTCMonth() + 1)
  const year = date.getUTCFullYear()
  const hours = pad(date.getUTCHours())
  const minutes = pad(date.getUTCMinutes())
  const seconds = pad(date.getUTCSeconds())

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`
}
