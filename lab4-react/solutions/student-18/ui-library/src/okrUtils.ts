export type OkrStatus = 'not_started' | 'in_progress' | 'urgent' | 'completed'

export interface KeyResult {
  id: number
  title: string
  target: number
  current: number
}

export interface Goal {
  id: number
  title: string
  deadline: string
  status?: OkrStatus
  keyResults: KeyResult[]
}

export const isValidTitle = (text: string): boolean => {
  if (!text || typeof text !== 'string') {
    return false
  }

  const trimmed = text.trim()

  if (trimmed.length === 0 || trimmed.length > 100) {
    return false
  }

  if (trimmed.startsWith('/')) {
    return false
  }

  return true
}

export const isValidDate = (dateStr: string): boolean => {
  if (!dateStr || typeof dateStr !== 'string') {
    return false
  }

  const match = dateStr.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/)

  if (!match) {
    return false
  }

  const day = parseInt(match[1], 10)
  const month = parseInt(match[2], 10)
  const year = parseInt(match[3], 10)

  if (month < 1 || month > 12) {
    return false
  }

  if (day < 1 || day > 31) {
    return false
  }

  if (year < 2024 || year > 2100) {
    return false
  }

  const daysInMonth = new Date(year, month, 0).getDate()

  if (day > daysInMonth) {
    return false
  }

  const inputDate = new Date(year, month - 1, day, 23, 59, 59, 999)
  const now = new Date()

  if (inputDate < now) {
    return false
  }

  return true
}

export const isPositiveNumber = (val: string | number): boolean => {
  const num = Number(val)

  return !Number.isNaN(num) && num > 0 && Number.isFinite(num)
}

export const isNonNegativeNumber = (val: string | number): boolean => {
  const num = Number(val)

  return !Number.isNaN(num) && num >= 0 && Number.isFinite(num)
}

export const isValidId = (val: string | number): boolean => {
  const num = Number(val)

  return Number.isInteger(num) && num > 0
}

export const calculateKrProgress = (kr: KeyResult): number => {
  if (!kr || kr.target <= 0) {
    return 0
  }

  if (kr.current >= kr.target) {
    return 100
  }

  const ratio = Math.max(0, kr.current / kr.target)
  const rounded = Math.round(ratio * 100)

  return Math.min(99, rounded)
}

export const calculateKrContribution = (kr: KeyResult, totalCount: number): number => {
  if (totalCount <= 0) {
    return 0
  }

  return Math.round(calculateKrProgress(kr) / totalCount)
}

export const calculateGoalProgress = (goal: Pick<Goal, 'keyResults'>): number => {
  if (!goal || !goal.keyResults || goal.keyResults.length === 0) {
    return 0
  }

  const progresses = goal.keyResults.map((kr) => calculateKrProgress(kr))
  const allCompleted = progresses.every((p) => p >= 100)

  if (allCompleted) {
    return 100
  }

  const total = progresses.reduce((sum, p) => sum + p, 0)
  const rounded = Math.round(total / goal.keyResults.length)

  return Math.min(99, rounded)
}

export const calculateOverallProgress = (goals: Goal[]): number => {
  if (goals.length === 0) {
    return 0
  }

  const progresses = goals.map((goal) => calculateGoalProgress(goal))
  const allCompleted = progresses.every((p) => p >= 100)

  if (allCompleted) {
    return 100
  }

  const total = progresses.reduce((sum, p) => sum + p, 0)
  const rounded = Math.round(total / goals.length)

  return Math.min(99, rounded)
}

export const resolveGoalStatus = (progress: number, status?: OkrStatus): OkrStatus => {
  if (progress >= 100) {
    return 'completed'
  }

  if (status === 'urgent') {
    return 'urgent'
  }

  if (status) {
    return status
  }

  if (progress <= 0) {
    return 'not_started'
  }

  return 'in_progress'
}

export const getStatusLabel = (status: OkrStatus): string => {
  const labels: Record<OkrStatus, string> = {
    not_started: 'Не начато',
    in_progress: 'В работе',
    urgent: 'Срочное',
    completed: 'Выполнено',
  }

  return labels[status]
}

export const getFilledSquaresCount = (progress: number): number => {
  const clamped = Math.min(100, Math.max(0, progress))

  return Math.floor(clamped / 10)
}
