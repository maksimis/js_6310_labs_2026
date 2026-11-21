export function calcCpm(chars, elapsedMs) {
  if (typeof chars !== 'number' || typeof elapsedMs !== 'number') {
    return 0;
  }
  if (Number.isNaN(chars) || Number.isNaN(elapsedMs)) {
    return 0;
  }
  if (elapsedMs <= 0) {
    return 0;
  }
  const cpm = (chars / elapsedMs) * 60000;
  return Math.round(cpm);
}

export function countErrors(reference, typed) {
  if (typeof reference !== 'string' || typeof typed !== 'string') {
    return 0;
  }

  let maxLen = reference.length;
  if (typed.length > maxLen) {
    maxLen = typed.length;
  }

  let errors = 0;
  for (let i = 0; i < maxLen; i += 1) {
    if (reference[i] !== typed[i]) {
      errors += 1;
    }
  }
  return errors;
}

export function calcAccuracy(reference, typed) {
  if (typeof reference !== 'string' || typeof typed !== 'string') {
    return 0;
  }
  if (reference.length === 0) {
    return 0;
  }

  const errors = countErrors(reference, typed);
  let correct = reference.length - errors;
  if (correct < 0) {
    correct = 0;
  }

  const accuracy = (correct / reference.length) * 100;
  return Math.round(accuracy);
}

export function average(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return 0;
  }

  let sum = 0;
  for (let i = 0; i < values.length; i += 1) {
    sum += values[i];
  }

  const avg = sum / values.length;
  return Math.round(avg);
}