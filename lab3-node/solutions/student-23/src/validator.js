import { TOPICS } from './tasks.js';

export function validateGenerate(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Body должен быть объектом' };
  }
  const { topic, type } = body;
  if (!topic || typeof topic !== 'string' || !TOPICS[topic]) {
    return { valid: false, error: 'Неверная тема. Доступно: js, node, db' };
  }
  if (type !== 'theory' && type !== 'test') {
    return { valid: false, error: 'Неверный тип. Доступно: theory, test' };
  }
  return { valid: true };
}

export function validateCheck(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Body должен быть объектом' };
  }
  const { taskId, answer } = body;
  if (!taskId || typeof taskId !== 'string') {
    return { valid: false, error: 'taskId обязателен и должен быть строкой' };
  }
  if (!answer || typeof answer !== 'string' || answer.trim() === '') {
    return { valid: false, error: 'answer обязателен и не может быть пустым' };
  }
  return { valid: true };
}