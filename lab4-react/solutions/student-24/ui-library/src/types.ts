export type Priority = 'low' | 'medium' | 'high' | 'critical'

export interface Tag {
  id: string
  name: string
  color: string
}

export interface User {
  id: string
  displayName: string
}

export interface Task {
  id: string
  title: string
  priority: Priority
  tags: Tag[]
  assignee?: User
}

export interface Column {
  id: string
  title: string
  tasks: Task[]
}
