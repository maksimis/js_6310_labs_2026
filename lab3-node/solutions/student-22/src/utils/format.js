import { ALGORITHMS } from '../sorting/algorithms.js';

// [5, 3, 8] -> "[5, 3, 8]"
export function formatArray(array) {
  return `[${array.join(', ')}]`;
}

// Список алгоритмов для подсказки пользователю
export function formatAlgorithmList() {
  return Object.values(ALGORITHMS)
      .map((algorithm, index) => `${index + 1}. ${algorithm.title} (${algorithm.aliases[0]})`)
      .join('\n');
}

// Результат пошаговой сортировки
export function formatSortResult(title, array, sortResult) {
  const lines = [`Сортировка: ${title}`, `Исходный массив: ${formatArray(array)}`];

  if (sortResult.steps.length === 0) {
    lines.push('Массив уже отсортирован, перестановки не понадобились.');
  } else {
    sortResult.steps.forEach((step, index) => {
      lines.push(`Шаг ${index + 1}: ${formatArray(step)}`);
    });
  }

  lines.push(`Результат: ${formatArray(sortResult.result)}`);
  lines.push(`Сравнений: ${sortResult.comparisons}, обменов: ${sortResult.swaps}`);
  return lines.join('\n');
}

// Кто из двух алгоритмов лучше по одному показателю
function winner(first, second, valueA, valueB) {
  if (valueA === valueB) {
    return 'одинаково';
  }
  return valueA < valueB ? first : second;
}

// Результат сравнения двух алгоритмов
export function formatComparison(array, first, second) {
  return [
    `Сравнение на массиве ${formatArray(array)}`,
    `${first.title}: сравнений ${first.comparisons}, обменов ${first.swaps}`,
    `${second.title}: сравнений ${second.comparisons}, обменов ${second.swaps}`,
    `Меньше сравнений: ${winner(first.title, second.title, first.comparisons, second.comparisons)}`,
    `Меньше обменов: ${winner(first.title, second.title, first.swaps, second.swaps)}`,
  ].join('\n');
}
