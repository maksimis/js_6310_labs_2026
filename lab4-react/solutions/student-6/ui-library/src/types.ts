export type RepeatMode = 'none' | 'daily' | 'weekdays' | 'weekly'

export interface Task {
  id: string
  title: string
  time: string
  repeat: RepeatMode
  completed: boolean
}

export type NewTaskData = Omit<Task, 'id' | 'completed'>
