export class MockProvider {
  constructor() {
    this.name = 'mock';
    this._models = ['mock-small', 'mock-large'];
    this._status = 'available';
  }

  getModels() {
    return [...this._models];
  }

  getStatus() {
    return this._status;
  }

  setStatus(status) {
    this._status = status;
  }

  async chat(model, message) {
    try {
      if (typeof message !== 'string' || message.length === 0) {
        throw new Error('Message must be a non-empty string');
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
      
      // При успешном выполнении гарантируем статус 'available'
      this.setStatus('available');
      return `[${this.name}/${model}] Echo: ${message}`;
    } catch (err) {
      // При ошибке используем метод setStatus
      this.setStatus('unavailable');
      throw err;
    }
  }
}