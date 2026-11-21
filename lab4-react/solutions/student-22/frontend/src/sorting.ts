// Один шаг сортировки: состояние массива и какие элементы подсвечивать
export interface SortStep {
  array: number[]
  comparing: number[]
  sorted: number[]
}

export type SortFunction = (input: number[]) => SortStep[]

// [0, 1, ..., n - 1]
const range = (n: number): number[] => Array.from({ length: n }, (_, i) => i)

// Пузырёк: сравниваем соседей, больший уезжает вправо.
// После каждого прохода последний элемент встаёт на своё место
export const bubbleSortSteps: SortFunction = (input) => {
  const arr = [...input]
  const steps: SortStep[] = [{ array: [...arr], comparing: [], sorted: [] }]
  const sorted: number[] = []

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      steps.push({ array: [...arr], comparing: [j, j + 1], sorted: [...sorted] })

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }

    sorted.push(arr.length - 1 - i)
  }

  steps.push({ array: [...arr], comparing: [], sorted: range(arr.length) })

  return steps
}

// Вставки: берём очередной элемент и сдвигаем влево, пока сосед слева больше
export const insertionSortSteps: SortFunction = (input) => {
  const arr = [...input]
  const steps: SortStep[] = [{ array: [...arr], comparing: [], sorted: [] }]

  for (let i = 1; i < arr.length; i++) {
    let j = i

    while (j > 0) {
      steps.push({ array: [...arr], comparing: [j - 1, j], sorted: range(i) })

      if (arr[j - 1] <= arr[j]) {
        break
      }

      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
      j--
    }
  }

  steps.push({ array: [...arr], comparing: [], sorted: range(arr.length) })

  return steps
}

// Выбором: ищем минимум в неотсортированной части и ставим его в начало
export const selectionSortSteps: SortFunction = (input) => {
  const arr = [...input]
  const steps: SortStep[] = [{ array: [...arr], comparing: [], sorted: [] }]

  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i

    for (let j = i + 1; j < arr.length; j++) {
      steps.push({ array: [...arr], comparing: [minIndex, j], sorted: range(i) })

      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }

    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
  }

  steps.push({ array: [...arr], comparing: [], sorted: range(arr.length) })

  return steps
}

export const ALGORITHMS: { value: string, label: string, run: SortFunction }[] = [
  { value: 'bubble', label: 'Пузырёк', run: bubbleSortSteps },
  { value: 'insertion', label: 'Вставки', run: insertionSortSteps },
  { value: 'selection', label: 'Выбором', run: selectionSortSteps },
]

// Шаги для выбранного алгоритма (если название неизвестно — пузырёк)
export const getSteps = (algorithm: string, input: number[]): SortStep[] => {
  const found = ALGORITHMS.find((item) => item.value === algorithm)

  return (found ?? ALGORITHMS[0]).run(input)
}
