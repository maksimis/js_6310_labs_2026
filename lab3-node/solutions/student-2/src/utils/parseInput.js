export const parsePhysicsParams = (text) => {
  if (typeof text !== 'string') {
    return { isValid: false, error: 'Ожидалась строка с параметрами.' };
  }

  const parts = text.trim().split(/\s+/);
  if (parts.length !== 2) {
    return {
      isValid: false,
      error: 'Введите ровно два числа через пробел: угол (0-360) и скорость (> 0).'
    };
  }

  const angle = Number(parts[0]);
  const speed = Number(parts[1]);

  if (Number.isNaN(angle) || Number.isNaN(speed)) {
    return { isValid: false, error: 'Параметры должны быть числовыми значениями.' };
  }

  if (angle < 0 || angle > 360) {
    return { isValid: false, error: 'Угол должен быть в диапазоне от 0 до 360 градусов.' };
  }

  if (speed <= 0 || speed > 100) {
    return { isValid: false, error: 'Скорость должна быть положительным числом не больше 100.' };
  }

  return { isValid: true, angle, speed };
};