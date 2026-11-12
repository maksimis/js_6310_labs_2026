export function calcPercent(part, total) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}