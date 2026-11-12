import type { Question, ScoreRecord } from 'ui-library'

export const questions: Question[] = [
  {
    id: 'q1',
    text: 'Столица Франции?',
    options: [
      { id: 'q1-a', text: 'Париж' },
      { id: 'q1-b', text: 'Лондон' },
      { id: 'q1-c', text: 'Мадрид' }
    ],
    correctOptionId: 'q1-a'
  },
  {
    id: 'q2',
    text: 'Сколько будет 7 × 8?',
    options: [
      { id: 'q2-a', text: '54' },
      { id: 'q2-b', text: '56' },
      { id: 'q2-c', text: '64' }
    ],
    correctOptionId: 'q2-b'
  },
  {
    id: 'q3',
    text: 'Какой газ преобладает в атмосфере Земли?',
    options: [
      { id: 'q3-a', text: 'Кислород' },
      { id: 'q3-b', text: 'Азот' },
      { id: 'q3-c', text: 'Углекислый газ' }
    ],
    correctOptionId: 'q3-b'
  }
]

export const initialScoreRecords: ScoreRecord[] = [
  { id: 'r1', player: 'Алиса', score: 200, mode: 'classic' },
  { id: 'r2', player: 'Борис', score: 350, mode: 'blitz' },
  { id: 'r3', player: 'Вера', score: 120, mode: 'classic' },
  { id: 'r4', player: 'Глеб', score: 400, mode: 'survival' },
  { id: 'r5', player: 'Дина', score: 280, mode: 'blitz' }
]