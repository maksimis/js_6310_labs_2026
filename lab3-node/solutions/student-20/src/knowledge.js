function words(text) {
  return [...new Set(text.toLowerCase().replaceAll('ё', 'е').match(/[\p{L}\p{N}]+/gu) ?? [])];
}

export class ValidationError extends Error {}

export function validateText(value, label, maxLength) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw new ValidationError(`${label}: введите от 1 до ${maxLength} символов.`);
  }
  return value.trim();
}

export class KnowledgeBase {
  #fragments = [];

  add(input) {
    const title = validateText(input?.title, 'Заголовок', 100);
    const content = validateText(input?.content, 'Содержание', 3000);
    const fragment = { id: this.#fragments.length + 1, title, content };
    this.#fragments.push(fragment);
    return { ...fragment };
  }

  search(query) {
    const terms = words(validateText(query, 'Запрос', 200));
    if (!terms.length) {
      throw new ValidationError('Запрос должен содержать хотя бы одно слово или число.');
    }
    return this.#fragments.map(fragment => {
      const vocabulary = new Set(words(`${fragment.title} ${fragment.content}`));
      const matches = terms.filter(term => vocabulary.has(term)).length;
      return { ...fragment, relevance: Math.round(matches / terms.length * 100) };
    }).filter(fragment => fragment.relevance > 0)
        .sort((left, right) => right.relevance - left.relevance || left.id - right.id);
  }
}
