// Алгоритмы сортировки.
// Каждая функция НЕ меняет исходный массив и возвращает объект:
//   result      — отсортированный массив;
//   steps       — состояние массива после каждого изменения (для пошагового показа);
//   comparisons — сколько раз сравнивали два элемента;
//   swaps       — сколько раз переставляли элементы.

// Пузырёк: соседние элементы сравниваются и меняются местами,
// если стоят в неправильном порядке. Большие элементы «всплывают» в конец.
export function bubbleSort(input) {
  const arr = [...input];
  const steps = [];
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      comparisons++;
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        steps.push([...arr]);
      }
    }
  }

  return { result: arr, steps, comparisons, swaps };
}

// Вставки: берём очередной элемент и сдвигаем его влево,
// пока слева от него стоит элемент больше.
export function insertionSort(input) {
  const arr = [...input];
  const steps = [];
  let comparisons = 0;
  let swaps = 0;

  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0) {
      comparisons++;
      if (arr[j - 1] <= arr[j]) {
        break;
      }
      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
      swaps++;
      steps.push([...arr]);
      j--;
    }
  }

  return { result: arr, steps, comparisons, swaps };
}

// Быстрая: выбираем опорный элемент (последний), переносим меньшие элементы
// левее него, большие — правее, и повторяем то же самое для обеих частей.
export function quickSort(input) {
  const arr = [...input];
  const steps = [];
  let comparisons = 0;
  let swaps = 0;

  const swap = (i, j) => {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    swaps++;
    steps.push([...arr]);
  };

  const partition = (low, high) => {
    const pivot = arr[high];
    let i = low;
    for (let j = low; j < high; j++) {
      comparisons++;
      if (arr[j] < pivot) {
        if (i !== j) {
          swap(i, j);
        }
        i++;
      }
    }
    if (i !== high) {
      swap(i, high);
    }
    return i;
  };

  const sort = (low, high) => {
    if (low >= high) {
      return;
    }
    const pivotIndex = partition(low, high);
    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  };

  sort(0, arr.length - 1);
  return { result: arr, steps, comparisons, swaps };
}

// Слиянием: делим массив пополам, сортируем половины и сливаем их.
// Слияние не меняет элементы местами попарно, поэтому за «обмен» считаем
// запись элемента на новое место (если там стоял другой элемент).
export function mergeSort(input) {
  const arr = [...input];
  const steps = [];
  let comparisons = 0;
  let swaps = 0;

  const place = (index, value) => {
    if (arr[index] !== value) {
      swaps++;
    }
    arr[index] = value;
  };

  const merge = (left, middle, right) => {
    const leftPart = arr.slice(left, middle + 1);
    const rightPart = arr.slice(middle + 1, right + 1);
    const before = arr.join(',');
    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftPart.length && j < rightPart.length) {
      comparisons++;
      if (leftPart[i] <= rightPart[j]) {
        place(k, leftPart[i]);
        i++;
      } else {
        place(k, rightPart[j]);
        j++;
      }
      k++;
    }
    while (i < leftPart.length) {
      place(k, leftPart[i]);
      i++;
      k++;
    }
    while (j < rightPart.length) {
      place(k, rightPart[j]);
      j++;
      k++;
    }

    // Шаг записываем, только если массив изменился
    if (arr.join(',') !== before) {
      steps.push([...arr]);
    }
  };

  const sort = (left, right) => {
    if (left >= right) {
      return;
    }
    const middle = Math.floor((left + right) / 2);
    sort(left, middle);
    sort(middle + 1, right);
    merge(left, middle, right);
  };

  sort(0, arr.length - 1);
  return { result: arr, steps, comparisons, swaps };
}

// Список доступных алгоритмов: ключ, название для пользователя,
// функция сортировки и варианты написания, которые понимает бот.
export const ALGORITHMS = {
  bubble: {
    title: 'Пузырёк',
    sort: bubbleSort,
    aliases: ['bubble', 'пузырек', 'пузырьком', '1'],
  },
  insertion: {
    title: 'Вставки',
    sort: insertionSort,
    aliases: ['insertion', 'вставки', 'вставками', '2'],
  },
  quick: {
    title: 'Быстрая',
    sort: quickSort,
    aliases: ['quick', 'быстрая', '3'],
  },
  merge: {
    title: 'Слиянием',
    sort: mergeSort,
    aliases: ['merge', 'слиянием', 'слияние', '4'],
  },
};

// Возвращает ключ алгоритма по введённому названию или null, если не нашли.
export function findAlgorithm(name) {
  if (typeof name !== 'string') {
    return null;
  }
  const normalized = name.trim().toLowerCase().replace(/ё/g, 'е');
  const key = Object.keys(ALGORITHMS).find((algorithmKey) =>
    ALGORITHMS[algorithmKey].aliases.includes(normalized));
  return key || null;
}
